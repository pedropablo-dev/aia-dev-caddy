# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-02-06
### Added
- **Category Duplication**: Duplicate categories with all nested commands via context menu
- **Context Menu Icons**: Unified visual style with Pencil, Copy, Trash2 icons in category dropdown
- **Overflow Protection**: Added `overflow-x-hidden` to sidebar container

### Fixed
- **Sidebar Layout**: Restructured layout with `h-full` and proper flexbox
- **Category Name Truncation**: Long names now truncate properly with ellipsis
- **Favorites Positioning**: Static favorites category moved outside ScrollArea
- **Icon Swap**: Corrected Export/Import icons (Upload/Download)

## [1.1.0] - 2026-02-06
### Added
- **Command Duplication**: Clone commands with new unique IDs
- **Drag & Drop**: Full reordering for categories and commands via @dnd-kit
- **LIFO Ordering**: New items appear at the top of lists
- **Fuzzy Search**: Fuse.js integration for global command search

### Changed
- **Admin-Zero Architecture**: Removed `/admin` routes, all management via Edit Mode toggle
- **Lazy Loading**: Modals loaded via `next/dynamic` for performance

## [1.0.0] - 2026-02-05
### Added
- **Dynamic Variables**: Support for `{variable}` syntax with auto-generated input fields
- **Help System**: In-app markdown-based User Guide
- **Toast Notifications**: Sonner integration for feedback
- **Zod Validation**: API-level data validation

### Changed
- **UI Overhaul**: Complete Shadcn UI migration with dark mode aesthetic
- **Storage**: File-based JSON persistence via API route

## [0.8.0] - 2026-02-04
### Added
- Basic CRUD for Commands
- Category management
- Initial Dark Mode support
