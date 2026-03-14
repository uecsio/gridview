<template>
  <a
    href="#"
    @click.prevent="toggle"
    class="status-indicator"
    :class="{ 'disabled': isUpdating }"
    :style="{ color: currentState.color }"
    :title="$t(currentState.label)"
  >
    <FontAwesomeIcon v-if="!isUpdating" :icon="currentState.icon" />
    <FontAwesomeIcon v-else icon="spinner" spin />
  </a>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
  field: {
    type: String,
    required: true
  },
  states: {
    type: Array,
    required: true
  },
  successMessage: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['updated', 'error'])

const isUpdating = ref(false)

const currentState = computed(() => {
  const value = props.row[props.field]
  return props.states.find(s => s.value === value || String(s.value) === String(value)) || props.states[0]
})

const oppositeState = computed(() => {
  return props.states.find(s => s !== currentState.value) || props.states[1]
})

const toggle = async () => {
  if (isUpdating.value) {
    return
  }

  isUpdating.value = true
  const newValue = oppositeState.value.value

  try {
    await props.actionParams.apiClient.patch(
      `${props.actionParams.url}/${props.row.id}`,
      {
        [props.field]: newValue
      }
    )

    emit('updated', {
      row: props.row,
      field: props.field,
      oldValue: props.row[props.field],
      newValue: newValue
    })

    await props.loadItems()

    if (props.successMessage) {
      alert(t(props.successMessage))
    }

  } catch (error) {
    console.error(`Error toggling ${props.field}:`, error)

    emit('error', {
      message: props.errorMessage || t('common.statusUpdateError'),
      error: error
    })

    alert(props.errorMessage ? t(props.errorMessage) : t('common.statusUpdateError'))
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.status-indicator {
  margin-right: 3px;
}

.status-indicator:hover {
  opacity: 0.7;
}
</style>
