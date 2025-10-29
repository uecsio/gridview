import {
  getQueryClient,
  clearCache,
  invalidateCache,
  clearAllCache as clearAll
} from '@uecsio/query-cache'

/**
 * GridView Cache Manager
 * Wrapper around @uecsio/query-cache for GridView-specific cache operations
 */

/**
 * Get the query client instance
 * @returns {QueryClient} The TanStack Query client
 */
export { getQueryClient }

/**
 * Clear cache for a specific grid by ID
 * @param {string} gridId - The ID of the grid to clear cache for
 */
export function clearGridCache(gridId) {
  clearCache(['grid', gridId])
}

/**
 * Clear cache for all grids
 */
export function clearAllGridCache() {
  clearCache(['grid'])
}

/**
 * Invalidate cache for a specific grid (marks as stale and refetches)
 * @param {string} gridId - The ID of the grid to invalidate cache for
 */
export function invalidateGridCache(gridId) {
  invalidateCache(['grid', gridId])
}

/**
 * Invalidate cache for all grids
 */
export function invalidateAllGridCache() {
  invalidateCache(['grid'])
}

/**
 * Clear all TanStack Query cache (not just grids)
 */
export function clearAllCache() {
  clearAll()
}

/**
 * Advanced: Clear cache with custom query key
 * @param {Array} queryKey - Custom query key to clear
 */
export function clearCacheByKey(queryKey) {
  clearCache(queryKey)
}

/**
 * Advanced: Invalidate cache with custom query key
 * @param {Array} queryKey - Custom query key to invalidate
 */
export function invalidateCacheByKey(queryKey) {
  invalidateCache(queryKey)
}

