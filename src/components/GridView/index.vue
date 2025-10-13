<template>
  <div :id="id">
    <CRow class="mt-3">
      <CCol :md="4" :lg="3" :sm="12">
        <CButton 
          v-if="extendedFilterSchema && Object.keys(extendedFilterSchema).length > 0" 
          color="primary" 
          class="w-100"
          @click="updateExtendedFilterVisibility"
        >
          <CIcon icon="cilSearch" class="me-2" />
          {{ $t('grid.extendedSearch') }}
        </CButton>
      </CCol>
      <CCol :md="4" :lg="3" :sm="12" :offset-md="6" class="ms-auto" v-if="addRoute">
        <router-link :to="{ name: addRoute, params: addRouteParams }">
          <CButton color="success" class="w-100">
            <CIcon icon="cilPlus" class="me-2" />
            {{ addText }}
          </CButton>
        </router-link>
      </CCol>
      <CCol :sm="12" v-if="showExtendedFilter">
        <br />
        <CCard>
          <CCardHeader>
            <strong>{{ $t('grid.extendedSearch') }}</strong>
          </CCardHeader>
          <CCardBody>
            <!-- Extended filter form will go here -->
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <br />
    <CRow class="justify-content-center">
      <CCol :md="12">
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
            <div style="margin: auto; text-align: center; padding: 2rem;">
              <CSpinner color="primary" />
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
              @action-event="handleActionEvent"
            />
            <div v-else>
              <span v-html="props.formattedRow[props.column.field]" />
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
      </CCol>
    </CRow>
    <br />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { useGridQuery } from './composables/useGridQuery.js'
import { useGridEvents } from './composables/useGridEvents.js'
import { useGridConfig } from './composables/useGridConfig.js'
import { useGridColumns } from './composables/useGridColumns.js'
import { useGridActions } from './composables/useGridActions.js'
import { useFormatters } from './composables/useFormatters.js'
import GridActionsCell from './components/GridActionsCell.vue'
import GridFilterCell from './components/GridFilterCell.vue'

// Import GridView-specific styles
import './styles/action-links.scss'

const { t } = useI18n()

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
})

// Use TanStack Query for grid data management
const { gridData, updateParams, updateSelectedRows, refetch } = useGridQuery(props)

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
const { actionParams, loadItems } = useGridActions(props, refetch)

// Use formatters composable
const { processColumns } = useFormatters(props.moduleFormatters, t)

// Extended filter visibility toggle
const showExtendedFilter = ref(false)
const updateExtendedFilterVisibility = () => {
  showExtendedFilter.value = !showExtendedFilter.value
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

.sort-icon {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: var(--cui-primary, #321fdb);
}
</style>
