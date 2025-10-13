# GridView Architecture

This document describes the architecture and organization of the GridView component after refactoring.

## File Structure

```
GridView/
├── index.vue                           # Main component (orchestrator)
├── README.md                           # User documentation
├── ARCHITECTURE.md                     # This file
├── composables/
│   ├── useGridQuery.js                # TanStack Query integration
│   ├── useGridEvents.js               # Event handlers (pagination, sort, filter)
│   ├── useGridConfig.js               # Grid configuration (pagination, sort, select options)
│   ├── useGridColumns.js              # Column translation and processing
│   └── useGridActions.js              # Action params and callbacks
└── components/
    ├── GridActionsCell.vue            # Action buttons in table cells
    ├── GridFilterCell.vue             # Filter inputs in column headers
    └── DateRangeFilter.vue            # Date range picker component
```

## Responsibilities

### Main Component (`index.vue`)
**Role**: Orchestrator
- Imports and uses all composables
- Renders the `vue-good-table-next` component
- Provides template slots for custom content
- Manages extended filter visibility (UI state)

**Size**: ~230 lines (reduced from ~400 lines)

### Composables

#### `useGridQuery.js`
**Role**: Data fetching and caching with TanStack Query
- Manages server parameters (page, perPage, sort, columnFilters)
- Builds API URLs with query parameters
- Fetches data from the API
- Handles automatic caching and refetching
- Returns reactive grid data

**Key Features**:
- Automatic query invalidation when params change
- 30-second cache by default
- Smart filter-to-query string conversion
- Resets to page 1 when filters change

#### `useGridEvents.js`
**Role**: Event handler logic
- Handles pagination events (`onPageChange`, `onPerPageChange`)
- Handles sorting events (`onSortChange`)
- Handles filtering events (`onColumnFilter`)
- Handles selection events (`onSelectionChanged`)
- Processes filter values and maps to field names

**Key Features**:
- Clean separation of event handling logic
- Supports custom field mapping via `filterField`
- Filters out empty values

#### `useGridConfig.js`
**Role**: Grid configuration
- Generates pagination options
- Generates sort options
- Generates selection (checkbox) options
- All options are reactive and i18n-aware

**Key Features**:
- Computed properties for efficient reactivity
- Internationalized labels
- Respects prop overrides (e.g., fixed `perPage`)

#### `useGridColumns.js`
**Role**: Column management
- Translates column labels
- Initializes column module with translation function
- Returns reactive translated columns

**Key Features**:
- Automatic initialization on mount
- Supports external column modules

#### `useGridActions.js`
**Role**: Action management
- Provides action parameters for callbacks
- Manages API base URL
- Exposes `loadItems` for manual refresh
- Returns reactive action params

**Key Features**:
- Centralized action configuration
- Easy access to API endpoints and routes

### Components

#### `GridActionsCell.vue`
**Role**: Render action buttons/links in table cells
- Renders route-based actions (router-link)
- Renders callback-based actions (click handler)
- Supports icons and labels
- Supports visibility resolvers
- Handles i18n for titles and labels

**Props**:
- `column` - Column definition with actions
- `row` - Current row data
- `allRows` - All grid rows
- `actionParams` - Action configuration
- `loadItems` - Refresh function

#### `GridFilterCell.vue`
**Role**: Render filter inputs in column headers
- Renders text inputs
- Renders select dropdowns
- Renders date range pickers
- Handles different event formats from different input types
- Supports i18n for placeholders and options

**Props**:
- `column` - Column definition with filter options
- `updateFilters` - Filter update callback from vue-good-table-next

**Key Features**:
- Unified event handling interface
- Automatic i18n support
- Type-based rendering (`filterType`)

#### `DateRangeFilter.vue`
**Role**: Date range selection
- Uses `@vuepic/vue-datepicker`
- Styled to match CoreUI
- Supports locale switching
- Emits formatted date strings (`YYYY-MM-DD,YYYY-MM-DD`)

## Data Flow

```
User Interaction
    ↓
GridFilterCell.vue (captures input)
    ↓
vue-good-table-next (@on-column-filter event)
    ↓
useGridEvents.onColumnFilter (processes filters)
    ↓
useGridQuery.updateParams (updates server params)
    ↓
TanStack Query (detects param change via computed queryKey)
    ↓
useGridQuery.fetchGridData (builds URL and fetches)
    ↓
API Response
    ↓
TanStack Query (caches and returns data)
    ↓
useGridQuery.gridData (reactive computed)
    ↓
index.vue (renders updated table)
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each file has a single, clear responsibility
2. **Reusability**: Composables can be reused in other components
3. **Testability**: Each composable/component can be tested independently
4. **Maintainability**: Easy to find and fix bugs
5. **Readability**: Smaller files are easier to understand
6. **Type Safety**: Clear interfaces between composables
7. **Performance**: TanStack Query handles caching automatically
8. **Extensibility**: Easy to add new features (e.g., new filter types)

## Adding New Features

### Adding a New Filter Type
1. Update `GridFilterCell.vue` to handle the new type
2. Update `useGridQuery.getFilter()` to build the correct query string
3. Update column definition documentation

### Adding a New Action Type
1. Update `GridActionsCell.vue` template
2. Add handler logic if needed
3. Update column definition documentation

### Adding New Grid Configuration
1. Add to `useGridConfig.js`
2. Pass to `vue-good-table-next` in `index.vue`

## Migration from Previous Version

The previous monolithic `index.vue` (~400 lines) has been split into:
- 1 main component (~230 lines)
- 5 composables (~50-180 lines each)
- 3 sub-components (~40-90 lines each)

Total lines increased slightly, but:
- Each file is now focused and understandable
- Logic is properly encapsulated
- Components are independently testable
- Code is more maintainable

