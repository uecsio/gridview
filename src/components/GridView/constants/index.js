/**
 * Row actions without status toggle: edit and delete only.
 *
 * @example
 * import { DEFAULT_ACTIONS_WITHOUT_STATUS } from '@uecsio/gridview'
 * columns: [{ key: 'actions', actions: DEFAULT_ACTIONS_WITHOUT_STATUS }]
 */
export const DEFAULT_ACTIONS_WITHOUT_STATUS = [
  { componentName: 'CommonEditAction' },
  { componentName: 'CommonDeleteAction' },
]

/**
 * Default set of row actions: status toggle, edit, delete.
 *
 * @example
 * import { DEFAULT_ACTIONS } from '@uecsio/gridview'
 * columns: [{ key: 'actions', actions: DEFAULT_ACTIONS }]
 */
export const DEFAULT_ACTIONS = [
  { componentName: 'CommonStatusAction' },
  ...DEFAULT_ACTIONS_WITHOUT_STATUS,
]

