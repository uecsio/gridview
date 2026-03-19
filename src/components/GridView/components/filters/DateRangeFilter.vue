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

/* Input field styling */
:deep(.dp__input_wrap) {
  width: 100%;
}

:deep(.dp__input) {
  width: 100% !important;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-base-content, #212631);
  background-color: var(--color-base-100, #fff);
  background-clip: padding-box;
  border: 1px solid var(--color-base-300, #e7eaee);
  border-radius: 0.375rem;
  appearance: none;
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  transition: border-color 0.15s ease;
}

:deep(.dp__input:hover) {
  border-color: var(--color-base-300, #e7eaee);
}

:deep(.dp__input:focus) {
  outline: none;
  border-color: var(--color-primary, #5856d6);
  box-shadow: 0 0 0 2px rgba(88, 86, 214, 0.15);
}

:deep(.dp__input::placeholder) {
  color: #8a93a2;
  opacity: 1;
}

:deep(.dp__input_icon) {
  position: absolute;
  right: 0.75rem;
  left: auto;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-base-content, #212631);
}

/* Hide calendar icon when clear icon is present */
:deep(.dp__input_wrap:has(.dp__clear_icon) .dp__input_icon) {
  display: none;
}

:deep(.dp__clear_icon) {
  position: absolute;
  right: 0.05rem;
  top: 50%;
  transform: translateY(-50%);
}

/* Calendar popup styling */
:deep(.dp__menu) {
  font-family: inherit;
  border: 1px solid #d8dbe0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 21, 0.15);
  border-radius: 0.375rem;
}

:deep(.dp__calendar_header) {
  font-weight: 600;
  color: #4f5d73;
}

:deep(.dp__calendar_header_item) {
  color: #4f5d73;
  font-weight: 500;
  font-size: 0.875rem;
}

:deep(.dp__cell_inner) {
  border-radius: 0.25rem;
}

:deep(.dp__today) {
  border: 1px solid #321fdb;
}

:deep(.dp__active_date),
:deep(.dp__range_start),
:deep(.dp__range_end) {
  background-color: #321fdb;
  color: #fff;
}

:deep(.dp__range_between) {
  background-color: rgba(50, 31, 219, 0.1);
  color: #4f5d73;
}

:deep(.dp__cell_inner:hover) {
  background-color: rgba(50, 31, 219, 0.1);
}

:deep(.dp__month_year_select:hover) {
  background-color: rgba(50, 31, 219, 0.1);
  color: #4f5d73;
}

:deep(.dp__arrow_top),
:deep(.dp__arrow_bottom) {
  color: #4f5d73;
}

:deep(.dp__button) {
  background-color: #321fdb;
  color: #fff;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.dp__button:hover) {
  background-color: #2819b0;
}

:deep(.dp__button_bottom) {
  border-top: 1px solid #d8dbe0;
}
</style>

