import { computed } from 'vue'

/**
 * Composable for managing grid actions
 * Provides action parameters and callbacks for row actions
 */
export function useGridActions(props, refetch, apiClient = null) {
  // Extract base URL from apiClient if available
  const getBaseUrl = () => {
    if (apiClient?.defaults?.baseURL) {
      return apiClient.defaults.baseURL
    }
    if (props.baseUrl) {
      return props.baseUrl
    }
    return ''
  }

  const host = getBaseUrl()

  /**
   * Action parameters passed to action callbacks
   */
  const actionParams = computed(() => ({
    url: host + props.path,
    host: host,
    path: props.path,
    updateRoute: props.updateRoute,
    viewRoute: props.viewRoute,
    extraData: props.extraData,
    apiClient: apiClient,
  }))

  /**
   * Refresh grid data
   * Exposed to action callbacks to allow data refresh after operations
   */
  const loadItems = () => {
    refetch()
  }

  return {
    host,
    actionParams,
    loadItems
  }
}

