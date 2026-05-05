import { ref, onMounted } from 'vue'

/** Applied to vue-good-table th/td for columns that define `actions` (row action buttons). */
const ACTIONS_COLUMN_CLASS = 'vgt-col-actions'

function withActionsColumnAlignment(column) {
  if (!Array.isArray(column.actions) || column.actions.length === 0) {
    return column
  }
  return {
    ...column,
    tdClass: column.tdClass ? `${column.tdClass} ${ACTIONS_COLUMN_CLASS}`.trim() : ACTIONS_COLUMN_CLASS,
    thClass: column.thClass ? `${column.thClass} ${ACTIONS_COLUMN_CLASS}`.trim() : ACTIONS_COLUMN_CLASS,
  }
}

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

    translatedColumns.value = props.columns.map((column) =>
      withActionsColumnAlignment({
        ...column,
        label: t(column.label),
      })
    )
  }

  onMounted(() => {
    initializeColumns()
  })

  return {
    translatedColumns,
    initializeColumns
  }
}

