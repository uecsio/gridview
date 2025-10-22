/**
 * @uecsio/gridview
 * 
 * A powerful, flexible Vue 3 grid component with built-in pagination, 
 * sorting, filtering, and CRUD operations.
 */

import GridView from './src/components/GridView/index.vue'

// Export main component
export { GridView }

// Export composables
export { useGridQuery } from './src/components/GridView/composables/useGridQuery.js'
export { useGridEvents } from './src/components/GridView/composables/useGridEvents.js'
export { useGridConfig } from './src/components/GridView/composables/useGridConfig.js'
export { useGridColumns } from './src/components/GridView/composables/useGridColumns.js'
export { useGridActions } from './src/components/GridView/composables/useGridActions.js'
export { useFormatters } from './src/components/GridView/composables/useFormatters.js'

// Export sub-components
export { default as GridActionsCell } from './src/components/GridView/components/GridActionsCell.vue'
export { default as GridFilterCell } from './src/components/GridView/components/GridFilterCell.vue'
export { default as DateRangeFilter } from './src/components/GridView/components/DateRangeFilter.vue'

// Export registries
export { 
  registerCommonFormatter, 
  getCommonFormatter, 
  hasCommonFormatter,
  getCommonFormatterNames 
} from './src/components/GridView/registries/formatters.js'

export { 
  registerActionComponent, 
  getActionComponent, 
  hasActionComponent 
} from './src/components/GridView/registries/actionComponents.js'

// Export cache management utilities
export {
  getQueryClient,
  clearGridCache,
  clearAllGridCache,
  invalidateGridCache,
  invalidateAllGridCache,
  clearAllCache,
  clearCacheByKey,
  invalidateCacheByKey
} from './src/components/GridView/utils/cacheManager.js'

// Export common formatters (available through formatters registry)
export { commonFormatters } from './src/components/GridView/registries/formatters.js'

// Export common action components
export { default as CommonEditAction } from './src/components/GridView/registries/components/CommonEditAction.vue'
export { default as CommonDeleteAction } from './src/components/GridView/registries/components/CommonDeleteAction.vue'

// Note: GridUtils not available in this version

// Default export
export default {
  install(app, options = {}) {
    // Register main component globally
    app.component('GridView', GridView)
    
    // Register sub-components globally
    app.component('GridActionsCell', GridActionsCell)
    app.component('GridFilterCell', GridFilterCell)
    app.component('DateRangeFilter', DateRangeFilter)
    
    // Register common action components globally
    app.component('CommonEditAction', CommonEditAction)
    app.component('CommonDeleteAction', CommonDeleteAction)
    
    // Provide global options
    if (options.globalOptions) {
      app.provide('gridview-options', options.globalOptions)
    }
  }
}

// Version
export const version = '1.0.0'
