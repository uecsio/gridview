# Dynamic Action Components

The GridView component supports dynamic Vue components as actions, allowing for complex, reusable action buttons with full Vue component capabilities.

## Overview

Instead of simple callback functions or route links, you can now use full Vue components as actions. This provides:

- ✅ **Complex UI** - Full Vue component capabilities
- ✅ **Reusability** - Components can be used across different grids
- ✅ **Event Handling** - Components can emit custom events
- ✅ **State Management** - Components can have their own reactive state
- ✅ **Styling** - Full SCSS/CSS styling capabilities

## How It Works

### 1. Action Component Registry

Components are registered in `registries/actionComponents.js`:

```javascript
import CustomDeleteAction from './components/CustomDeleteAction.vue'
import CustomEditAction from './components/CustomEditAction.vue'

export const actionComponents = {
  'CustomDeleteAction': CustomDeleteAction,
  'CustomEditAction': CustomEditAction,
}
```

### 2. Column Definition

Define actions using the `component` type:

```javascript
// orders.js
{
  label: 'common.actions',
  field: 'actions',
  actions: [
    {
      action: {
        type: 'component',
        componentName: 'CustomDeleteAction',
      },
    },
    {
      action: {
        type: 'component', 
        componentName: 'CustomEditAction',
      },
    },
  ],
}
```

### 3. Component Implementation

Create action components with standard Vue component structure:

```vue
<template>
  <CButton @click="handleAction" :disabled="isLoading">
    <CIcon :content="icon" />
  </CButton>
</template>

<script setup>
const props = defineProps({
  row: Object,
  allRows: Array,
  actionParams: Object,
  loadItems: Function
})

const emit = defineEmits(['deleted', 'error'])

const handleAction = async () => {
  // Component logic here
}
</script>
```

## Available Action Types

### 1. Component Actions (New)

```javascript
{
  action: {
    type: 'component',
    componentName: 'CustomDeleteAction',
  },
  props: { // Optional props to pass to component
    customProp: 'value'
  }
}
```

### 2. Route Actions (Existing)

```javascript
{
  action: {
    type: 'route',
    name: 'Update Order',
    paramsResolver: (row) => ({ id: row.id }),
  },
}
```

### 3. Callback Actions (Existing)

```javascript
{
  action: {
    type: 'callback',
    callbackFunction: (rows, row, params, loadItems) => {
      // Callback logic
    },
  },
}
```

## Component Props

All action components receive these props:

| Prop | Type | Description |
|------|------|-------------|
| `row` | Object | Current row data |
| `allRows` | Array | All grid rows |
| `actionParams` | Object | Action configuration (url, routes, etc.) |
| `loadItems` | Function | Function to refresh grid data |

## Component Events

Components can emit events that are handled by the grid:

```javascript
// In component
emit('deleted', row)
emit('error', error)

// In grid
@action-event="handleActionEvent"
```

## Example Components

### CustomDeleteAction.vue

```vue
<template>
  <CButton
    color="danger"
    size="sm"
    @click="handleDelete"
    :disabled="isDeleting"
  >
    <CIcon v-if="!isDeleting" :content="cilTrash" />
    <CSpinner v-else size="sm" />
  </CButton>
</template>

<script setup>
import { ref } from 'vue'
import { cilTrash } from '@coreui/icons'

const props = defineProps({
  row: Object,
  allRows: Array, 
  actionParams: Object,
  loadItems: Function
})

const isDeleting = ref(false)

const handleDelete = async () => {
  if (!confirm('Are you sure?')) return
  
  isDeleting.value = true
  try {
    await fetch(`${props.actionParams.url}/${props.row.id}`, {
      method: 'DELETE'
    })
    await props.loadItems()
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>
```

### CustomEditAction.vue

```vue
<template>
  <router-link :to="{ name: 'Update Order', params: { id: row.id } }">
    <CButton color="primary" size="sm">
      <CIcon :content="cilPencil" />
    </CButton>
  </router-link>
</template>

<script setup>
import { cilPencil } from '@coreui/icons'

const props = defineProps({
  row: Object,
  allRows: Array,
  actionParams: Object, 
  loadItems: Function
})
</script>
```

## Registering New Components

### 1. Create Component

```vue
<!-- CustomStatusAction.vue -->
<template>
  <CButton @click="toggleStatus" :color="statusColor">
    {{ statusText }}
  </CButton>
</template>

<script setup>
// Component implementation
</script>
```

### 2. Register in Registry

```javascript
// registries/actionComponents.js
import CustomStatusAction from './components/CustomStatusAction.vue'

export const actionComponents = {
  // ... existing components
  'CustomStatusAction': CustomStatusAction,
}
```

### 3. Use in Column Definition

```javascript
// orders.js
{
  action: {
    type: 'component',
    componentName: 'CustomStatusAction',
  },
}
```

## Benefits

### For Simple Actions
- **Route actions** - Perfect for navigation
- **Callback actions** - Good for simple operations

### For Complex Actions
- **Component actions** - Full Vue component capabilities
- **State management** - Loading states, form validation
- **Complex UI** - Modals, dropdowns, multi-step processes
- **Event handling** - Custom events and notifications

## Migration Guide

### From Callback to Component

**Before:**
```javascript
{
  action: {
    type: 'callback',
    callbackFunction: async (rows, row, params, loadItems) => {
      // Complex logic here
    },
  },
}
```

**After:**
```javascript
{
  action: {
    type: 'component',
    componentName: 'CustomComplexAction',
  },
}
```

**Benefits:**
- Better separation of concerns
- Reusable across grids
- Easier testing
- Better error handling
- Loading states

## Best Practices

1. **Keep components focused** - One responsibility per component
2. **Use props for configuration** - Make components flexible
3. **Emit events for communication** - Don't directly modify parent state
4. **Handle loading states** - Show spinners during async operations
5. **Provide fallbacks** - Handle missing props gracefully
6. **Use i18n** - Make components translatable
7. **Test components** - Unit test action components

## Future Enhancements

- [ ] Component props validation
- [ ] Dynamic component loading (lazy loading)
- [ ] Component composition API
- [ ] Built-in notification system
- [ ] Action component marketplace
