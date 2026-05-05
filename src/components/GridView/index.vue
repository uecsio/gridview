<template>
  <div :id="id">
    <div class="gv-toolbar">
      <div class="gv-toolbar-item">
        <button
          v-if="extendedFilterSchema && Object.keys(extendedFilterSchema).length > 0"
          class="gv-btn gv-btn-primary"
          @click="updateExtendedFilterVisibility"
        >
          <FontAwesomeIcon icon="search" class="gv-btn-icon" />
          {{ $t('grid.extendedSearch') }}
        </button>
      </div>
      <div class="gv-toolbar-item gv-toolbar-item--end" v-if="addRoute">
        <router-link :to="{ name: addRoute, params: addRouteParams }" class="gv-btn-link">
          <button class="gv-btn gv-btn-success">
            <FontAwesomeIcon icon="plus" class="gv-btn-icon" />
            {{ addText }}
          </button>
        </router-link>
      </div>
      <div class="gv-toolbar-item--full" v-if="showExtendedFilter">
        <div class="gv-card">
          <div class="gv-card-body">
            <h2 class="gv-card-title">{{ $t('grid.extendedSearch') }}</h2>
            <vue-form-generator
              :schema="translatedExtendedSchema"
              :model="extendedFilterModel"
              :options="{ validateAfterLoad: false }"
            />
            <div class="gv-extended-filter-actions">
              <button class="gv-btn gv-btn-primary" @click="applyExtendedFilter">
                <FontAwesomeIcon icon="search" class="gv-btn-icon" />
                {{ $t('grid.search') }}
              </button>
              <button class="gv-btn gv-btn-outline" @click="resetExtendedFilter">
                {{ $t('grid.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div>
        <vue-good-table
          ref="table"
          mode="remote"
          :columns="translatedColumns"
          :rows="gridData.rows"
          :totalRows="gridData.totalRecords"
          :isLoading.sync="gridData.isLoading"
          :pagination-options="paginationOptions"
          :sort-options="sortOptions"
          :select-options="selectOptions"
          :row-style-class="rowStyleClassFn"
          v-on:page-change="onPageChange"
          v-on:sort-change="onSortChange"
          v-on:column-filter="onColumnFilter"
          v-on:per-page-change="onPerPageChange"
          v-on:selected-rows-change="onSelectionChanged"
        >
          <template #loadingContent>
            <div class="gv-loading-wrap">
              <span class="gv-spinner"></span>
            </div>
          </template>

          <template #table-row="props">
            <GridActionsCell
              v-if="props.column.field === 'actions'"
              :column="props.column"
              :row="props.row"
              :all-rows="gridData.rows"
              :action-params="actionParams"
              :load-items="loadItems"
              :module-action-components="moduleActionComponents"
              :update-route="updateRoute"
              @action-event="handleActionEvent"
            />
            <div v-else>
              <span v-if="props.column.rowFormatFn" v-html="props.column.rowFormatFn(props.row)" />
              <span v-else v-html="props.formattedRow[props.column.field]" />
            </div>
          </template>

          <template #column-filter="{ column, updateFilters }">
            <GridFilterCell
              :column="column"
              :update-filters="updateFilters"
              @filter-change="onColumnFilterDirect"
            />
          </template>
        </vue-good-table>
    </div>
    <br />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { useGridQuery } from './composables/useGridQuery.js'
import { useGridEvents } from './composables/useGridEvents.js'
import { useGridConfig } from './composables/useGridConfig.js'
import { useGridColumns } from './composables/useGridColumns.js'
import { useGridActions } from './composables/useGridActions.js'
import { useFormatters } from './composables/useFormatters.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GridActionsCell from './components/GridActionsCell.vue'
import GridFilterCell from './components/GridFilterCell.vue'

// Import GridView-specific styles
import './styles/gridview-base.css'
import './styles/action-links.scss'

const { t } = useI18n()

const emit = defineEmits(['selection-change'])

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  columnsModule: {
    type: Object,
    required: false,
    default: null,
  },
  path: {
    type: String,
    required: true,
    default: ''
  },
  defaultSort: {
    type: String,
    required: false,
    default: 'id,DESC'
  },
  perPage: {
    type: Number,
    required: false,
    default: null
  },
  extraParams: {
    type: String,
    required: false,
    default: ''
  },
  extraData: {
    type: Object,
    required: false,
    default: () => ({})
  },
  addRoute: {
    type: String,
    required: false,
    default: ''
  },
  addRouteParams: {
    type: Object,
    required: false,
    default: () => ({})
  },
  updateRoute: {
    type: String,
    required: false,
    default: ''
  },
  viewRoute: {
    type: String,
    required: false,
    default: ''
  },
  addText: {
    type: String,
    required: false,
    default: ''
  },
  enableCheckboxes: {
    type: Boolean,
    required: false,
    default: false,
  },
  rowStyleClassFn: {
    type: Function,
    required: false,
    default: () => {},
  },
  extendedFilterSchema: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  moduleActionComponents: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  moduleFormatters: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  apiClient: {
    type: Object,
    required: false,
    default: null,
  },
  baseUrl: {
    type: String,
    required: false,
    default: null,
  },
})

// Use TanStack Query for grid data management
const { gridData, updateParams, updateSelectedRows, refetch, apiClient, selectedRows } = useGridQuery(props)

// Use grid event handlers composable
const { 
  extendedFilterForm, 
  onPageChange, 
  onPerPageChange, 
  onSortChange, 
  onColumnFilter, 
  onSelectionChanged 
} = useGridEvents(props, updateParams, updateSelectedRows)

// Use grid configuration composable
const { paginationOptions, sortOptions, selectOptions } = useGridConfig(props, gridData, t)

// Use grid columns composable
const { translatedColumns: rawTranslatedColumns } = useGridColumns(props, t)

// Process columns with formatters
const translatedColumns = computed(() => {
  return processColumns(rawTranslatedColumns.value)
})

// Use grid actions composable
const { actionParams, loadItems } = useGridActions(props, refetch, apiClient)

// Use formatters composable
const { processColumns } = useFormatters(props.moduleFormatters, t)

// Extended filter visibility toggle
const showExtendedFilter = ref(false)
const updateExtendedFilterVisibility = () => {
  showExtendedFilter.value = !showExtendedFilter.value
}

// Extended filter form model and translated schema
const extendedFilterModel = reactive({})

const translatedExtendedSchema = computed(() => {
  if (!props.extendedFilterSchema?.fields) return { fields: [] }
  return {
    ...props.extendedFilterSchema,
    fields: props.extendedFilterSchema.fields.map(field => ({
      ...field,
      label: field.label ? t(field.label) : field.label,
      placeholder: field.placeholder ? t(field.placeholder) : field.placeholder,
    }))
  }
})

// Apply extended filter values as column filters
const applyExtendedFilter = () => {
  const currentFilters = { ...gridData.value.serverParams.columnFilters }

  for (const field of (props.extendedFilterSchema?.fields || [])) {
    const value = extendedFilterModel[field.model]
    if (value !== null && value !== undefined && value !== '') {
      currentFilters[field.model] = value
    } else {
      delete currentFilters[field.model]
    }
  }

  onColumnFilter({ columnFilters: currentFilters })
}

// Reset extended filter form and remove its filters
const resetExtendedFilter = () => {
  const currentFilters = { ...gridData.value.serverParams.columnFilters }

  for (const field of (props.extendedFilterSchema?.fields || [])) {
    extendedFilterModel[field.model] = ''
    delete currentFilters[field.model]
  }

  onColumnFilter({ columnFilters: currentFilters })
}

// Direct filter handler (bypasses vue-good-table-next event system)
const onColumnFilterDirect = ({ field, value, column }) => {
  // Get current filters from gridData
  const currentFilters = { ...gridData.value.serverParams.columnFilters }

  // Update or remove the filter
  // Treat null, undefined, empty string, and string "null" as "no filter"
  if (value !== null && value !== undefined && value !== '' && value !== 'null') {
    currentFilters[field] = value
  } else {
    delete currentFilters[field]
  }

  // Build the params object in the same format as vue-good-table-next
  const params = {
    columnFilters: currentFilters
  }

  // Call the onColumnFilter handler from useGridEvents
  onColumnFilter(params)
}

// Get current sort for a field
const getCurrentSort = (field) => {
  const currentSort = gridData.value.serverParams.sort
  if (currentSort && currentSort.length > 0 && currentSort[0].field === field) {
    return currentSort[0].type
  }
  return null
}

// Handle manual header click for sorting
const handleHeaderClick = (column) => {
  if (!column.sortable) return

  const currentSort = getCurrentSort(column.field)
  let newSortType = 'asc'

  if (currentSort === 'asc') {
    newSortType = 'desc'
  } else if (currentSort === 'desc') {
    newSortType = 'asc'
  }

  // Manually trigger the sort change
  onSortChange([{
    field: column.field,
    type: newSortType
  }])
}

// Handle events from custom action components
const handleActionEvent = (event) => {
  console.log('Action event:', event)

  switch (event.type) {
    case 'deleted':
      // Could show success notification
      console.log('Item deleted:', event.data)
      break
    case 'error':
      // Could show error notification
      console.error('Action error:', event.data)
      break
    default:
      console.log('Unknown action event:', event)
  }
}

defineExpose({
  loadItems: refetch,
  selectedRows,
  gridData,
})

watch(
  selectedRows,
  (rows) => {
    emit('selection-change', rows)
  },
  { deep: true }
)
</script>

<style scoped>
/* Hide selection info row */
:deep(.vgt-selection-info-row) {
  display: none;
}

/* Loading state */
:deep(.vgt-inner-wrap.is-loading) {
  opacity: 0.75;
}

/* Footer styling */
:deep(.footer__row-count__label) {
  margin-bottom: 0;
}

:deep(.footer__row-count__label),
:deep(.footer__row-count__select),
:deep(.footer__navigation__page-info),
:deep(.footer__navigation__page-btn span) {
  font-size: 0.9rem !important;
}

:deep(.footer__navigation__page-btn) {
  vertical-align: top !important;
}

</style>
