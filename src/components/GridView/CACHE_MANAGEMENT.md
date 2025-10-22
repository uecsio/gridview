# GridView Cache Management

The GridView library uses TanStack Query (Vue Query) for efficient data caching. This document explains how to manually manage the cache from your application code.

## Overview

GridView automatically caches data for 30 seconds (`staleTime: 30000`). While this improves performance, there are cases where you need to manually clear or invalidate the cache:

- After creating/updating/deleting records via API
- When external data changes
- On user logout or context changes
- When implementing manual refresh buttons

## Installation

The cache management utilities are exported from the main package:

```javascript
import {
  clearGridCache,
  clearAllGridCache,
  invalidateGridCache,
  invalidateAllGridCache,
  clearAllCache,
  clearCacheByKey,
  invalidateCacheByKey,
  getQueryClient
} from '@uecsio/gridview'
```

## API Reference

### `clearGridCache(gridId)`

Completely removes the cache for a specific grid. Next access will show loading state and fetch fresh data.

```javascript
import { clearGridCache } from '@uecsio/gridview'

// Clear cache for a specific grid
clearGridCache('users-grid')
```

**Parameters:**
- `gridId` (string): The ID of the grid component (matches the `id` prop)

**Use case:** When you know data has changed and want to force a fresh fetch.

---

### `clearAllGridCache()`

Removes the cache for all GridView instances in your application.

```javascript
import { clearAllGridCache } from '@uecsio/gridview'

// Clear cache for all grids
clearAllGridCache()
```

**Use case:** On logout, switching accounts, or global data refresh.

---

### `invalidateGridCache(gridId)`

Marks the cache as stale and triggers an automatic refetch if the grid is currently visible. This is smoother than clearing because it keeps showing old data while fetching new data.

```javascript
import { invalidateGridCache } from '@uecsio/gridview'

// Invalidate cache for a specific grid
invalidateGridCache('users-grid')
```

**Parameters:**
- `gridId` (string): The ID of the grid component

**Use case:** Preferred method for refresh operations as it provides better UX.

---

### `invalidateAllGridCache()`

Marks all grid caches as stale and triggers refetches.

```javascript
import { invalidateAllGridCache } from '@uecsio/gridview'

// Invalidate all grids
invalidateAllGridCache()
```

**Use case:** Global refresh without losing current UI state.

---

### `clearAllCache()`

Clears ALL TanStack Query cache (not just GridView queries). Use with caution.

```javascript
import { clearAllCache } from '@uecsio/gridview'

// Nuclear option: clear everything
clearAllCache()
```

**Use case:** Application-wide reset or error recovery.

---

### `clearCacheByKey(queryKey)`

Advanced: Clear cache using a custom query key pattern.

```javascript
import { clearCacheByKey } from '@uecsio/gridview'

// Clear specific cache by custom key
clearCacheByKey(['grid', 'users-grid', 1, 10])

// Clear all caches matching a pattern
clearCacheByKey(['grid'])
```

**Parameters:**
- `queryKey` (Array): Custom query key array

---

### `invalidateCacheByKey(queryKey)`

Advanced: Invalidate cache using a custom query key pattern.

```javascript
import { invalidateCacheByKey } from '@uecsio/gridview'

// Invalidate specific cache by custom key
invalidateCacheByKey(['grid', 'users-grid'])
```

**Parameters:**
- `queryKey` (Array): Custom query key array

---

### `getQueryClient()`

Get direct access to the TanStack Query client for advanced operations.

```javascript
import { getQueryClient } from '@uecsio/gridview'

const queryClient = getQueryClient()

// Use any TanStack Query client method
queryClient.setQueryData(['grid', 'users-grid'], newData)
queryClient.refetchQueries({ queryKey: ['grid'] })
```

**Returns:** `QueryClient` instance

**Use case:** Advanced cache manipulation not covered by helper functions.

## Common Usage Patterns

### After Creating a Record

```javascript
async function createUser(userData) {
  await api.post('/users', userData)
  
  // Invalidate to show new record
  invalidateGridCache('users-grid')
}
```

### After Updating a Record

```javascript
async function updateUser(userId, userData) {
  await api.put(`/users/${userId}`, userData)
  
  // Invalidate to show updated data
  invalidateGridCache('users-grid')
}
```

### After Deleting a Record

```javascript
async function deleteUser(userId) {
  await api.delete(`/users/${userId}`)
  
  // Clear to force fresh fetch (removes deleted item)
  clearGridCache('users-grid')
}
```

### Manual Refresh Button

```vue
<template>
  <div>
    <button @click="handleRefresh">
      Refresh Data
    </button>
    <GridView id="users-grid" :columns="columns" path="/users" />
  </div>
</template>

<script setup>
import { invalidateGridCache } from '@uecsio/gridview'

function handleRefresh() {
  invalidateGridCache('users-grid')
}
</script>
```

### On User Logout

```javascript
function logout() {
  // Clear user session
  clearSession()
  
  // Clear all cached grid data
  clearAllGridCache()
  
  // Navigate to login
  router.push('/login')
}
```

### Optimistic Updates

```javascript
import { getQueryClient } from '@uecsio/gridview'

async function toggleUserStatus(userId) {
  const queryClient = getQueryClient()
  const queryKey = ['grid', 'users-grid']
  
  // Optimistically update cache
  const previousData = queryClient.getQueryData(queryKey)
  queryClient.setQueryData(queryKey, (old) => {
    return {
      ...old,
      data: old.data.map(user => 
        user.id === userId 
          ? { ...user, active: !user.active }
          : user
      )
    }
  })
  
  try {
    // Make API call
    await api.patch(`/users/${userId}/toggle-status`)
  } catch (error) {
    // Rollback on error
    queryClient.setQueryData(queryKey, previousData)
    throw error
  }
}
```

## Clear vs Invalidate

| Method | Behavior | Loading State | Best For |
|--------|----------|---------------|----------|
| `clearGridCache()` | Removes cache completely | Shows loading spinner | Deleted records, major changes |
| `invalidateGridCache()` | Marks stale, refetches | Shows old data while loading | Updates, creates, refresh buttons |

**Recommendation:** Use `invalidateGridCache()` for most cases as it provides better UX.

## Query Key Structure

GridView uses the following query key structure:

```javascript
['grid', gridId, page, perPage, sortJSON, filtersJSON, extraParams]
```

Example:
```javascript
['grid', 'users-grid', 1, 10, '[{"field":"name","type":"asc"}]', '{}', undefined]
```

This allows granular cache control based on specific grid states.

## TypeScript Support

All cache management functions are fully typed:

```typescript
import { 
  clearGridCache, 
  invalidateGridCache 
} from '@uecsio/gridview'

// TypeScript will ensure correct parameter types
clearGridCache('my-grid') // ✓ OK
clearGridCache(123) // ✗ Error: string expected
```

## Notes

- All cache functions must be called within a Vue component setup or composable where `useQueryClient()` is available
- Cache operations are synchronous but refetches are async
- TanStack Query handles race conditions automatically
- Cache is persisted in memory only (clears on page refresh)

## See Also

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/vue/overview)
- [GridView Main Documentation](./README.md)
- [GridView Architecture](./ARCHITECTURE.md)

