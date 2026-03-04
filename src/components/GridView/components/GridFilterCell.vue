<template>
  <div v-if="column.filterOptions && column.filterOptions.enabled" style="width: 100%">
    <!-- Select Filter -->
    <select
      v-if="column.filterOptions.filterType === 'select'"
      :key="`select-${column.field}`"
      class="gv-select"
      @change="handleFilterChange"
    >
      <option v-for="opt in selectOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- Date Range Filter -->
    <DateRangeFilter
      v-else-if="column.filterOptions.filterType === 'daterange'"
      :key="`daterange-${column.field}`"
      :column="column"
      :placeholder="placeholder"
      @update="handleFilterChange"
    />

    <!-- Text Filter (default) -->
    <input
      v-else
      :key="`text-${column.field}`"
      class="gv-input"
      @input="handleFilterChange"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import DateRangeFilter from './DateRangeFilter.vue'

const { t } = useI18n()

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  updateFilters: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['filter-change'])

/**
 * Computed placeholder text with i18n support
 */
const placeholder = computed(() => {
  if (props.column.filterOptions?.placeholderKey) {
    return t(props.column.filterOptions.placeholderKey)
  }
  return props.column.filterOptions?.placeholder || ''
})

/**
 * Computed select options with i18n support
 */
const selectOptions = computed(() => {
  const placeholderOption = {
    value: '',
    label: placeholder.value
  }

  const items = (props.column.filterOptions?.items || []).map(item => ({
    value: item.value,
    label: item.textKey ? t(item.textKey) : item.text
  }))

  return [placeholderOption, ...items]
})

/**
 * Handle filter change event
 */
const handleFilterChange = (eventOrValue) => {
  let value

  if (eventOrValue?.target) {
    value = eventOrValue.target.value
  } else {
    value = eventOrValue
  }

  props.updateFilters(props.column, value)

  emit('filter-change', { field: props.column.field, value, column: props.column })
}
</script>
