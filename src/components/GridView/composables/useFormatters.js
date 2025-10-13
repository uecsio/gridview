/**
 * Formatter resolution composable
 * Handles resolution of formatters with fallback logic
 */

import { getCommonFormatter } from '../registries/formatters.js'

/**
 * Formatter resolution composable
 * 
 * @param {Object} moduleFormatters - Module-specific formatters registry
 * @param {Function} t - Translation function
 * @returns {Object} - Formatter resolution functions
 */
export function useFormatters(moduleFormatters = {}, t = null) {
  
  /**
   * Get formatter by name with fallback logic
   * 1. Check module-specific registry first
   * 2. Fall back to common registry
   * 
   * @param {string} name - Formatter name
   * @returns {Function|null} - Formatter function or null
   */
  const getFormatter = (name) => {
    // First check module-specific registry
    if (moduleFormatters && moduleFormatters[name]) {
      return moduleFormatters[name]
    }
    
    // Fall back to common registry
    return getCommonFormatter(name)
  }
  
  /**
   * Check if a formatter exists (in either registry)
   * 
   * @param {string} name - Formatter name
   * @returns {boolean} - True if formatter exists
   */
  const hasFormatter = (name) => {
    return (moduleFormatters && name in moduleFormatters) || 
           getCommonFormatter(name) !== null
  }
  
  /**
   * Process column configuration and resolve formatters
   * 
   * @param {Object} column - Column configuration
   * @returns {Object} - Processed column with resolved formatter
   */
  const processColumn = (column) => {
    if (!column.formatter) return column
    
    const formatter = getFormatter(column.formatter)
    if (!formatter) {
      console.warn(`Formatter '${column.formatter}' not found`)
      return column
    }
    
    return {
      ...column,
      formatFn: (value) => {
        const options = { ...column.formatterOptions }
        if (t) {
          options.t = t
        }
        return formatter(value, options)
      }
    }
  }
  
  /**
   * Process multiple columns
   * 
   * @param {Array} columns - Array of column configurations
   * @returns {Array} - Array of processed columns
   */
  const processColumns = (columns) => {
    return columns.map(processColumn)
  }
  
  /**
   * Create a formatter function from configuration
   * 
   * @param {string} formatterName - Name of the formatter
   * @param {Object} options - Formatter options
   * @returns {Function|null} - Formatter function or null
   */
  const createFormatter = (formatterName, options = {}) => {
    const formatter = getFormatter(formatterName)
    if (!formatter) return null
    
    return (value) => formatter(value, options)
  }
  
  /**
   * Validate formatter configuration
   * 
   * @param {Object} column - Column configuration
   * @returns {Object} - Validation result
   */
  const validateColumn = (column) => {
    const result = {
      isValid: true,
      errors: []
    }
    
    if (column.formatter && !hasFormatter(column.formatter)) {
      result.isValid = false
      result.errors.push(`Formatter '${column.formatter}' not found`)
    }
    
    return result
  }
  
  /**
   * Get available formatters (both common and module-specific)
   * 
   * @returns {Object} - Object with available formatters
   */
  const getAvailableFormatters = () => {
    const common = getCommonFormatterNames()
    const module = moduleFormatters ? Object.keys(moduleFormatters) : []
    
    return {
      common,
      module,
      all: [...common, ...module]
    }
  }
  
  return {
    getFormatter,
    hasFormatter,
    processColumn,
    processColumns,
    createFormatter,
    validateColumn,
    getAvailableFormatters
  }
}
