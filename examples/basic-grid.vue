<template>
  <div class="basic-grid-example">
    <h2>Basic Grid Example</h2>
    <p>This example shows a basic grid with pagination, sorting, and filtering.</p>
    
    <GridView
      id="users-grid"
      :columns="columns"
      path="/api/users"
      add-route="Add User"
      :add-text="$t('users.addUser')"
    />
  </div>
</template>

<script setup>
import { GridView } from '@uecsio/gridview'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = [
  {
    label: 'users.name',
    field: 'name',
    sortable: true,
    filterOptions: {
      filterType: 'text',
      placeholderKey: 'grid.filterByName'
    },
    formatter: 'CommonTruncateFormatter',
    formatterOptions: {
      maxLength: 30,
      suffix: '...'
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
    },
    formatter: 'CommonStatusFormatter',
    formatterOptions: {
      mapping: {
        1: 'users.status.active',
        0: 'users.status.inactive'
      }
    }
  },
  {
    label: 'users.createdAt',
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
]
</script>

<style scoped>
.basic-grid-example {
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
