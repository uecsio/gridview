# GridView Component

A Vue 3 data table component built on top of `vue-good-table-next` with server-side pagination, sorting, filtering, and action support. Uses TanStack Query for intelligent caching and data management.

## Features

- ✅ Server-side pagination
- ✅ Server-side sorting
- ✅ Column filtering (text, select, date range)
- ✅ Row selection with checkboxes
- ✅ Custom actions (route links and callbacks)
- ✅ Loading states
- ✅ Internationalization (i18n) support
- ✅ Responsive design with CoreUI styling
- ✅ Automatic caching with TanStack Query
- ✅ Smart refetching and stale data management
- ✅ Extended filter support (planned)

## Installation

The component requires the following packages:

```bash
npm install vue-good-table-next @tanstack/vue-query @vuepic/vue-datepicker
```

## Usage

```vue
<template>
  <GridView
    id="orders-grid"
    :columns="columns"
    path="/orders"
    add-route="Add Order"
    :add-text="$t('orders.addOrder')"
    :enable-checkboxes="true"
    default-sort="createdAt,DESC"
  />
</template>

<script setup>
import GridView from '@/components/GridView/index.vue'
import { columns } from './grid-views/orders.js'
</script>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | String | Yes | - | Unique identifier for the grid instance |
| `columns` | Array | Yes | - | Array of column definitions |
| `path` | String | Yes | - | API endpoint path (e.g., '/orders') |
| `defaultSort` | String | No | 'id,DESC' | Default sorting (format: 'field,DIR') |
| `perPage` | Number | No | null | Fixed rows per page (null = user selectable) |
| `extraParams` | String | No | '' | Additional query parameters for API |
| `extraData` | Object | No | {} | Extra data passed to action callbacks |
| `addRoute` | String | No | '' | Route name for "Add" button |
| `addRouteParams` | Object | No | {} | Route parameters for "Add" button |
| `updateRoute` | String | No | '' | Route name for "Update" action |
| `viewRoute` | String | No | '' | Route name for "View" action |
| `addText` | String | No | '' | Text for "Add" button |
| `enableCheckboxes` | Boolean | No | false | Enable row selection |
| `rowStyleClassFn` | Function | No | () => {} | Function to add custom row classes |
| `extendedFilterSchema` | Object | No | {} | Schema for extended filter form |

## Column Definition

```javascript
export const columns = [
  {
    label: 'orders.form.name', // Translation key
    field: 'name',
    sortable: true,
    filterOptions: {
      enabled: true,
      filterType: 'text', // text, select, daterange
      placeholderKey: 'grid.filterByName'
    }
  },
  {
    label: 'orders.form.status',
    field: 'status',
    sortable: true,
    filterOptions: {
      enabled: true,
      filterType: 'select',
      placeholderKey: 'grid.filterByStatus',
      items: [
        { value: 1, textKey: 'orders.statusValues.active' },
        { value: 0, textKey: 'orders.statusValues.closed' }
      ]
    }
  },
  {
    label: 'orders.date',
    field: 'createdAt',
    sortable: true,
    filterOptions: {
      enabled: true,
      filterType: 'daterange',
      placeholderKey: 'grid.filterByDate'
    }
  },
  {
    label: 'orders.form.createdAt',
    field: 'createdAt',
    sortable: true,
    formatRowValue: true,
    formatFn: (row) => {
      const value = row.createdAt
      if (!value) return '-'
      try {
        const date = new Date(value)
        if (isNaN(date.getTime())) return '-'
        return format(date, 'dd.MM.yyyy HH:mm')
      } catch {
        return '-'
      }
    }
  },
  {
    label: 'common.actions',
    field: 'actions',
    sortable: false,
    actions: [
      {
        label: 'Edit',
        class: 'btn btn-sm btn-primary',
        action: {
          type: 'route',
          name: 'Update Order',
          paramsResolver: (row) => ({ id: row.id })
        }
      },
      {
        label: 'Delete',
        classCallback: (row) => 'btn btn-sm btn-danger',
        action: {
          type: 'callback',
          callbackFunction: async (rows, row, params, loadItems) => {
            if (confirm('Are you sure?')) {
              await fetch(`${params.url}/${row.id}`, { method: 'DELETE' })
              await loadItems()
            }
          }
        }
      }
    ]
  }
]
```

## API Response Format

The component expects the API to return data in the following format:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageCount": 10
}
```

## API Request Format

The component sends requests with the following query parameters:

```
GET /api/orders?page=1&limit=10&sort=createdAt,DESC&filter=name||cont||john
```

Query parameters:
- `page` - Current page number (1-based)
- `limit` - Number of records per page
- `sort` - Sorting (format: `field,DIR` where DIR is ASC or DESC)
- `filter` - Column filters (format: `field||operation||value`)

Filter operations:
- `cont` - Contains (case-insensitive) - default for text fields
- `eq` - Equals - used when `strict: true` in filterOptions
- `between` - Between two values - used for date ranges

## Store

The component uses Pinia store (`useGridStore`) to manage grid state across the application. Each grid instance is identified by its `id` prop and stored separately.

Store structure:
```javascript
{
  'orders-grid': {
    rows: [],
    totalRecords: 0,
    isLoading: false,
    serverParams: {
      page: 1,
      perPage: 10,
      sort: [],
      columnFilters: {}
    },
    selectedRows: []
  }
}
```

## TanStack Query Integration

The GridView component uses **TanStack Query (Vue Query)** for data management instead of Pinia. This provides several benefits:

### Benefits
- **Automatic Caching**: Query results are cached for 30 seconds by default, reducing unnecessary API calls
- **Smart Refetching**: Data is automatically refetched when query parameters change
- **Loading States**: Built-in loading, error, and success states
- **Background Updates**: Stale data is shown immediately while fresh data is fetched in the background
- **Memory Management**: Automatic garbage collection of unused cached data
- **No Manual State Management**: No need to manually manage loading states, error handling, or data storage

### Query Configuration
The default query configuration in `useGridQuery.js`:
```javascript
{
  staleTime: 30000,      // Cache for 30 seconds
  retry: 1,              // Retry once on failure
  refetchOnWindowFocus: false  // Don't refetch when tab regains focus
}
```

### Query Key Structure
Each grid instance has a unique query key based on:
- Grid ID
- Current page
- Items per page
- Sort configuration
- Column filters
- Extra parameters

This ensures proper caching and invalidation when parameters change.

## Styling

The component uses CoreUI classes and can be customized via SCSS variables. It includes:
- Responsive grid layout
- Loading states with spinner
- Custom table styling
- Action button styling

## Internationalization

The component supports Vue i18n. Required translation keys:
- `extendedSearch` - Extended search button text
- `next` - Next page button
- `prev` - Previous page button
- `rowsPerPage` - Rows per page label
- `allItemPerPage` - All items label
- `operationsAreNotResolved` - Error message for missing actions

## Future Enhancements

- [ ] Extended filter form implementation
- [ ] Export to CSV/Excel
- [ ] Column visibility toggle
- [ ] Saved filter presets
- [ ] Bulk actions
- [ ] Optimistic updates with TanStack Query mutations

