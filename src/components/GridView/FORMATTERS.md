# Formatters System

The GridView component now supports a **hybrid formatters system** that combines:

- ✅ **Common Formatters** - Reusable across all modules
- ✅ **Module-Specific Formatters** - Unique to specific modules
- ✅ **No Callbacks** - Declarative configuration only

## Architecture Overview

```
GridView
├── Common Formatters Registry (Global)
│   ├── CommonDateFormatter
│   ├── CommonCurrencyFormatter
│   ├── CommonStatusFormatter
│   └── CommonTruncateFormatter
└── Module Formatters Registries (Per Module)
    ├── Orders Registry
    │   └── OrdersStatusFormatter (future)
    ├── Users Registry
    │   └── UsersRoleFormatter (future)
    └── Products Registry
        └── ProductsPriceFormatter (future)
```

## How It Works

### 1. Formatter Resolution Priority

When looking for a formatter, the system checks in this order:

1. **Module-specific registry** (highest priority)
2. **Common registry** (fallback)

```javascript
// useFormatters.js
const getFormatter = (name) => {
  // First check module-specific registry
  if (moduleFormatters && moduleFormatters[name]) {
    return moduleFormatters[name]
  }
  
  // Fall back to common registry
  return getCommonFormatter(name)
}
```

### 2. Common Formatters

Located in: `components/GridView/registries/formatters.js`

**Available Common Formatters:**

#### Date Formatters
- `CommonDateFormatter` - Format dates (dd.MM.yyyy)
- `CommonDateTimeFormatter` - Format date and time (dd.MM.yyyy HH:mm)

#### Number Formatters
- `CommonCurrencyFormatter` - Format currency values
- `CommonNumberFormatter` - Format numbers with decimals
- `CommonPercentageFormatter` - Format percentages
- `CommonFileSizeFormatter` - Format file sizes (B, KB, MB, GB)

#### Text Formatters
- `CommonTruncateFormatter` - Truncate long text
- `CommonUppercaseFormatter` - Convert to uppercase
- `CommonLowercaseFormatter` - Convert to lowercase

#### Status Formatters
- `CommonStatusFormatter` - Map values to labels
- `CommonBooleanFormatter` - Format boolean values

### 3. Module-Specific Formatters

Located in: `views/{module}/formatters.js`

**Example Orders Formatters:**
```javascript
// views/orders/formatters.js
export const ordersFormatters = {
  'OrdersStatusFormatter': (value, options) => {
    const { t } = useI18n()
    const statusMap = {
      0: t('orders.statusValues.closed'),
      1: t('orders.statusValues.active'),
      2: t('orders.statusValues.pending')
    }
    return statusMap[value] || value
  }
}
```

## Usage Examples

### Column Configuration with Formatters

**Before (with callbacks):**
```javascript
{
  field: 'createdAt',
  formatFn: (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (isNaN(date.getTime())) return '-'
    return format(date, 'dd.MM.yyyy')
  }
}
```

**After (with formatters):**
```javascript
{
  field: 'createdAt',
  formatter: 'CommonDateFormatter',
  formatterOptions: {
    format: 'dd.MM.yyyy'
  }
}
```

### Complete Column Examples

#### Date Column
```javascript
{
  label: 'orders.date',
  field: 'createdAt',
  width: '20%',
  sortable: true,
  formatter: 'CommonDateFormatter',
  formatterOptions: {
    format: 'dd.MM.yyyy'
  },
  filterOptions: {
    enabled: true,
    filterType: 'daterange'
  }
}
```

#### Status Column
```javascript
{
  label: 'orders.status',
  field: 'status',
  width: '10%',
  sortable: true,
  formatter: 'CommonStatusFormatter',
  formatterOptions: {
    mapping: {
      1: 'orders.statusValues.active',
      0: 'orders.statusValues.closed'
    }
  },
  filterOptions: {
    enabled: true,
    filterType: 'select',
    items: [
      { value: 1, textKey: 'orders.statusValues.active' },
      { value: 0, textKey: 'orders.statusValues.closed' }
    ]
  }
}
```

#### Text Column with Truncation
```javascript
{
  label: 'orders.form.name',
  field: 'name',
  width: '30%',
  sortable: true,
  formatter: 'CommonTruncateFormatter',
  formatterOptions: {
    maxLength: 30,
    suffix: '...'
  }
}
```

#### Currency Column
```javascript
{
  label: 'orders.total',
  field: 'total',
  width: '15%',
  sortable: true,
  formatter: 'CommonCurrencyFormatter',
  formatterOptions: {
    currency: 'USD',
    locale: 'en-US'
  }
}
```

## Creating New Formatters

### Common Formatter (Reusable)

**1. Add to Common Registry**
```javascript
// components/GridView/registries/formatters.js
export const commonFormatters = {
  // ... existing formatters
  
  'CommonPhoneFormatter': (value, options = {}) => {
    if (!value) return '-'
    
    // Format phone number
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    
    return value
  }
}
```

**2. Use in Any Module**
```javascript
{
  field: 'phone',
  formatter: 'CommonPhoneFormatter',
  formatterOptions: {
    format: 'us' // Could support different formats
  }
}
```

### Module-Specific Formatter

**1. Create Formatter**
```javascript
// views/orders/formatters/ordersPriorityFormatter.js
export const ordersPriorityFormatter = (value, options = {}) => {
  const { t } = useI18n()
  
  const priorityMap = {
    1: { text: t('orders.priority.low'), color: 'success' },
    2: { text: t('orders.priority.medium'), color: 'warning' },
    3: { text: t('orders.priority.high'), color: 'danger' }
  }
  
  const priority = priorityMap[value]
  if (!priority) return value
  
  if (options.includeColor) {
    return `<span class="badge bg-${priority.color}">${priority.text}</span>`
  }
  
  return priority.text
}
```

**2. Register in Module Registry**
```javascript
// views/orders/formatters.js
import { ordersPriorityFormatter } from './formatters/ordersPriorityFormatter.js'

export const ordersFormatters = {
  'OrdersPriorityFormatter': ordersPriorityFormatter,
}
```

**3. Use in Orders Module Only**
```javascript
{
  field: 'priority',
  formatter: 'OrdersPriorityFormatter',
  formatterOptions: {
    includeColor: true
  }
}
```

## GridView Integration

### Basic Usage
```vue
<template>
  <GridView
    id="orders-grid"
    :columns="columns"
    :module-formatters="ordersFormatters"
    path="/orders"
  />
</template>

<script setup>
import { ordersFormatters } from './formatters.js'
</script>
```

### Advanced Usage with Validation
```javascript
// In your component
import { useFormatters } from '@/components/GridView/composables/useFormatters.js'

const { validateColumn, getAvailableFormatters } = useFormatters(ordersFormatters)

// Validate column configuration
const validation = validateColumn({
  field: 'status',
  formatter: 'CommonStatusFormatter'
})

if (!validation.isValid) {
  console.error('Column validation failed:', validation.errors)
}

// Get available formatters
const available = getAvailableFormatters()
console.log('Available formatters:', available.all)
```

## Benefits

### ✅ **No Callbacks**
- All formatting is declarative
- No functions stored in database
- Easy to serialize and cache

### ✅ **Reusability**
- Common formatters work across all modules
- No code duplication for standard formatting

### ✅ **Modularity**
- Module-specific formatters stay in their modules
- Clean separation of concerns

### ✅ **Performance**
- Formatters are lightweight functions
- Cached and processed once
- No component overhead

### ✅ **Maintainability**
- Clear formatter organization
- Easy to find and update formatters
- Consistent patterns across modules

### ✅ **Database-Ready**
- Formatters referenced by name in DB config
- Easy to modify without code changes
- Version control friendly

## Migration Guide

### From Callbacks to Formatters

**Before:**
```javascript
{
  field: 'createdAt',
  formatFn: (value) => {
    // Complex formatting logic
    return format(new Date(value), 'dd.MM.yyyy')
  }
}
```

**After:**
```javascript
{
  field: 'createdAt',
  formatter: 'CommonDateFormatter',
  formatterOptions: {
    format: 'dd.MM.yyyy'
  }
}
```

**Benefits:**
- No more callback functions
- Reusable across modules
- Database-friendly configuration
- Better error handling
- Consistent formatting patterns

## Future Enhancements

- [ ] **Formatter Composition** - Combine multiple formatters
- [ ] **Dynamic Options** - Options based on row data
- [ ] **Formatter Validation** - Runtime validation of formatter options
- [ ] **Formatter Marketplace** - Share formatters between projects
- [ ] **Performance Monitoring** - Track formatter execution times
- [ ] **Formatter Testing** - Unit test formatters in isolation
