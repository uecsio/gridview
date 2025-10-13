import { computed } from 'vue'

/**
 * Composable for grid configuration options
 * Manages pagination, sorting, and selection settings for vue-good-table-next
 */
export function useGridConfig(props, gridData, t) {
  /**
   * Pagination configuration
   */
  const paginationOptions = computed(() => ({
    enabled: true,
    perPage: props.perPage || gridData.value.serverParams.perPage,
    perPageDropdownEnabled: !props.perPage,
    dropdownAllowAll: false,
    setCurrentPage: gridData.value.serverParams.page,
    nextLabel: t('grid.next'),
    prevLabel: t('grid.prev'),
    rowsPerPageLabel: t('grid.rowsPerPage'),
    allLabel: t('grid.allItemPerPage'),
  }))

  /**
   * Sort configuration
   */
  const sortOptions = computed(() => {
    const options = {
      enabled: true,
    }
    
    // Set initial sort from props
    if (props.defaultSort) {
      options.initialSortBy = {
        field: props.defaultSort.split(',')[0],
        type: props.defaultSort.split(',')[1]?.toLowerCase() || 'desc'
      }
    }
    
    return options
  })

  /**
   * Selection (checkboxes) configuration
   */
  const selectOptions = computed(() => ({
    enabled: props.enableCheckboxes
  }))

  return {
    paginationOptions,
    sortOptions,
    selectOptions
  }
}

