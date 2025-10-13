<template>
  <div v-if="column.filterOptions && column.filterOptions.enabled" style="width: 100%">
    <!-- Select Filter -->
    <CFormSelect
      v-if="column.filterOptions.filterType === 'select'"
      :key="`select-${column.field}`"
      style="width: 100%"
      :options="selectOptions"
      @change="handleFilterChange"
    />
    
    <!-- Date Range Filter -->
    <DateRangeFilter
      v-else-if="column.filterOptions.filterType === 'daterange'"
      :key="`daterange-${column.field}`"
      :column="column"
      :placeholder="placeholder"
      @update="handleFilterChange"
    />
    
    <!-- Text Filter (default) -->
    <CFormInput
      v-else
      :key="`text-${column.field}`"
      style="width: 100%"
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
    value: '',  // Use empty string instead of null for better DOM compatibility
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
  // Handle different event types from different input components
  let value
  
  if (eventOrValue?.target) {
    // Standard DOM event from CFormInput or CFormSelect
    value = eventOrValue.target.value
  } else {
    // Direct value from DateRangeFilter or other custom components
    value = eventOrValue
  }
  
  // Call the vue-good-table-next updateFilters callback
  props.updateFilters(props.column, value)
  
  // Also emit our own event to bypass vue-good-table-next's event system
  emit('filter-change', { field: props.column.field, value, column: props.column })
}
</script>

