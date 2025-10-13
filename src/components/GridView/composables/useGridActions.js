import { ref, computed, onMounted } from 'vue'
import environmentService from '@/services/environment.service.js'

/**
 * Composable for managing grid actions
 * Provides action parameters and callbacks for row actions
 */
export function useGridActions(props, refetch) {
  const host = ref('')

  /**
   * Action parameters passed to action callbacks
   */
  const actionParams = computed(() => ({
    url: host.value + props.path,
    host: host.value,
    path: props.path,
    updateRoute: props.updateRoute,
    viewRoute: props.viewRoute,
    extraData: props.extraData,
  }))

  /**
   * Refresh grid data
   * Exposed to action callbacks to allow data refresh after operations
   */
  const loadItems = () => {
    refetch()
  }

  onMounted(() => {
    host.value = environmentService.getApiBaseUrl()
  })

  return {
    host,
    actionParams,
    loadItems
  }
}

