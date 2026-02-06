# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-06
### Added
- **Dynamic Variables**: Support for `{variable}` syntax in prompts with auto-generated input fields.
- **Help System**: In-app markdown-based User Guide.
- **Toast Notifications**: Custom dark-themed notification system replacing native alerts.
- **Drag & Drop**: Full Reordering support for Categories and Commands via `@dnd-kit`.
- **LIFO Ordering**: New items are automatically added to the top of lists.

### Changed
- **UI Overhaul**: Complete migration to Shadcn UI with a "Dark Mode" aesthetic.
- **Architecture**: Admin-zero approach. All management is done via "Edit Mode" toggle in the sidebar.
- **Storage**: Optimized LocalStorage persistence with resilient schema.

## [0.8.0] - 2026-02-05
### Added
- Basic CRUD for Commands.
- Category management.
- Initial Dark Mode support.
