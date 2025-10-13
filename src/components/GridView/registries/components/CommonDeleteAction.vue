<template>
  <a
    href="#"
    @click.prevent="handleDelete"
    :class="{ 'disabled': isDeleting }"
    :title="$t('common.delete')"
    class="action-link"
  >
    <FontAwesomeIcon v-if="!isDeleting" icon="trash-alt" />
    <FontAwesomeIcon v-else icon="spinner" spin />
  </a>
</template>

<script setup>
import { ref } from 'vue'
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
  confirmMessage: {
    type: String,
    default: null
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

const emit = defineEmits(['deleted', 'error'])

const isDeleting = ref(false)

const handleDelete = async () => {
  // Use custom message or default
  const message = props.confirmMessage || t('common.confirmDelete', { item: props.row.name || props.row.id })
  
  if (!confirm(message)) {
    return
  }
  
  isDeleting.value = true
  
  try {
    const response = await fetch(`${props.actionParams.url}/${props.row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Emit success event
    emit('deleted', props.row)
    
    // Refresh the grid
    await props.loadItems()
    
    // Show success message if provided
    if (props.successMessage) {
      alert(props.successMessage)
    }
    
  } catch (error) {
    console.error('Error deleting item:', error)
    
    // Emit error event
    emit('error', {
      message: props.errorMessage || t('common.deleteError'),
      error: error
    })
    
    // Show error to user
    alert(props.errorMessage || t('common.deleteError'))
  } finally {
    isDeleting.value = false
  }
}
</script>

