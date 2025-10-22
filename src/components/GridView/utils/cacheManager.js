import { useQueryClient } from '@tanstack/vue-query'

/**
 * GridView Cache Manager
 * Provides utilities for managing TanStack Query cache from external code
 */

/**
 * Get the query client instance
 * @returns {QueryClient} The TanStack Query client
 */
export function getQueryClient() {
  return useQueryClient()
}

/**
 * Clear cache for a specific grid by ID
 * @param {string} gridId - The ID of the grid to clear cache for
 */
export function clearGridCache(gridId) {
  const queryClient = useQueryClient()
  queryClient.removeQueries({ queryKey: ['grid', gridId] })
}

/**
 * Clear cache for all grids
 */
export function clearAllGridCache() {
  const queryClient = useQueryClient()
  queryClient.removeQueries({ queryKey: ['grid'] })
}

/**
 * Invalidate cache for a specific grid (marks as stale and refetches)
 * @param {string} gridId - The ID of the grid to invalidate cache for
 */
export function invalidateGridCache(gridId) {
  const queryClient = useQueryClient()
  queryClient.invalidateQueries({ queryKey: ['grid', gridId] })
}

/**
 * Invalidate cache for all grids
 */
export function invalidateAllGridCache() {
  const queryClient = useQueryClient()
  queryClient.invalidateQueries({ queryKey: ['grid'] })
}

/**
 * Clear all TanStack Query cache (not just grids)
 */
export function clearAllCache() {
  const queryClient = useQueryClient()
  queryClient.clear()
}

/**
 * Advanced: Clear cache with custom query key
 * @param {Array} queryKey - Custom query key to clear
 */
export function clearCacheByKey(queryKey) {
  const queryClient = useQueryClient()
  queryClient.removeQueries({ queryKey })
}

/**
 * Advanced: Invalidate cache with custom query key
 * @param {Array} queryKey - Custom query key to invalidate
 */
export function invalidateCacheByKey(queryKey) {
  const queryClient = useQueryClient()
  queryClient.invalidateQueries({ queryKey })
}

