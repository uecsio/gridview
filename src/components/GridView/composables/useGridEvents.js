import { ref } from 'vue'

/**
 * Composable for handling grid events (pagination, sorting, filtering)
 * Manages event handlers for vue-good-table-next
 */
export function useGridEvents(props, updateParams, updateSelectedRows) {
  const extendedFilterForm = ref({})

  /**
   * Handle page change event
   */
  const onPageChange = (params) => {
    updateParams({ page: params.currentPage })
  }

  /**
   * Handle items per page change event
   */
  const onPerPageChange = (params) => {
    updateParams({ perPage: params.currentPerPage })
  }

  /**
   * Handle sort change event
   */
  const onSortChange = (params) => {
    const fieldIndex = props.columns.findIndex((column) => column.field === params[0].field)
    if (fieldIndex > -1) {
      const column = props.columns[fieldIndex]
      updateParams({
        sort: [{
          type: params[0].type,
          field: column.field,
        }],
      })
    }
  }

  /**
   * Handle column filter change event
   * Processes filter values and maps them to appropriate field names
   */
  const onColumnFilter = (params) => {
    const columnFilters = {}
    
    for (let field in params.columnFilters) {
      const fieldValue = params.columnFilters[field]
      const fieldIndex = props.columns.findIndex((column) => {
        return column.field && column.field.toString() === field
      })
      
      // Include filter only if value is not empty
      if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
        const column = props.columns[fieldIndex]
        const fieldName = (fieldIndex > -1 && column.filterField)
          ? column.filterField
          : field
        columnFilters[fieldName] = fieldValue
      }
    }
    
    updateParams({ columnFilters })
    extendedFilterForm.value = params.columnFilters
  }

  /**
   * Handle row selection change event (for checkboxes)
   */
  const onSelectionChanged = (rowsSettings) => {
    updateSelectedRows(rowsSettings.selectedRows)
  }

  return {
    extendedFilterForm,
    onPageChange,
    onPerPageChange,
    onSortChange,
    onColumnFilter,
    onSelectionChanged
  }
}

