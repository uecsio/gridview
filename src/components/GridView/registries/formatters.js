/**
 * Common Formatters Registry
 * 
 * Registry for reusable formatters across all modules.
 * These formatters handle common data types and formatting needs.
 */

import { format } from 'date-fns'

/**
 * Registry of available common formatters
 * Key: formatter name, Value: formatter function
 */
export const commonFormatters = {
  // Date formatters
  'CommonDateFormatter': (value, options = {}) => {
    if (!value) return '-'
    
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) return '-'
      
      const formatString = options.format || 'dd.MM.yyyy'
      return format(date, formatString)
    } catch (error) {
      console.warn('Date formatting error:', error, 'Value:', value)
      return '-'
    }
  },

  'CommonDateTimeFormatter': (value, options = {}) => {
    if (!value) return '-'
    
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) return '-'
      
      const formatString = options.format || 'dd.MM.yyyy HH:mm'
      return format(date, formatString)
    } catch (error) {
      console.warn('DateTime formatting error:', error, 'Value:', value)
      return '-'
    }
  },

  // Number formatters
  'CommonCurrencyFormatter': (value, options = {}) => {
    if (value === null || value === undefined) return '-'
    
    const locale = options.locale || 'en-US'
    const currency = options.currency || 'USD'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value)
  },

  'CommonNumberFormatter': (value, options = {}) => {
    if (value === null || value === undefined) return '-'
    
    const locale = options.locale || 'en-US'
    const decimals = options.decimals || 2
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  },

  // Text formatters
  'CommonTruncateFormatter': (value, options = {}) => {
    if (!value) return '-'
    
    const maxLength = options.maxLength || 50
    const suffix = options.suffix || '...'
    
    if (value.length <= maxLength) return value
    return value.substring(0, maxLength - suffix.length) + suffix
  },

  'CommonUppercaseFormatter': (value, options = {}) => {
    if (!value) return '-'
    return value.toString().toUpperCase()
  },

  'CommonLowercaseFormatter': (value, options = {}) => {
    if (!value) return '-'
    return value.toString().toLowerCase()
  },

  // Boolean formatters
  'CommonBooleanFormatter': (value, options = {}) => {
    const trueText = options.trueText || 'Yes'
    const falseText = options.falseText || 'No'
    
    return value ? trueText : falseText
  },

  // Status formatters
  'CommonStatusFormatter': (value, options = {}) => {
    if (!options.mapping) return value
    
    const translationKey = options.mapping[value]
    if (!translationKey) return value
    
    // If the translation function is available in options, use it
    if (options.t && typeof options.t === 'function') {
      return options.t(translationKey)
    }
    
    // Otherwise return the translation key (will be handled by the grid)
    return translationKey
  },

  // Percentage formatters
  'CommonPercentageFormatter': (value, options = {}) => {
    if (value === null || value === undefined) return '-'
    
    const decimals = options.decimals || 1
    return `${(value * 100).toFixed(decimals)}%`
  },

  // File size formatters
  'CommonFileSizeFormatter': (value, options = {}) => {
    if (value === null || value === undefined) return '-'
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = value
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    const decimals = options.decimals || 1
    return `${size.toFixed(decimals)} ${units[unitIndex]}`
  }
}

/**
 * Register a new common formatter
 * 
 * @param {string} name - Formatter name
 * @param {Function} formatter - Formatter function
 * 
 * @example
 * registerCommonFormatter('MyFormatter', (value, options) => {
 *   return value.toUpperCase()
 * })
 */
export function registerCommonFormatter(name, formatter) {
  commonFormatters[name] = formatter
}

/**
 * Get a common formatter by name
 * 
 * @param {string} name - Formatter name
 * @returns {Function|null} Formatter function or null if not found
 */
export function getCommonFormatter(name) {
  return commonFormatters[name] || null
}

/**
 * Check if a common formatter exists
 * 
 * @param {string} name - Formatter name
 * @returns {boolean} True if formatter exists
 */
export function hasCommonFormatter(name) {
  return name in commonFormatters
}

/**
 * Get all registered common formatter names
 * 
 * @returns {string[]} Array of formatter names
 */
export function getCommonFormatterNames() {
  return Object.keys(commonFormatters)
}
