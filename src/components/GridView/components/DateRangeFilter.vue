<template>
  <div class="date-range-filter">
    <VueDatePicker
      v-model="dateRange"
      range
      :locale="currentLocale"
      :format="dateFormat"
      :placeholder="placeholder"
      :enable-time-picker="false"
      auto-apply
      :clearable="true"
      :dark="false"
      :teleport="true"
      menu-class-name="dp-custom-menu"
      @update:model-value="handleDateChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format as formatDate } from 'date-fns'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  opens: {
    type: String,
    default: 'left',
  },
})

const emit = defineEmits(['update'])

const { locale } = useI18n()

// Date range model - VueDatePicker uses array [startDate, endDate]
const dateRange = ref(null)

// Current locale for the date picker
const currentLocale = computed(() => {
  return locale.value === 'uk' ? 'uk-UA' : 'ru'
})

// Date format function
const dateFormat = (dates) => {
  if (!dates || !Array.isArray(dates) || dates.length !== 2) {
    return ''
  }
  
  try {
    const [start, end] = dates
    if (!start || !end) return ''
    
    const startStr = formatDate(start, 'dd.MM.yyyy')
    const endStr = formatDate(end, 'dd.MM.yyyy')
    return `${startStr} - ${endStr}`
  } catch (error) {
    console.warn('Date formatting error:', error)
    return ''
  }
}

// Handle date change
const handleDateChange = (value) => {
  if (!value) {
    emit('update', '')
    return
  }
  
  if (Array.isArray(value) && value.length === 2) {
    const [startDate, endDate] = value
    
    if (startDate && endDate) {
      try {
        // Format dates for API
        const start = formatDate(startDate, 'yyyy-MM-dd')
        const end = formatDate(endDate, 'yyyy-MM-dd')
        
        // Emit the date range as a string in format: startDate,endDate
        emit('update', `${start},${end}`)
      } catch (error) {
        console.warn('Date change error:', error)
        emit('update', '')
      }
    } else {
      emit('update', '')
    }
  } else {
    emit('update', '')
  }
}

// Watch for external changes (e.g., clear filter)
const stopWatch = watch(() => props.column?.filterValue, (newValue) => {
  // Reset if filter is cleared externally
  if (!newValue) {
    dateRange.value = null
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (stopWatch) {
    stopWatch()
  }
  dateRange.value = null
})
</script>

<style scoped>
.date-range-filter {
  width: 100%;
}

/* Input field styling to match CoreUI */
:deep(.dp__input_wrap) {
  width: 100%;
}

:deep(.dp__input) {
  width: 100% !important;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: var(--cui-body-color, #4f5d73);
  background-color: var(--cui-body-bg, #fff);
  background-clip: padding-box;
  border: 1px solid var(--cui-input-border-color, #b1b7c1);
  border-radius: 0.375rem;
  appearance: none;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  height: calc(1.5em + 0.75rem + 2px);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

:deep(.dp__input:hover) {
  border-color: var(--cui-input-border-color, #b1b7c1);
}

:deep(.dp__input:focus) {
  color: var(--cui-body-color, #4f5d73);
  background-color: var(--cui-body-bg, #fff);
  border-color: #b1b7c1;
  outline: 0;
  box-shadow: none;
}

:deep(.dp__input::placeholder) {
  color: var(--cui-input-placeholder-color, #8a93a2);
  opacity: 1;
}

:deep(.dp__input_icon) {
  right: 0.75rem;
  left: auto;
  color: var(--cui-body-color, #4f5d73);
}

:deep(.dp__clear_icon) {
  right: 2rem;
}

/* Calendar popup styling */
:deep(.dp__menu) {
  font-family: inherit;
  border: 1px solid var(--cui-border-color, #d8dbe0);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 21, 0.15);
  border-radius: 0.375rem;
}

:deep(.dp__calendar_header) {
  font-weight: 600;
  color: var(--cui-body-color, #4f5d73);
}

:deep(.dp__calendar_header_item) {
  color: var(--cui-body-color, #4f5d73);
  font-weight: 500;
  font-size: 0.875rem;
}

:deep(.dp__cell_inner) {
  border-radius: 0.25rem;
}

:deep(.dp__today) {
  border: 1px solid var(--cui-primary, #321fdb);
}

:deep(.dp__active_date),
:deep(.dp__range_start),
:deep(.dp__range_end) {
  background-color: var(--cui-primary, #321fdb);
  color: #fff;
}

:deep(.dp__range_between) {
  background-color: rgba(50, 31, 219, 0.1);
  color: var(--cui-body-color, #4f5d73);
}

:deep(.dp__cell_inner:hover) {
  background-color: rgba(50, 31, 219, 0.1);
}

:deep(.dp__month_year_select:hover) {
  background-color: rgba(50, 31, 219, 0.1);
  color: var(--cui-body-color, #4f5d73);
}

:deep(.dp__arrow_top),
:deep(.dp__arrow_bottom) {
  color: var(--cui-body-color, #4f5d73);
}

:deep(.dp__button) {
  background-color: var(--cui-primary, #321fdb);
  color: #fff;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.dp__button:hover) {
  background-color: #2819b0;
}

:deep(.dp__button_bottom) {
  border-top: 1px solid var(--cui-border-color, #d8dbe0);
}
</style>

