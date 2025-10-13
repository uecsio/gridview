import { ref, onMounted } from 'vue'

/**
 * Composable for managing grid columns
 * Handles column translation and processing
 */
export function useGridColumns(props, t) {
  const translatedColumns = ref([])

  /**
   * Initialize columns with translations
   */
  const initializeColumns = () => {
    // Set translation function for columns module if available
    if (props.columnsModule && typeof props.columnsModule.setTranslationFunction === 'function') {
      props.columnsModule.setTranslationFunction(t)
    }
    
    // Translate column labels
    translatedColumns.value = props.columns.map(column => {
      column.label = t(column.label)
      return column
    })
  }

  onMounted(() => {
    initializeColumns()
  })

  return {
    translatedColumns,
    initializeColumns
  }
}

