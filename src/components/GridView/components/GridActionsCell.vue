<template>
  <span v-if="column.actions">
    <span
      v-for="(action, index) in column.actions"
      :key="index"
      v-show="!action.action.visibilityResolver || action.action.visibilityResolver(row)"
    >
      <!-- Custom Vue Component Action -->
      <component
        v-if="action.action.type === 'component'"
        :is="getActionComponentByName(action.action.componentName)"
        :row="row"
        :all-rows="allRows"
        :action-params="actionParams"
        :load-items="loadItems"
        v-bind="action.props || {}"
        @deleted="handleActionEvent('deleted', $event)"
        @error="handleActionEvent('error', $event)"
      />
      
      <!-- Route Action -->
      <router-link
        v-else-if="action.action.type === 'route'"
        :to="{
          name: action.action.name ? action.action.name : action.action.nameResolver(actionParams),
          params: action.action.paramsResolver(row),
        }"
        :class="action.class ? action.class : (action.classCallback ? action.classCallback(row) : '')"
        :style="action.style"
        :title="action.titleKey ? $t(action.titleKey) : action.title"
      >
        <CIcon v-if="action.icon" :content="action.icon" />
        <span v-else>{{ action.labelKey ? $t(action.labelKey) : action.label }}</span>
      </router-link>
    </span>
  </span>
  <span v-else>{{ $t('grid.operationsAreNotResolved') }}</span>
</template>

<script setup>
// defineProps and defineEmits are compiler macros, no import needed
import { getActionComponent } from '../registries/actionComponents.js'

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
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
  // Optional module-specific action components registry
  moduleActionComponents: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['action-event'])

/**
 * Get action component by name
 * First checks module-specific registry, then falls back to common registry
 */
const getActionComponentByName = (componentName) => {
  // First check module-specific registry
  if (props.moduleActionComponents && props.moduleActionComponents[componentName]) {
    return props.moduleActionComponents[componentName]
  }
  
  // Fall back to common registry
  return getActionComponent(componentName)
}

/**
 * Handle events from custom action components
 */
const handleActionEvent = (eventType, data) => {
  emit('action-event', {
    type: eventType,
    data,
    row: props.row
  })
}
</script>

<style scoped>
span {
  cursor: pointer;
}
</style>

