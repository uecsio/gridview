# Hybrid Action Components System

The GridView component now supports a **hybrid action system** that combines:

- ✅ **Common Components** - Reusable across all modules (Edit, Delete)
- ✅ **Module-Specific Components** - Unique to specific modules (Print for Orders)
- ✅ **Flexible Registry System** - Easy to extend and maintain

## Architecture Overview

```
GridView
├── Common Registry (Global)
│   ├── CommonEditAction.vue
│   ├── CommonDeleteAction.vue
│   └── CustomViewAction.vue
└── Module Registries (Per Module)
    ├── Orders Registry
    │   └── OrdersPrintAction.vue
    ├── Users Registry
    │   └── UsersExportAction.vue
    └── Products Registry
        └── ProductsBulkEditAction.vue
```

## How It Works

### 1. Component Resolution Priority

When looking for an action component, the system checks in this order:

1. **Module-specific registry** (highest priority)
2. **Common registry** (fallback)

```javascript
// GridActionsCell.vue
const getActionComponentByName = (componentName) => {
  // First check module-specific registry
  if (props.moduleActionComponents && props.moduleActionComponents[componentName]) {
    return props.moduleActionComponents[componentName]
  }
  
  // Fall back to common registry
  return getActionComponent(componentName)
}
```

### 2. Common Components

Located in: `components/GridView/registries/components/`

**CommonEditAction.vue**
- Reusable edit button with router navigation
- Configurable route name and parameters
- Works with any entity type

**CommonDeleteAction.vue**
- Reusable delete button with confirmation
- Configurable messages and error handling
- Works with any entity type

### 3. Module-Specific Components

Located in: `views/{module}/components/`

**OrdersPrintAction.vue**
- Orders-specific print functionality
- Generates formatted print HTML
- Only available for orders module

## Usage Examples

### Orders Module Setup

**1. Create Module Registry**
```javascript
// views/orders/actionComponents.js
import OrdersPrintAction from './components/OrdersPrintAction.vue'

export const ordersActionComponents = {
  'OrdersPrintAction': OrdersPrintAction,
}
```

**2. Define Actions in Column**
```javascript
// views/orders/grid-views/orders.js
{
  label: 'common.actions',
  field: 'actions',
  actions: [
    {
      action: {
        type: 'component',
        componentName: 'CommonEditAction', // From common registry
      },
      props: {
        routeName: 'Update Order',
        entityName: 'Order'
      }
    },
    {
      action: {
        type: 'component',
        componentName: 'CommonDeleteAction', // From common registry
      },
      props: {
        confirmMessage: 'Are you sure you want to delete this order?',
        successMessage: 'Order deleted successfully',
        errorMessage: 'Error deleting order'
      }
    },
    {
      action: {
        type: 'component',
        componentName: 'OrdersPrintAction', // From orders registry
      },
    },
  ],
}
```

**3. Pass Registry to GridView**
```vue
<!-- views/orders/OrdersList.vue -->
<template>
  <GridView
    id="orders-grid"
    :columns="columns"
    :module-action-components="ordersActionComponents"
    path="/orders"
  />
</template>

<script setup>
import { ordersActionComponents } from './actionComponents.js'
</script>
```

## Component Types

### Common Components

#### CommonEditAction
```javascript
{
  action: {
    type: 'component',
    componentName: 'CommonEditAction',
  },
  props: {
    routeName: 'Update Order',        // Optional: custom route name
    entityName: 'Order',              // Optional: for default route generation
    routeParamsResolver: (row) => ({  // Optional: custom params resolver
      id: row.id,
      tab: 'details'
    })
  }
}
```

#### CommonDeleteAction
```javascript
{
  action: {
    type: 'component',
    componentName: 'CommonDeleteAction',
  },
  props: {
    confirmMessage: 'Custom confirmation message',
    successMessage: 'Success message',
    errorMessage: 'Error message'
  }
}
```

### Module-Specific Components

#### OrdersPrintAction
```javascript
{
  action: {
    type: 'component',
    componentName: 'OrdersPrintAction',
  },
  // No props needed - component handles everything internally
}
```

## Creating New Components

### Common Component (Reusable)

**1. Create Component**
```vue
<!-- components/GridView/registries/components/CommonExportAction.vue -->
<template>
  <CButton @click="handleExport" :disabled="isExporting">
    <CIcon v-if="!isExporting" :content="cilCloudDownload" />
    <CSpinner v-else size="sm" />
  </CButton>
</template>

<script setup>
// Component implementation
</script>
```

**2. Register in Common Registry**
```javascript
// components/GridView/registries/actionComponents.js
import CommonExportAction from './components/CommonExportAction.vue'

export const actionComponents = {
  // ... existing components
  'CommonExportAction': CommonExportAction,
}
```

**3. Use in Any Module**
```javascript
// Any module can now use CommonExportAction
{
  action: {
    type: 'component',
    componentName: 'CommonExportAction',
  },
}
```

### Module-Specific Component

**1. Create Component**
```vue
<!-- views/users/components/UsersBulkEditAction.vue -->
<template>
  <CButton @click="openBulkEditModal">
    <CIcon :content="cilPencil" />
  </CButton>
</template>

<script setup>
// Users-specific bulk edit logic
</script>
```

**2. Register in Module Registry**
```javascript
// views/users/actionComponents.js
import UsersBulkEditAction from './components/UsersBulkEditAction.vue'

export const usersActionComponents = {
  'UsersBulkEditAction': UsersBulkEditAction,
}
```

**3. Use in Users Module Only**
```javascript
// views/users/grid-views/users.js
{
  action: {
    type: 'component',
    componentName: 'UsersBulkEditAction', // Only available in users module
  },
}
```

## Benefits

### ✅ **Reusability**
- Common components work across all modules
- No code duplication for standard actions

### ✅ **Modularity**
- Module-specific components stay in their modules
- Clean separation of concerns

### ✅ **Flexibility**
- Easy to add new common components
- Easy to add module-specific components
- Configurable through props

### ✅ **Maintainability**
- Clear component organization
- Easy to find and update components
- Consistent patterns across modules

### ✅ **Performance**
- Components are only loaded when needed
- No global component pollution

## Migration Guide

### From Global to Hybrid System

**Before (Global Registry Only):**
```javascript
// All components in one registry
export const actionComponents = {
  'CustomDeleteAction': CustomDeleteAction,
  'CustomEditAction': CustomEditAction,
  'OrdersPrintAction': OrdersPrintAction, // Orders-specific but global
}
```

**After (Hybrid System):**
```javascript
// Common registry
export const actionComponents = {
  'CommonDeleteAction': CommonDeleteAction,
  'CommonEditAction': CommonEditAction,
}

// Orders registry
export const ordersActionComponents = {
  'OrdersPrintAction': OrdersPrintAction,
}
```

### Component Naming Convention

- **Common components**: `Common{ActionName}Action`
- **Module components**: `{ModuleName}{ActionName}Action`

Examples:
- `CommonEditAction` - Reusable edit
- `CommonDeleteAction` - Reusable delete
- `OrdersPrintAction` - Orders-specific print
- `UsersExportAction` - Users-specific export

## Best Practices

### 1. **Use Common Components When Possible**
```javascript
// ✅ Good - Use common component
{
  action: {
    type: 'component',
    componentName: 'CommonEditAction',
  },
}

// ❌ Avoid - Don't create module-specific edit unless needed
{
  action: {
    type: 'component',
    componentName: 'OrdersEditAction',
  },
}
```

### 2. **Keep Module Components Focused**
```javascript
// ✅ Good - Module-specific functionality
'OrdersPrintAction'    // Print orders
'UsersBulkEditAction'  // Bulk edit users
'ProductsImportAction' // Import products

// ❌ Avoid - Generic functionality that could be common
'OrdersEditAction'     // Use CommonEditAction instead
'UsersDeleteAction'    // Use CommonDeleteAction instead
```

### 3. **Use Props for Configuration**
```javascript
// ✅ Good - Configurable common component
{
  action: {
    type: 'component',
    componentName: 'CommonDeleteAction',
  },
  props: {
    confirmMessage: 'Delete this order?',
    successMessage: 'Order deleted!'
  }
}
```

### 4. **Organize Files Properly**
```
views/orders/
├── actionComponents.js          # Module registry
├── components/                  # Module-specific components
│   ├── OrdersPrintAction.vue
│   └── OrdersStatusAction.vue
└── grid-views/
    └── orders.js               # Column definitions

components/GridView/registries/
├── actionComponents.js         # Common registry
└── components/                 # Common components
    ├── CommonEditAction.vue
    └── CommonDeleteAction.vue
```

## Future Enhancements

- [ ] **Lazy Loading** - Load components only when needed
- [ ] **Component Composition** - Combine multiple components
- [ ] **Dynamic Props** - Props based on row data
- [ ] **Conditional Rendering** - Show/hide based on permissions
- [ ] **Component Marketplace** - Share components between projects
