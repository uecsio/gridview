import { computed } from 'vue'

export const DEFAULT_GRID_SORT = 'id,DESC'

export function effectiveDefaultSort(defaultSort) {
  return (defaultSort && String(defaultSort).trim()) ? defaultSort : DEFAULT_GRID_SORT
}

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
    
    const sort = effectiveDefaultSort(props.defaultSort)
    options.initialSortBy = {
      field: sort.split(',')[0],
      type: sort.split(',')[1]?.toLowerCase() || 'desc'
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

