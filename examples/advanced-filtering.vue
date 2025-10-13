<template>
  <div class="advanced-filtering-example">
    <h2>Advanced Filtering Example</h2>
    <p>This example demonstrates advanced filtering capabilities including date ranges, select filters, and text search.</p>
    
    <GridView
      id="orders-grid"
      :columns="columns"
      :columns-module="ordersColumns"
      path="/api/orders"
      add-route="Add Order"
      :add-text="$t('orders.addOrder')"
      :enable-checkboxes="true"
      default-sort="createdAt,DESC"
    />
  </div>
</template>

<script setup>
import { GridView } from '@uecsio/gridview'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Column definitions with advanced filtering
const columns = [
  {
    label: 'orders.customer',
    field: 'customerName',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByCustomer'
    },
    formatter: 'CommonTruncateFormatter',
    formatterOptions: {
      maxLength: 25,
      suffix: '...'
    }
  },
  {
    label: 'orders.phone',
    field: 'phone',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByPhone'
    }
  },
  {
    label: 'orders.status',
    field: 'status',
    sortable: true,
    filterOptions: {
      filterType: 'select',
      placeholderKey: 'grid.filterByStatus',
      options: [
        { value: '', textKey: 'grid.allStatuses' },
        { value: 'pending', textKey: 'orders.status.pending' },
        { value: 'processing', textKey: 'orders.status.processing' },
        { value: 'completed', textKey: 'orders.status.completed' },
        { value: 'cancelled', textKey: 'orders.status.cancelled' }
      ]
    },
    formatter: 'CommonStatusFormatter',
    formatterOptions: {
      mapping: {
        pending: 'orders.status.pending',
        processing: 'orders.status.processing',
        completed: 'orders.status.completed',
        cancelled: 'orders.status.cancelled'
      }
    }
  },
  {
    label: 'orders.priority',
    field: 'priority',
    sortable: true,
    filterOptions: {
      filterType: 'select',
      placeholderKey: 'grid.filterByPriority',
      options: [
        { value: '', textKey: 'grid.allPriorities' },
        { value: 'low', textKey: 'orders.priority.low' },
        { value: 'medium', textKey: 'orders.priority.medium' },
        { value: 'high', textKey: 'orders.priority.high' },
        { value: 'urgent', textKey: 'orders.priority.urgent' }
      ]
    },
    formatter: 'CommonStatusFormatter',
    formatterOptions: {
      mapping: {
        low: 'orders.priority.low',
        medium: 'orders.priority.medium',
        high: 'orders.priority.high',
        urgent: 'orders.priority.urgent'
      }
    }
  },
  {
    label: 'orders.amount',
    field: 'amount',
    sortable: true,
    formatter: 'CommonCurrencyFormatter',
    formatterOptions: {
      currency: 'USD',
      locale: 'en-US'
    }
  },
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
      format: 'dd.MM.yyyy HH:mm'
    }
  },
  {
    label: 'orders.updatedAt',
    field: 'updatedAt',
    sortable: true,
    filterOptions: {
      filterType: 'daterange',
      placeholderKey: 'grid.filterByUpdateDate'
    },
    formatter: 'CommonDateFormatter',
    formatterOptions: {
      format: 'dd.MM.yyyy HH:mm'
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
          routeName: 'Update Order',
          entityName: 'Order'
        }
      },
      {
        action: {
          type: 'component',
          componentName: 'CommonDeleteAction'
        },
        props: {
          entityName: 'Order',
          confirmMessageKey: 'orders.confirmDelete',
          errorMessageKey: 'orders.deleteError'
        }
      },
      {
        action: {
          type: 'component',
          componentName: 'OrderPrintAction'
        },
        props: {
          entityName: 'Order'
        }
      }
    ]
  }
]

// Column module for translation function
const ordersColumns = {
  columns,
  setTranslationFunction: (translationFunction) => {
    // This would be called by GridView to set up translations
  }
}
</script>

<style scoped>
.advanced-filtering-example {
  padding: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}
</style>
