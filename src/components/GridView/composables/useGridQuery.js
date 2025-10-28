import { ref, computed, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { createApiClient } from '@uecsio/api-client'

/**
 * Composable for fetching grid data using TanStack Query
 * Handles caching, refetching, and loading states automatically
 */
export function useGridQuery(props) {
  // Get query client for cache management
  const queryClient = useQueryClient()
  
  // Initialize API client based on props
  let apiClient
  if (props.apiClient) {
    // Use provided apiClient
    apiClient = props.apiClient
  } else if (props.baseUrl) {
    // Create new apiClient with baseUrl
    apiClient = createApiClient({ baseURL: props.baseUrl })
  } else {
    // Throw clear error if neither is provided
    throw new Error(
      'GridView requires either "apiClient" or "baseUrl" prop. ' +
      'Please provide one of these props to configure API requests.\n' +
      'Example: <GridView :api-client="myApiClient" ... /> or <GridView base-url="https://api.example.com" ... />'
    )
  }
  
  // Server parameters
  const serverParams = ref({
    page: 1,
    perPage: props.perPage || 10,
    sort: [],
    columnFilters: {}
  })

  // Selected rows for checkboxes
  const selectedRows = ref([])

  // Build API URL with all parameters
  const buildUrl = () => {
    const host = environmentService.getApiBaseUrl()
    let url = `${host}${props.path}?page=${serverParams.value.page}&limit=${serverParams.value.perPage}`
    
    // Add sorting
    if (serverParams.value.sort.length > 0) {
      url += `&sort=${serverParams.value.sort[0].field},${serverParams.value.sort[0].type.toUpperCase()}`
    } else if (props.defaultSort) {
      url += `&sort=${props.defaultSort}`
    }
    
    // Add column filters
    if (Object.keys(serverParams.value.columnFilters).length > 0) {
      for (let field in serverParams.value.columnFilters) {
        const fieldValue = serverParams.value.columnFilters[field]
        url += getFilter(field, fieldValue)
      }
    }
    
    // Add extra params
    if (props.extraParams) {
      url += props.extraParams
    }
    
    return url
  }

  // Get filter string based on column type
  const getFilter = (fieldName, fieldValue) => {
    const column = props.columns.find((col) => col.field === fieldName)
    
    if (!column) {
      return `&filter=${fieldName}||cont||${fieldValue}`
    }
    
    const filterType = column.filterOptions?.filterType
    
    switch (filterType) {
      case 'daterange': {
        if (fieldValue.includes(',')) {
          const [startDateStr, endDateStr] = fieldValue.split(',')
          const startDate = new Date(startDateStr)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(endDateStr)
          endDate.setHours(23, 59, 59, 999)
          return `&filter=${fieldName}||between||${encodeURIComponent(startDate.toISOString())},${encodeURIComponent(endDate.toISOString())}`
        }
        const startDate = new Date(fieldValue)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        return `&filter=${fieldName}||between||${encodeURIComponent(startDate.toISOString())},${encodeURIComponent(endDate.toISOString())}`
      }
      
      case 'select': {
        return `&filter=${fieldName}||eq||${fieldValue}`
      }
      
      case 'text':
      default: {
        const operation = column.filterOptions?.strict ? 'eq' : 'cont'
        return `&filter=${fieldName}||${operation}||${fieldValue}`
      }
    }
  }

  // Fetch function for TanStack Query
  const fetchGridData = async () => {
    const url = buildUrl()
    const result = await apiClient.get(url)
    
    // Handle checkbox selection
    if (props.enableCheckboxes && result.data) {
      result.data = result.data.map(row => {
        const checked = selectedRows.value.find(selectedRow => row.id === selectedRow.id)
        row.vgtSelected = checked
        return row
      })
    }
    
    return result
  }

  // Create unique query key based on all parameters
  const queryKey = computed(() => [
    'grid',
    props.id,
    serverParams.value.page,
    serverParams.value.perPage,
    JSON.stringify(serverParams.value.sort),
    JSON.stringify(serverParams.value.columnFilters),
    props.extraParams
  ])

  // Use TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchGridData,
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Computed grid data with defaults
  const gridData = computed(() => ({
    rows: data.value?.data || [],
    totalRecords: data.value?.total || 0,
    isLoading: isLoading.value,
    serverParams: serverParams.value,
    selectedRows: selectedRows.value
  }))

  // Update server params (will trigger refetch automatically)
  const updateParams = (newParams) => {
    // If filters changed, reset to page 1
    if (newParams.columnFilters !== undefined && JSON.stringify(newParams.columnFilters) !== JSON.stringify(serverParams.value.columnFilters)) {
      serverParams.value = { ...serverParams.value, ...newParams, page: 1 }
    } else {
      serverParams.value = { ...serverParams.value, ...newParams }
    }
  }

  // Update selected rows
  const updateSelectedRows = (rows) => {
    selectedRows.value = rows
  }

  // Watch for prop changes that should trigger refetch
  watch(() => props.id, () => {
    serverParams.value = {
      page: 1,
      perPage: props.perPage || 10,
      sort: [],
      columnFilters: {}
    }
  })

  watch(() => props.extraParams, () => {
    refetch()
  })

  // Cache management functions
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['grid', props.id] })
  }

  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ['grid', props.id] })
  }

  return {
    gridData,
    serverParams,
    updateParams,
    updateSelectedRows,
    refetch,
    clearCache,
    invalidateCache,
    isLoading,
    isError,
    error,
    apiClient
  }
}

