/**
 * Action Components Registry
 * 
 * Registry for dynamically imported action components.
 * Allows defining custom Vue components as actions in grid columns.
 */

// Import common action components
import CommonDeleteAction from './components/CommonDeleteAction.vue'
import CommonEditAction from './components/CommonEditAction.vue'
import CommonStatusAction from './components/CommonStatusAction.vue'

/**
 * Registry of available action components
 * Key: component name, Value: Vue component
 */
export const actionComponents = {
  // Common components (reusable across modules)
  'CommonDeleteAction': CommonDeleteAction,
  'CommonEditAction': CommonEditAction,
  'CommonStatusAction': CommonStatusAction,
}

/**
 * Register a new action component
 * 
 * @param {string} name - Component name
 * @param {Object} component - Vue component
 * 
 * @example
 * import MyCustomAction from './MyCustomAction.vue'
 * registerActionComponent('MyCustomAction', MyCustomAction)
 */
export function registerActionComponent(name, component) {
  actionComponents[name] = component
}

/**
 * Get an action component by name
 * 
 * @param {string} name - Component name
 * @returns {Object|null} Vue component or null if not found
 * 
 * @example
 * const component = getActionComponent('CustomDeleteAction')
 */
export function getActionComponent(name) {
  return actionComponents[name] || null
}

/**
 * Check if an action component exists
 * 
 * @param {string} name - Component name
 * @returns {boolean} True if component exists
 */
export function hasActionComponent(name) {
  return name in actionComponents
}

/**
 * Get all registered action component names
 * 
 * @returns {string[]} Array of component names
 */
export function getActionComponentNames() {
  return Object.keys(actionComponents)
}
