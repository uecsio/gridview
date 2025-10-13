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
npm install vue@^3.0.0 @tanstack/vue-query@^4.0.0 vue-good-table-next@^0.1.0 @vuepic/vue-datepicker@^4.0.0 @coreui/vue@^5.0.0 @coreui/icons-vue@^2.0.0 vue-i18n@^9.0.0 @fortawesome/fontawesome-svg-core@^6.0.0 @fortawesome/free-solid-svg-icons@^6.0.0 @fortawesome/vue-fontawesome@^3.0.0 date-fns@^2.0.0
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

### Column with Filtering

```javascript
{
  label: 'users.status',
  field: 'status',
  sortable: true,
  filterOptions: {
    filterType: 'select',
    placeholderKey: 'grid.filterByStatus',
    options: [
      { value: '', textKey: 'grid.allStatuses' },
      { value: 1, textKey: 'users.status.active' },
      { value: 0, textKey: 'users.status.inactive' }
    ]
  }
}
```

### Column with Date Range Filter

```javascript
{
  label: 'orders.createdAt',
  field: 'createdAt',
  sortable: true,
  filterOptions: {
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
      action: {
        type: 'component',
        componentName: 'CommonEditAction'
      },
      props: {
        routeName: 'Update User',
        entityName: 'User'
      }
    },
    {
      action: {
        type: 'component',
        componentName: 'CommonDeleteAction'
      },
      props: {
        entityName: 'User',
        confirmMessageKey: 'users.confirmDelete',
        errorMessageKey: 'users.deleteError'
      }
    }
  ]
}
```

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

### Built-in Actions

- `CommonEditAction` - Navigate to edit page
- `CommonDeleteAction` - Delete with confirmation

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
- [CoreUI](https://coreui.io/) - Bootstrap-based UI components
- [Vue i18n](https://kazupon.github.io/vue-i18n/) - Internationalization plugin

## 📞 Support

- 📧 Email: support@uecsio.com
- 🐛 Issues: [GitHub Issues](https://github.com/uecsio/gridview/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/uecsio/gridview/wiki)
