<template>
  <router-link :to="editRoute" class="action-link" :title="$t('common.edit')">
    <FontAwesomeIcon icon="edit" />
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  row: {
    type: Object,
    required: true
  },
  allRows: {
    type: Array,
    required: true
  },
  actionParams: {
    type: Object,
    required: true
  },
  loadItems: {
    type: Function,
    required: true
  },
  // Optional props for customization
  routeName: {
    type: String,
    default: null
  },
  routeParamsResolver: {
    type: Function,
    default: null
  }
})

// Compute the edit route
const editRoute = computed(() => {
  // Use custom route resolver if provided
  if (props.routeParamsResolver) {
    return props.routeParamsResolver(props.row)
  }
  
  // Use custom route name if provided
  if (props.routeName) {
    return {
      name: props.routeName,
      params: { id: props.row.id }
    }
  }
  
  // Default route pattern: "Update {EntityName}"
  const entityName = props.actionParams.entityName || 'Item'

  return {
    name: `Update ${entityName}`,
    params: { id: props.row.id }
  }
})
</script>

