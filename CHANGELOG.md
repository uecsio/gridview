# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-28

### Added
- **CommonStatusAction Component**: New action component for toggling status values (active/hidden)
  - Click to toggle between status 1 (active) and 0 (hidden)
  - Visual feedback with FontAwesome icons (check/ban)
  - Color-coded status indicators (green for active, red for hidden)
  - Loading state with spinner during API calls
  - Automatic grid refresh after status change
  - Support for custom status field names
  - Customizable success/error messages
  - Events: `updated`, `error`

### Changed
- **BREAKING**: Integrated @uecsio/api-client for all HTTP requests
  - Replaced native fetch() with @uecsio/api-client across all components
  - Added `apiClient` prop to GridView component for passing configured API client instance
  - Added `baseUrl` prop to GridView component for automatic API client creation
  - Removed dependency on consumer's environmentService (now requires explicit configuration)
  - All action components now use apiClient from actionParams
  - **Migration**: You must now pass either `apiClient` or `baseUrl` prop to GridView component

### Fixed
- Improved error handling with centralized API client
- Better TypeScript support with typed API responses
- More consistent authentication token handling across requests

### Security
- Removed implicit dependency on consumer's environment service
- Explicit configuration required for API requests (fail-fast with helpful errors)
- Better isolation between library and consumer code

### Dependencies
- Added @uecsio/api-client ^1.0.0 as peer dependency

## [1.0.5] - 2024-10-13

### Fixed
- Updated vue-good-table-next peer dependencies to support both v0.1 and v0.2
- Improved compatibility with existing projects using vue-good-table-next v0.2

## [1.0.4] - 2024-10-13

### Fixed
- Updated date-fns peer dependencies to support both v2 and v4
- Improved compatibility with existing projects using date-fns v4

## [1.0.3] - 2024-10-13

### Fixed
- Updated VueDatePicker peer dependencies to support both v4 and v11
- Improved compatibility with existing projects using VueDatePicker v11

## [1.0.2] - 2024-10-13

### Fixed
- Updated TanStack Query peer dependencies to support both v4 and v5
- Improved compatibility with existing projects using TanStack Query v5

## [1.0.1] - 2024-10-13

### Fixed
- Updated FontAwesome peer dependencies to support both v6 and v7
- Improved compatibility with existing projects using FontAwesome v7

## [1.0.0] - 2024-01-15

### Added
- Initial release of @uecsio/gridview
- Vue 3 Composition API support
- Server-side pagination with TanStack Query
- Advanced filtering (text, select, date range)
- Multi-column sorting with visual indicators
- Customizable action components (edit, delete, custom)
- Built-in internationalization support
- Responsive design for all screen sizes
- TypeScript definitions
- Extensible architecture with plugin system
- Performance optimizations with virtual scrolling
- Built-in formatters (date, status, truncate, score, currency)
- Common action components (edit, delete)
- Date range picker integration
- FontAwesome icon support
- CSS variable theming system
- Comprehensive documentation and examples

### Features
- **GridView Component**: Main grid component with full CRUD operations
- **Composables**: Modular architecture with reusable composables
- **Sub-components**: GridActionsCell, GridFilterCell, DateRangeFilter
- **Registries**: Formatter and action component registries
- **Utilities**: Grid utilities for common operations
- **Plugin System**: Easy installation and configuration

### Dependencies
- Vue 3.0+
- @tanstack/vue-query 4.0+
- vue-good-table-next 0.1.0+
- @vuepic/vue-datepicker 4.0.0+
- @coreui/vue 5.0.0+
- @coreui/icons-vue 2.0.0+
- vue-i18n 9.0.0+

### Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## [Unreleased]

### Planned
- Virtual scrolling for large datasets
- Export functionality (CSV, Excel, PDF)
- Advanced column configuration
- Row grouping and tree view
- Custom cell renderers
- Inline editing
- Bulk operations
- Column resizing and reordering
- Print functionality
- Accessibility improvements
- More built-in formatters
- Custom theme support
- Performance monitoring
- Unit tests
- E2E tests
