# Installation Guide

## Quick Start

### 1. Install the Package

```bash
npm install @uecsio/gridview
```

### 2. Install Peer Dependencies

```bash
npm install vue@^3.0.0 @tanstack/vue-query@^4.0.0 vue-good-table-next@^0.1.0 @vuepic/vue-datepicker@^4.0.0 @coreui/vue@^5.0.0 @coreui/icons-vue@^2.0.0 vue-i18n@^9.0.0 @fortawesome/fontawesome-svg-core@^6.0.0 @fortawesome/free-solid-svg-icons@^6.0.0 @fortawesome/vue-fontawesome@^3.0.0 date-fns@^2.0.0
```

### 4. Setup in Your Vue App

#### main.js
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import GridView from '@uecsio/gridview'
import '@uecsio/gridview/dist/index.css'

// FontAwesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faTrashAlt, 
  faEdit, 
  faEye, 
  faSpinner,
  faFile
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(faTrashAlt, faEdit, faEye, faSpinner, faFile)

// Create your Vue app
const app = createApp(App)

// Setup i18n
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      grid: {
        filterByName: 'Filter by name...',
        allStatuses: 'All statuses',
        // ... add your translations
      }
    }
  }
})

// Install plugins
app.use(createPinia())
app.use(VueQueryPlugin)
app.use(i18n)
app.use(GridView)

// Register FontAwesome component globally
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
```

### 5. Use in Your Components

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

const columns = [
  {
    label: 'users.name',
    field: 'name',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByName'
    }
  }
  // ... more columns
]
</script>
```

## Advanced Setup

### With TypeScript

If you're using TypeScript, the package includes full type definitions:

```typescript
import { GridView, ColumnDefinition } from '@uecsio/gridview'

const columns: ColumnDefinition[] = [
  {
    label: 'users.name',
    field: 'name',
    sortable: true
  }
]
```

### With Custom Theme

```css
:root {
  --gridview-primary: #your-primary-color;
  --gridview-secondary: #your-secondary-color;
  /* ... other CSS variables */
}
```

### With Custom Formatters

```javascript
import { registerCommonFormatter } from '@uecsio/gridview'

registerCommonFormatter('CustomFormatter', (value, options) => {
  return `Custom: ${value}`
})
```

### With Custom Actions

```javascript
import { registerActionComponent } from '@uecsio/gridview'
import CustomAction from './CustomAction.vue'

registerActionComponent('CustomAction', CustomAction)
```

## Troubleshooting

### Common Issues

1. **Missing peer dependencies**: Make sure all peer dependencies are installed
2. **i18n not working**: Ensure vue-i18n is properly configured
3. **Styling issues**: Check that CoreUI CSS is imported
4. **Icons not showing**: Verify FontAwesome is properly configured

### Getting Help

- 📧 Email: support@uecsio.com
- 🐛 Issues: [GitHub Issues](https://github.com/uecsio/gridview/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/uecsio/gridview/wiki)
