/**
 * @uecsio/gridview TypeScript Definitions
 */

import { App, Component, ComputedRef, Ref } from 'vue'

// Main GridView Component
export interface GridViewProps {
  id: string
  columns?: ColumnDefinition[]
  columnsModule?: ColumnModule
  path: string
  addRoute?: string
  addText?: string
  enableCheckboxes?: boolean
  defaultSort?: string
  moduleActionComponents?: Record<string, Component>
  moduleFormatters?: Record<string, Function>
  extraParams?: Record<string, any>
}

export interface ColumnDefinition {
  label: string
  field: string
  sortable?: boolean
  width?: string
  filterOptions?: FilterOptions
  formatter?: string
  formatterOptions?: Record<string, any>
  actions?: ActionDefinition[]
}

export interface FilterOptions {
  filterType: 'text' | 'select' | 'daterange'
  placeholderKey?: string
  options?: FilterOption[]
}

export interface FilterOption {
  value: any
  textKey: string
}

export interface ActionDefinition {
  action: {
    type: 'component' | 'callback'
    componentName?: string
    callback?: Function
  }
  props?: Record<string, any>
}

export interface ColumnModule {
  columns: ColumnDefinition[]
  setTranslationFunction: (t: Function) => void
}

// Grid Data Types
export interface GridData {
  data: any[]
  count: number
  total: number
  page: number
  pageCount: number
}

export interface ServerParams {
  page: number
  perPage: number
  sort: SortDefinition[]
  columnFilters: Record<string, any>
}

export interface SortDefinition {
  field: string
  type: 'asc' | 'desc'
}

// Composable Return Types
export interface UseGridQueryReturn {
  serverParams: Ref<ServerParams>
  selectedRows: Ref<any[]>
  gridData: ComputedRef<GridData>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<Error | null>
  refetch: () => void
  updateParams: (params: Partial<ServerParams>) => void
  updateSelectedRows: (rows: any[]) => void
}

export interface UseGridEventsReturn {
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  onSortChange: (sort: SortDefinition[]) => void
  onColumnFilter: (filters: Record<string, any>) => void
  onSelectionChanged: (rows: any[]) => void
}

export interface UseGridConfigReturn {
  paginationOptions: ComputedRef<any>
  sortOptions: ComputedRef<any>
  selectOptions: ComputedRef<any>
}

export interface UseGridColumnsReturn {
  translatedColumns: ComputedRef<ColumnDefinition[]>
}

export interface UseGridActionsReturn {
  actionParams: ComputedRef<any>
  loadItems: () => void
}

export interface UseFormattersReturn {
  getFormatter: (name: string) => Function | null
  processColumn: (column: ColumnDefinition) => ColumnDefinition
  processColumns: (columns: ColumnDefinition[]) => ColumnDefinition[]
}

// Formatter Types
export interface FormatterFunction {
  (value: any, options?: Record<string, any>): string
}

export interface FormatterOptions {
  maxLength?: number
  suffix?: string
  format?: string
  mapping?: Record<string, string>
  maxScore?: number
  currency?: string
  locale?: string
}

// Action Component Props
export interface CommonEditActionProps {
  row: any
  actionParams: any
  routeName?: string
  routeParamsResolver?: (row: any) => any
  entityName?: string
}

export interface CommonDeleteActionProps {
  row: any
  actionParams: any
  entityName: string
  confirmMessageKey?: string
  errorMessageKey?: string
  onDelete?: (id: string) => Promise<void>
}

// Registry Types
export interface FormatterRegistry {
  registerCommonFormatter: (name: string, formatter: FormatterFunction) => void
  getCommonFormatter: (name: string) => FormatterFunction | null
  hasCommonFormatter: (name: string) => boolean
  getCommonFormatterNames: () => string[]
}

export interface ActionComponentRegistry {
  registerActionComponent: (name: string, component: Component) => void
  getActionComponent: (name: string) => Component | null
  hasActionComponent: (name: string) => boolean
}

// Plugin Options
export interface GridViewPluginOptions {
  globalOptions?: Record<string, any>
}

// Main Exports
export declare const GridView: Component<GridViewProps>

// Composable Exports
export declare function useGridQuery(props: GridViewProps): UseGridQueryReturn
export declare function useGridEvents(props: GridViewProps): UseGridEventsReturn
export declare function useGridConfig(props: GridViewProps): UseGridConfigReturn
export declare function useGridColumns(props: GridViewProps): UseGridColumnsReturn
export declare function useGridActions(props: GridViewProps): UseGridActionsReturn
export declare function useFormatters(moduleFormatters?: Record<string, Function>): UseFormattersReturn

// Sub-component Exports
export declare const GridActionsCell: Component
export declare const GridFilterCell: Component
export declare const DateRangeFilter: Component

// Registry Exports
export declare const registerCommonFormatter: (name: string, formatter: FormatterFunction) => void
export declare const getCommonFormatter: (name: string) => FormatterFunction | null
export declare const hasCommonFormatter: (name: string) => boolean
export declare const getCommonFormatterNames: () => string[]

export declare const registerActionComponent: (name: string, component: Component) => void
export declare const getActionComponent: (name: string) => Component | null
export declare const hasActionComponent: (name: string) => boolean

// Common Formatter Exports
export declare const CommonDateFormatter: FormatterFunction
export declare const CommonStatusFormatter: FormatterFunction
export declare const CommonTruncateFormatter: FormatterFunction
export declare const CommonScoreFormatter: FormatterFunction
export declare const CommonCurrencyFormatter: FormatterFunction

// Common Action Component Exports
export declare const CommonEditAction: Component<CommonEditActionProps>
export declare const CommonDeleteAction: Component<CommonDeleteActionProps>

// Cache Management Exports
export declare function getQueryClient(): any
export declare function clearGridCache(gridId: string): void
export declare function clearAllGridCache(): void
export declare function invalidateGridCache(gridId: string): void
export declare function invalidateAllGridCache(): void
export declare function clearAllCache(): void
export declare function clearCacheByKey(queryKey: any[]): void
export declare function invalidateCacheByKey(queryKey: any[]): void

// Utility Exports
export declare const GridUtils: {
  formatDate: (date: Date | string, format: string) => string
  formatFileSize: (bytes: number) => string
  debounce: (func: Function, wait: number) => Function
  deepMerge: (target: any, source: any) => any
}

// Plugin Installation
export declare function install(app: App, options?: GridViewPluginOptions): void

// Version
export declare const version: string

// Default Export
declare const _default: {
  install: typeof install
}

export default _default
