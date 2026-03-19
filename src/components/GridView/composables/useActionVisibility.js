/**
 * Declarative action visibility evaluation.
 *
 * Supports `visibleWhen` conditions using the same operators as grid filters:
 * eq, neq, cont, in, between.
 */

const evaluateCondition = (condition, row) => {
  const fieldValue = row[condition.field]
  const targetValue = condition.value

  switch (condition.operator) {
    case 'eq':
      return String(fieldValue) === String(targetValue)
    case 'neq':
      return String(fieldValue) !== String(targetValue)
    case 'cont':
      return String(fieldValue).toLowerCase().includes(String(targetValue).toLowerCase())
    case 'in':
      return Array.isArray(targetValue) && targetValue.some(v => String(fieldValue) === String(v))
    case 'between':
      return Array.isArray(targetValue) && fieldValue >= targetValue[0] && fieldValue <= targetValue[1]
    default:
      return true
  }
}

/**
 * Check if an action should be visible based on declarative visibleWhen conditions.
 * Accepts a single condition object or an array of conditions (AND logic).
 *
 * @param {Object} action - Action definition with optional visibleWhen
 * @param {Object} row - Current row data
 * @returns {boolean}
 */
export const isActionVisible = (action, row) => {
  if (!action.visibleWhen) {
    return true
  }

  const conditions = Array.isArray(action.visibleWhen) ? action.visibleWhen : [action.visibleWhen]
  return conditions.every(condition => evaluateCondition(condition, row))
}
