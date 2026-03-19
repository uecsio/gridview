# @uecsio/gridview

A powerful, flexible Vue 3 grid component with built-in pagination, sorting, filtering, and CRUD operations. Built with modern Vue 3 Composition API and designed for admin dashboards and data management applications.

## ✨ Features

- 🚀 **Vue 3 Composition API** - Modern, reactive, and performant
- 📊 **Server-side Pagination** - Efficient data loading with TanStack Query
- 🔍 **Advanced Filtering** - Text, select, date range, and custom filters
- 📈 **Sorting** - Multi-column sorting with visual indicators
- 🎨 **Customizable Actions** - Edit, delete, and custom action components
- 🌐 **Internationalization** - Built-in i18n support
- 📱 **Responsive Design** - Works on all screen sizes
- 🎯 **TypeScript Support** - Full type definitions included
- 🔧 **Extensible Architecture** - Plugin system for custom components
- ⚡ **Performance Optimized** - Virtual scrolling and efficient rendering

## 📦 Installation

```bash
npm install @uecsio/gridview
```

## 🔧 Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install vue@^3.0.0 @tanstack/vue-query@^4.0.0 vue-good-table-next@^0.1.0 @vuepic/vue-datepicker@^4.0.0 vue-i18n@^9.0.0 @fortawesome/fontawesome-svg-core@^6.0.0 @fortawesome/free-solid-svg-icons@^6.0.0 @fortawesome/vue-fontawesome@^3.0.0 date-fns@^2.0.0
```

## 🚀 Quick Start

### 1. Basic Setup

```vue
<template>
  <GridView
    id="users-grid"
    :columns="columns"
    path="/api/users"
    add-route="Add User"
    :add-text="$t('users.addUser')"
  />
</template>

<script setup>
import { GridView } from '@uecsio/gridview'
import '@uecsio/gridview/dist/index.css'

const columns = [
  {
    label: 'users.name',
    field: 'name',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByName'
    }
  },
  {
    label: 'users.email',
    field: 'email',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByEmail'
    }
  },
  {
    label: 'common.actions',
    field: 'actions',
    sortable: false,
    actions: [
      {
        action: {
          type: 'component',
          componentName: 'CommonEditAction'
        },
        props: {
          routeName: 'Update User',
          entityName: 'User'
        }
      }
    ]
  }
]
</script>
```

### 2. Advanced Configuration

```vue
<template>
  <GridView
    id="orders-grid"
    :columns="columns"
    :columns-module="ordersColumns"
    path="/api/orders"
    :add-route="'Add Order'"
    :add-text="$t('orders.addOrder')"
    :enable-checkboxes="true"
    default-sort="createdAt,DESC"
    :module-action-components="ordersActionComponents"
    :module-formatters="ordersFormatters"
  />
</template>

<script setup>
import { GridView } from '@uecsio/gridview'
import '@uecsio/gridview/dist/index.css'
import * as ordersColumns from './grid-views/orders.js'
import { ordersActionComponents } from './actions/actionComponents.js'
import { ordersFormatters } from './formatters/formatters.js'

const columns = ordersColumns.columns
</script>
```

## 📋 Column Configuration

### Basic Column

```javascript
{
  label: 'users.name',
  field: 'name',
  sortable: true
}
```

### Filter Configuration

Filters are configured via `filterOptions` on a column. Set `enabled: true` (or rely on the grid's default) and choose a `filterType`.

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | Boolean | Enable filtering for this column |
| `filterType` | `'text'` \| `'select'` \| `'daterange'` | Filter input type |
| `placeholderKey` | String | i18n key for placeholder text |
| `placeholder` | String | Static placeholder (fallback if no `placeholderKey`) |
| `items` | Array | Options for `select` filter (see below) |

Select filter `items` array:

| Key | Type | Description |
|-----|------|-------------|
| `value` | any | Option value sent to API |
| `textKey` | String | i18n key for display text |
| `text` | String | Static display text (fallback if no `textKey`) |

Filter type determines the query operator sent to the API:
- `text` → `field||cont||value`
- `select` → `field||eq||value`
- `daterange` → `field||between||start,end`

#### Text Filter

```javascript
{
  label: 'users.name',
  field: 'name',
  filterOptions: {
    enabled: true,
    filterType: 'text',
    placeholderKey: 'grid.filterByName'
  }
}
```

#### Select Filter

```javascript
{
  label: 'users.status',
  field: 'status',
  filterOptions: {
    enabled: true,
    filterType: 'select',
    placeholderKey: 'grid.filterByStatus',
    items: [
      { value: 1, textKey: 'users.status.active' },
      { value: 0, textKey: 'users.status.inactive' }
    ]
  }
}
```

#### Date Range Filter

```javascript
{
  label: 'orders.createdAt',
  field: 'createdAt',
  filterOptions: {
    enabled: true,
    filterType: 'daterange',
    placeholderKey: 'grid.filterByDate'
  },
  formatter: 'CommonDateFormatter',
  formatterOptions: {
    format: 'dd.MM.yyyy'
  }
}
```

### Column with Actions

```javascript
{
  label: 'common.actions',
  field: 'actions',
  sortable: false,
  actions: [
    {
      componentName: 'CommonToggleAction',
      props: {
        field: 'featured',
        states: [
          { value: 1, icon: 'star', color: '#ffc107', label: 'common.featured' },
          { value: 0, icon: 'star', color: '#ccc', label: 'common.notFeatured' }
        ]
      }
    },
    { componentName: 'CommonStatusAction' },
    {
      componentName: 'CommonEditAction',
      props: { routeName: 'UpdateUser' }
    },
    {
      componentName: 'CommonDeleteAction',
      props: { confirmMessage: 'Are you sure?' }
    }
  ]
}
```

Actions can be conditionally hidden per row with `visibleWhen`. The entire config is JSON-serializable — no callback functions.

Single condition:

```javascript
{
  componentName: 'CommonDeleteAction',
  visibleWhen: { field: 'status', operator: 'neq', value: 'protected' }
}
```

Multiple conditions (AND — all must match):

```javascript
{
  componentName: 'CommonEditAction',
  visibleWhen: [
    { field: 'status', operator: 'eq', value: 1 },
    { field: 'role', operator: 'neq', value: 'guest' }
  ]
}
```

Supported operators:

| Operator | Description | Example value |
|----------|-------------|---------------|
| `eq` | Equals | `1`, `"active"` |
| `neq` | Not equals | `"protected"` |
| `cont` | Contains (case-insensitive) | `"admin"` |
| `in` | Value is in array | `[1, 2, 3]` |
| `between` | Value is in range | `[10, 100]` |

## 🎨 Formatters

### Built-in Formatters

- `CommonDateFormatter` - Format dates
- `CommonStatusFormatter` - Format status values
- `CommonTruncateFormatter` - Truncate long text
- `CommonScoreFormatter` - Format ratings/scores
- `CommonCurrencyFormatter` - Format currency values

### Custom Formatters

```javascript
// Register custom formatter
import { registerCommonFormatter } from '@uecsio/gridview'

registerCommonFormatter('CustomFormatter', (value, options) => {
  return `Custom: ${value}`
})

// Use in column
{
  label: 'custom.field',
  field: 'customField',
  formatter: 'CustomFormatter',
  formatterOptions: {
    prefix: 'Custom: '
  }
}
```

## 🔧 Action Components

### Action Configuration

Each action in the `actions` array has the following structure:

```javascript
{
  componentName: 'CommonEditAction',    // Registered component name
  props: { /* extra props */ },         // Merged into the component as props
  visibleWhen: { field, operator, value } // Optional: declarative visibility condition
}
```

Every action component automatically receives these props from the grid:

| Prop | Type | Description |
|------|------|-------------|
| `row` | Object | Current row data |
| `allRows` | Array | All rows on the current page |
| `actionParams` | Object | Contains `apiClient`, `url`, and route info |
| `loadItems` | Function | Call to refresh grid data |
| `updateRoute` | String | Route name for edit navigation |

### Built-in Actions

#### CommonEditAction

Renders a router-link to the edit page.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `routeName` | String | `null` | Named route override |
| `routeParamsResolver` | Function | `null` | Custom route object resolver `(row) => route` |

```javascript
{
  componentName: 'CommonEditAction',
  props: {
    routeName: 'UpdateUser'
  }
}
```

#### CommonDeleteAction

Deletes a row via API with a confirmation dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `confirmMessage` | String | `null` | Custom confirm dialog text |
| `successMessage` | String | `null` | Alert shown on success |
| `errorMessage` | String | `null` | Alert shown on error |

Emits: `deleted`, `error`

```javascript
{
  componentName: 'CommonDeleteAction',
  props: {
    confirmMessage: 'Are you sure?'
  }
}
```

#### CommonStatusAction

Toggles a `status` field between `1` (active) and `0` (hidden). Pre-configured wrapper around `CommonToggleAction` with default icons and colors — no extra props needed.

Emits: `updated`, `error`

```javascript
{ componentName: 'CommonStatusAction' }
```

#### CommonToggleAction

Generic binary toggle for any field. PATCHes the row via API and refreshes the grid.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `field` | String | yes | Model field to toggle |
| `states` | Array | yes | Exactly 2 state objects (see below) |
| `successMessage` | String | no | i18n key for success alert |
| `errorMessage` | String | no | i18n key for error alert |

Each state object:

| Key | Type | Description |
|-----|------|-------------|
| `value` | any | The field value this state represents |
| `icon` | String | FontAwesome icon name |
| `color` | String | CSS color string |
| `label` | String | i18n key used as tooltip |

Emits: `updated`, `error`

```javascript
{
  componentName: 'CommonToggleAction',
  props: {
    field: 'visibility',
    states: [
      { value: 1, icon: 'eye', color: '#28a745', label: 'common.visible' },
      { value: 0, icon: 'eye-slash', color: '#6c757d', label: 'common.hidden' }
    ]
  }
}
```

### Default Action Presets

```javascript
import { DEFAULT_ACTIONS, DEFAULT_ACTIONS_WITHOUT_STATUS } from '@uecsio/gridview'

// DEFAULT_ACTIONS = [CommonStatusAction, CommonEditAction, CommonDeleteAction]
// DEFAULT_ACTIONS_WITHOUT_STATUS = [CommonEditAction, CommonDeleteAction]

const columns = [
  // ...data columns,
  { label: 'common.actions', field: 'actions', actions: DEFAULT_ACTIONS }
]
```

### Custom Actions

```vue
<!-- CustomAction.vue -->
<template>
  <a
    href="#"
    class="action-link"
    @click.prevent="handleAction"
  >
    <FontAwesomeIcon :icon="faCustom" />
  </a>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCustom } from '@fortawesome/free-solid-svg-icons'

const props = defineProps(['row', 'actionParams'])

const handleAction = () => {
  // Custom action logic
  console.log('Custom action for:', props.row)
}
</script>
```

Register and use:

```javascript
import { registerActionComponent } from '@uecsio/gridview'
import CustomAction from './CustomAction.vue'

registerActionComponent('CustomAction', CustomAction)
```

## 🌐 Internationalization

### Setup i18n

```javascript
// main.js
import { createI18n } from 'vue-i18n'
import { GridView } from '@uecsio/gridview'
import '@uecsio/gridview/dist/index.css'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      grid: {
        filterByName: 'Filter by name...',
        allStatuses: 'All statuses',
        // ... more translations
      }
    }
  }
})

app.use(i18n)
app.use(GridView)
```

## 📊 API Integration

### Expected API Response Format

```javascript
// GET /api/users?page=1&limit=10&sort=name,ASC&filter=status||eq||1
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "status": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 10,
  "total": 100,
  "page": 1,
  "pageCount": 10
}
```

### Filter Format

Filters are sent as query parameters in the format: `field||operator||value`

Examples:
- `name||cont||john` - Name contains "john"
- `status||eq||1` - Status equals 1
- `createdAt||between||2024-01-01,2024-01-31` - Date range

## 🎯 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | String | - | Unique grid identifier |
| `columns` | Array | [] | Column definitions |
| `columns-module` | Object | - | Column module with setTranslationFunction |
| `path` | String | - | API endpoint path |
| `add-route` | String | - | Route name for add button |
| `add-text` | String | - | Text for add button |
| `enable-checkboxes` | Boolean | false | Enable row selection |
| `default-sort` | String | - | Default sort (field,direction) |
| `module-action-components` | Object | {} | Custom action components |
| `module-formatters` | Object | {} | Custom formatters |

## 🎨 Styling

The component uses CSS variables for theming:

```css
:root {
  --gridview-primary: #0d6efd;
  --gridview-secondary: #6c757d;
  --gridview-success: #198754;
  --gridview-danger: #dc3545;
  --gridview-warning: #ffc107;
  --gridview-info: #0dcaf0;
  --gridview-light: #f8f9fa;
  --gridview-dark: #212529;
}
```

## 📚 Examples

Check out the [examples directory](./examples) for complete implementation examples:

- [Basic Grid](./examples/basic-grid.vue)
- [Advanced Filtering](./examples/advanced-filtering.vue)
- [Custom Actions](./examples/custom-actions.vue)
- [Formatters](./examples/formatters.vue)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [vue-good-table-next](https://github.com/xaksis/vue-good-table-next) - Vue 3 table component
- [Vue i18n](https://kazupon.github.io/vue-i18n/) - Internationalization plugin

## 📞 Support

- 📧 Email: support@uecsio.com
- 🐛 Issues: [GitHub Issues](https://github.com/uecsio/gridview/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/uecsio/gridview/wiki)
