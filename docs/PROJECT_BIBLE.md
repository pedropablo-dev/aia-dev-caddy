# Dev-Caddy Project Bible v1.2.1

> The comprehensive guide for developers working on Dev-Caddy.

---

## What is Dev-Caddy?

A personal command palette for developers to:
- Store and organize terminal commands
- Save multi-step workflows
- Manage reusable AI prompts with variables
- Quick-copy anything with `Ctrl+K` search

---

## Project Structure

```
broworks-dev-caddy/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main SPA (660 lines)
│   ├── error.tsx             # Global error boundary
│   ├── not-found.tsx         # 404 page
│   ├── loading.tsx           # Skeleton SSR
│   ├── api/commands/
│   │   └── route.ts          # REST API (Zod validated)
│   ├── data/
│   │   └── commands.json     # Persistent data file
│   ├── globals.css           # Tailwind + CSS variables
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── dev-caddy/            # Business components
│   │   ├── Sidebar.tsx       # Category nav + Edit Mode
│   │   ├── Header.tsx        # Search bar
│   │   ├── CommandList.tsx   # Command grid
│   │   ├── CommandCard.tsx   # Command display
│   │   ├── PromptCard.tsx    # Prompt rendering
│   │   ├── SortableCategoryItem.tsx
│   │   ├── SortableCommandItem.tsx
│   │   ├── skeletons.tsx     # Loading states
│   │   ├── editor/
│   │   │   └── EditorOverlay.tsx
│   │   └── forms/
│   │       ├── CommandFormModal.tsx
│   │       └── CategoryFormModal.tsx
│   └── ui/                   # Shadcn UI components
│
├── hooks/
│   └── use-commands.ts       # Data fetching + state
│
├── lib/
│   ├── utils.ts              # Utility functions (cn)
│   └── schemas.ts            # Zod validation schemas
│
├── types/
│   └── index.ts              # Centralized type definitions
│
├── store/                    # Zustand state management
│   ├── appStore.ts           # App state (selectedCategory, isEditMode)
│   └── uiStore.ts            # UI state (isSidebarCollapsed)
│
└── public/
    └── help.md               # User Guide markdown
```

---

## Architecture Principles

### 1. Single Source of Truth (SSoT)

**Types:** All type definitions in `types/index.ts`
```typescript
import type { Command, Category, AppData } from "@/types"
```

**Schemas:** Zod schemas in `lib/schemas.ts` mirror the types

### 2. Separation of Concerns

| Layer | Responsibility | Location |
|-------|----------------|----------|
| View | Render UI | `components/dev-caddy/` |
| Data | Fetch/Save | `hooks/use-commands.ts` |
| State | Global UI | `store/` |
| Validation | API security | `lib/schemas.ts` |

### 3. Admin-Zero Architecture

**No separate admin routes.** All management via Edit Mode toggle in the Sidebar:
- Toggle the lock icon to enable editing
- Drag handles appear for reordering
- Context menus appear for Edit/Duplicate/Delete

---

## Item Types

### 1. Simple Command
```json
{
  "id": "git-simple-1",
  "label": "Ver Historial de Commits",
  "command": "git log --graph --oneline",
  "type": "command"
}
```

### 2. Command with Variables
```json
{
  "id": "ssh-1",
  "label": "Conectar a Servidor",
  "command": "ssh {user}@{host}",
  "type": "command",
  "variables": [
    { "name": "user", "placeholder": "root" },
    { "name": "host", "placeholder": "192.168.1.1" }
  ]
}
```

### 3. Workflow
```json
{
  "id": "git-workflow-1",
  "label": "Git Save Sequence",
  "command": "workflow",
  "type": "workflow",
  "steps": ["git status", "git add .", "git commit -m \"message\""]
}
```

### 4. Prompt
```json
{
  "id": "prompt-1",
  "label": "Generate Component",
  "command": "Create a React component...",
  "type": "prompt",
  "variables": ["{ComponentName}"]
}
```

---

## API Endpoints

### GET /api/commands
Returns all data from `commands.json`.

### POST /api/commands
**🔒 Zod validated** - Overwrites `commands.json` with validated data.

```typescript
const result = AppDataSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { message: "Validation failed", errors: result.error.flatten() },
    { status: 400 }
  );
}
```

---

## State Management

### Global State (Zustand)
```typescript
// appStore - persisted in localStorage
selectedCategory: string    // Selected category ID
isEditMode: boolean         // Edit mode toggle

// uiStore - persisted in localStorage
isSidebarCollapsed: boolean // Sidebar toggle
```

### Data State (useCommands Hook)
```typescript
const { 
  data, 
  isLoading, 
  hasMounted, 
  fetchData, 
  saveData, 
  toggleFavorite, 
  importData 
} = useCommands()
```

---

## Key Features

### Favorites System
- Click ⭐ to toggle favorite status
- Virtual "Favorites" category shows all starred items

### Search
- `Ctrl+K` focuses search input
- Fuzzy search via Fuse.js across all commands

### Backup System
- **Export:** Downloads `dev-caddy-backup-YYYY-MM-DD.json`
- **Import:** Upload JSON, validates, restores data
- Located in Sidebar (Edit Mode)

### Edit Mode Features
- **Drag & Drop**: Reorder categories and commands
- **Create**: Floating Action Button (bottom-right)
- **Edit**: Click pencil icon or context menu
- **Delete**: Click trash icon or context menu (AlertDialog confirmation)
- **Duplicate**: Click files icon or context menu "Duplicar"

### Auto-Backup System
- **Passive Protection**: Auto-saves to localStorage on every write
- **Storage Key**: `dev-caddy-backup-auto`
- **Recovery**: Access via DevTools > Application > Local Storage
- Complements manual JSON export

### Keyboard Shortcuts
| Shortcut | Context | Action |
|----------|---------|--------|
| `Ctrl+K` | Global | Focus search input |
| `Ctrl+Enter` / `Cmd+Enter` | Modals | Submit form instantly |
| `Esc` | Modals | Close without saving |
| `↑` / `↓` | Search | Navigate results |
| `Enter` | Selected | Copy command to clipboard |

---

## Running Locally

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (port 3000)
npm run build   # Build for production
npm start       # Start production server
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Category IDs | Generated or `kebab-case` | `git-essentials` |
| Command IDs | `cmd-{timestamp}-{random}` | `cmd-1770412922670-m0jq0gqgr` |
| Components | `PascalCase.tsx` | `CommandCard.tsx` |
| Hooks | `use-kebab-case.ts` | `use-commands.ts` |
| Stores | `camelCase.ts` | `appStore.ts` |

---

## Known Limitations

1. **Single-user:** No authentication
2. **Local only:** File-based storage (not cloud-synced)
3. **No undo:** Deletions are permanent, but auto-backup provides recovery option
