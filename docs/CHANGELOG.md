# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-02-07
### Added
- **Favorites Dashboard**: Dedicated view with sorting (Usage, Category, Alpha) and analytics.
- **Smart Duplication**: Duplicated Commands and Categories now appear immediately after the original item.
- **Clear Search**: Added 'X' buttons to clear search inputs in Header and Sidebar.

### Changed
- **UI Cleanup**: Removed legacy Help/User Guide button and modal.
- **UX**: Drag & drop handles are now hidden in Favorites view to prevent confusion.
- **Performance**: Optimized sorting logic for Favorites view.

## [1.2.1] - 2026-02-07 "The Polish Update"

### Added
- **Auto-Backup System**: Passive backup to localStorage after every save operation
  - Storage key: `dev-caddy-backup-auto`
  - Console log: "🔒 Auto-backup saved to localStorage"
- **Keyboard Shortcuts**: Power user productivity enhancements
  - `Ctrl+Enter` / `Cmd+Enter`: Submit any modal form instantly
  - `Esc`: Close modals without saving (native Shadcn Dialog behavior)
- **Enhanced Delete Confirmations**: Replaced all `window.confirm()` with Shadcn AlertDialog
  - Affected: Command deletion, Category deletion (Sidebar, Forms, page.tsx)
- **Toast Improvements**:
  - Repositioned to bottom-center (doesn't obstruct FAB)
  - Added success feedback for favorite toggle actions

### Removed
- **Obsolete Form Components**: Deleted unused Sheet variants
  - `components/dev-caddy/forms/CommandFormSheet.tsx`
  - `components/dev-caddy/forms/CategoryFormSheet.tsx`
- **Orphaned Directory**: Deleted `context/` folder with unused `ToastContext.tsx`
- **Garbage Data**: Cleaned 9 test categories named "e" from `commands.json`

### Fixed
- **ReferenceError in Modals**: Moved `useEffect` for keyboard shortcuts after `handleSubmit` definition
- **Duplicate Comment**: Removed duplicate "Custom Hook for Data Logic" comment in page.tsx

### Documentation
- Updated `README.md` with new Key Features
- Updated `docs/ARCHITECTURE.md` with two-layer Data Persistence and UX Patterns
- Updated `docs/PROJECT_BIBLE.md` with Shortcuts section and corrected limitations
- Updated `docs/ROADMAP_TO_PERFECTION.md` with completion status for implemented items

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
