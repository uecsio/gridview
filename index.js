/**
 * @uecsio/gridview
 * 
 * A powerful, flexible Vue 3 grid component with built-in pagination, 
 * sorting, filtering, and CRUD operations.
 */

import GridView from './src/components/GridView/index.vue'
import GridActionsCell from './src/components/GridView/components/GridActionsCell.vue'
import GridFilterCell from './src/components/GridView/components/GridFilterCell.vue'
import DateRangeFilter from './src/components/GridView/components/filters/DateRangeFilter.vue'
import CommonEditAction from './src/components/GridView/registries/components/CommonEditAction.vue'
import CommonDeleteAction from './src/components/GridView/registries/components/CommonDeleteAction.vue'

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
export { GridActionsCell, GridFilterCell, DateRangeFilter }

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

// Export common formatters (available through formatters registry)
export { commonFormatters } from './src/components/GridView/registries/formatters.js'

// Export common action components
export { CommonEditAction, CommonDeleteAction }

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

// Export constants
export { DEFAULT_ACTIONS, DEFAULT_ACTIONS_WITHOUT_STATUS } from './src/components/GridView/constants/index.js'

// Version
export const version = '1.0.0'
