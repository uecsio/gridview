# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@uecsio/gridview` is a Vue 3 grid/table component library published to npm. It wraps `vue-good-table-next` with server-side pagination, sorting, filtering, and CRUD actions, using TanStack Query for data fetching and caching.

## Build Commands

- `npm run build` - Build with Rollup (CJS + ESM outputs to `dist/`)
- `npm run build:dev` - Development build
- `npm run build:prod` - Production build (minified, console statements stripped)
- `npm run dev` - Watch mode for development
- No test suite is configured (`npm test` is a no-op)

## Architecture

The library is a single Vue 3 component (`GridView`) with supporting composables, sub-components, and registries. Entry point is `index.js` which re-exports everything. Type definitions are in `index.d.ts`.

### Core data flow

```
User interaction -> GridFilterCell.vue -> vue-good-table-next event
-> useGridEvents (processes filters) -> useGridQuery.updateParams
-> TanStack Query (detects queryKey change) -> API fetch -> reactive gridData -> re-render
```

### Key directories under `src/components/GridView/`

- **`index.vue`** - Main orchestrator component. Renders `vue-good-table-next` with toolbar, filter cells, and action cells.
- **`composables/`** - Vue 3 composables that encapsulate distinct concerns:
  - `useGridQuery.js` - TanStack Query integration, URL building, server params, caching (30s stale time)
  - `useGridEvents.js` - Event handlers for pagination, sort, filter, selection
  - `useGridConfig.js` - Pagination/sort/select options (i18n-aware)
  - `useGridColumns.js` - Column translation and module initialization
  - `useGridActions.js` - Action params and manual refresh
  - `useFormatters.js` - Column formatter resolution and application
- **`components/`** - Sub-components: `GridActionsCell.vue`, `GridFilterCell.vue`, `DateRangeFilter.vue`
- **`registries/`** - Global registries for formatters and action components, plus built-in `CommonEditAction`, `CommonDeleteAction`, `CommonStatusAction`
- **`styles/`** - `gridview-base.css` and `action-links.scss`

### API contract

The grid expects API responses in this format:
```json
{ "data": [...], "count": 10, "total": 100, "page": 1, "pageCount": 10 }
```

Filters are sent as query params: `field||operator||value` (e.g., `name||cont||john`, `status||eq||1`, `createdAt||between||<iso>,<iso>`)

### Plugin system

- **Formatters**: Registered via `registerCommonFormatter(name, fn)`, resolved by string name in column definitions
- **Action components**: Registered via `registerActionComponent(name, component)`, referenced by `componentName` in column action config
- **Module-level overrides**: Consumers pass `moduleActionComponents` and `moduleFormatters` props for per-grid customization

## Key Peer Dependencies

Vue 3, `@tanstack/vue-query`, `@uecsio/api-client`, `vue-good-table-next`, `@vuepic/vue-datepicker`, `vue-i18n`, FontAwesome, `date-fns`. All are external in the Rollup build.

## Build Configuration

Rollup (`rollup.config.js`) produces two bundles:
1. CJS (`dist/index.js`) and ESM (`dist/index.esm.js`) with source maps
2. Type definitions bundle (`dist/index.d.ts`) via `rollup-plugin-dts`

Production builds strip `console.log/info/debug` via terser. CSS is extracted to `dist/index.css`.

## Conventions

- Source is JavaScript (not TypeScript), despite tsconfig.json being present for type-checking support
- All i18n strings use translation keys (e.g., `$t('grid.extendedSearch')`) - never hardcoded user-facing text
- The `apiClient` prop or `baseUrl` prop must be provided; the component throws a descriptive error if neither is set
- Filter type determines query operator: `text` -> `cont`, `select` -> `eq`, `daterange` -> `between`
