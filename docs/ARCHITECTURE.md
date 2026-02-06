# Dev-Caddy Architecture v1.2.0

## Overview
Dev-Caddy is a **Single Page Application (SPA)** for developers to manage CLI commands, AI prompts, and workflows. Built with **Next.js 14** (App Router) with **file-based JSON persistence**.

## Tech Stack
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand (2 stores)
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Search**: Fuse.js (fuzzy search)
- **Validation**: Zod schemas
- **Notifications**: Sonner (toast)

## Core Architecture

### Single Page Design
The entire application lives in `/app/page.tsx` (~660 lines):
- **Sidebar**: Category navigation + Edit Mode toggle + Import/Export
- **Main Area**: Displays Commands for selected category with fuzzy search
- **Modals**: Lazy-loaded forms for Commands/Categories (via `next/dynamic`)

### Data Persistence
Data is stored in `app/data/commands.json` via REST API:
- **GET /api/commands**: Read all data
- **POST /api/commands**: Write data (Zod-validated)

```typescript
// Data Schema
interface AppData {
    categories: Category[];
    commands: Record<string, Command[]>; // Keyed by Category ID
}
```

### State Management

| Store | Purpose | Persisted |
|-------|---------|-----------|
| `appStore` | `selectedCategory`, `isEditMode` | LocalStorage |
| `uiStore` | `isSidebarCollapsed` | LocalStorage |

Data state managed by `useCommands` hook (fetching, saving, toggling favorites).

### Edit Mode
A global toggle switch in the Sidebar enables admin features:
- **Drag & Drop**: Reorder categories and commands
- **CRUD Operations**: Create, Edit, Delete, Duplicate
- **Visual Feedback**: Drag handles and action buttons appear only in Edit Mode

### Component Structure
```
components/dev-caddy/
├── Sidebar.tsx           # Navigation + Edit Mode + Import/Export
├── Header.tsx            # Search bar (Ctrl+K)
├── CommandList.tsx       # Command grid with DnD
├── CommandCard.tsx       # Single command display
├── PromptCard.tsx        # Prompt-specific rendering
├── SortableCategoryItem.tsx  # Draggable category item
├── SortableCommandItem.tsx   # Draggable command wrapper
├── skeletons.tsx         # Loading states
├── forms/
│   ├── CommandFormModal.tsx
│   └── CategoryFormModal.tsx
└── editor/
    └── EditorOverlay.tsx # Rich text prompt editor
```

## Directory Structure
```
broworks-dev-caddy/
├── app/
│   ├── page.tsx          # Main SPA (~660 lines)
│   ├── api/commands/     # REST API endpoint
│   └── data/commands.json
├── components/dev-caddy/ # Business components
├── hooks/use-commands.ts # Data fetching hook
├── store/                # Zustand stores
├── types/index.ts        # Centralized types
├── lib/schemas.ts        # Zod validation
└── docs/                 # Documentation
```

## Security
- **Input Validation**: All POST data validated with Zod schemas
- **File-based Storage**: No external database exposure
- **Local-only**: Designed for single-user localhost operation
