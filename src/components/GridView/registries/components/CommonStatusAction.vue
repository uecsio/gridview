<template>
  <a
    href="#"
    @click.prevent="toggleStatus"
    class="status-indicator"
    :class="[statusClass, { 'disabled': isUpdating }]"
    :title="statusLabel"
  >
    <FontAwesomeIcon v-if="!isUpdating" :icon="statusIcon" />
    <FontAwesomeIcon v-else icon="spinner" spin />
  </a>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  statusField: {
    type: String,
    default: 'status'
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

// Get the status value from the row
const statusValue = computed(() => {
  return props.row[props.statusField]
})

// Determine if status is active (1) or hidden (0)
const isActive = computed(() => {
  return statusValue.value === 1 || statusValue.value === '1'
})

// Get the icon for the current status
const statusIcon = computed(() => {
  return isActive.value ? 'check' : 'ban'
})

// Get the CSS class for the current status
const statusClass = computed(() => {
  return isActive.value ? 'status-active' : 'status-hidden'
})

// Get the label for the current status
const statusLabel = computed(() => {
  try {
    return isActive.value ? t('common.status.active') : t('common.status.hidden')
  } catch (e) {
    return isActive.value ? 'Active' : 'Hidden'
  }
})

// Toggle status handler
const toggleStatus = async () => {
  if (isUpdating.value) {
    return
  }

  isUpdating.value = true

  // Calculate new status value (toggle between 1 and 0)
  const newStatus = isActive.value ? 0 : 1

  try {
    await props.actionParams.apiClient.patch(
      `${props.actionParams.url}/${props.row.id}`,
      {
        [props.statusField]: newStatus
      }
    )

    // Emit success event
    emit('updated', {
      row: props.row,
      oldStatus: statusValue.value,
      newStatus: newStatus
    })

    // Refresh the grid
    await props.loadItems()

    // Show success message if provided
    if (props.successMessage) {
      alert(props.successMessage)
    }

  } catch (error) {
    console.error('Error updating status:', error)

    // Emit error event
    emit('error', {
      message: props.errorMessage || t('common.statusUpdateError'),
      error: error
    })

    // Show error to user
    alert(props.errorMessage || t('common.statusUpdateError'))
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.status-indicator {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}

.status-indicator:hover {
  opacity: 0.7;
}

.status-indicator.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Active status - green */
.status-active {
  color: #28a745;
}

/* Hidden status - red */
.status-hidden {
  color: #dc3545;
}
</style>

