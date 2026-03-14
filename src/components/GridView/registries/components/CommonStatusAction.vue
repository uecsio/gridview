<template>
  <CommonToggleAction
    :row="row"
    :all-rows="allRows"
    :action-params="actionParams"
    :load-items="loadItems"
    field="status"
    :states="states"
    :success-message="successMessage"
    :error-message="errorMessage"
    @updated="$emit('updated', $event)"
    @error="$emit('error', $event)"
  />
</template>

<script setup>
import CommonToggleAction from './CommonToggleAction.vue'

defineProps({
  row: { type: Object, required: true },
  allRows: { type: Array, required: true },
  actionParams: { type: Object, required: true },
  loadItems: { type: Function, required: true },
  successMessage: { type: String, default: null },
  errorMessage: { type: String, default: null }
})

defineEmits(['updated', 'error'])

const states = [
  { value: 1, icon: 'check', color: '#28a745', label: 'common.status.active' },
  { value: 0, icon: 'ban', color: '#dc3545', label: 'common.status.hidden' }
]
</script>
