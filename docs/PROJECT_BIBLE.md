# Dev-Caddy Project Bible v0.2.0

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
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Main launchpad (160 lines)
│   ├── error.tsx             # Global error boundary
│   ├── not-found.tsx         # 404 page
│   ├── loading.tsx           # Skeleton SSR
│   ├── admin/
│   │   ├── page.tsx          # Admin panel (CRUD)
│   │   └── editor/page.tsx   # Rich text prompt editor
│   ├── api/commands/
│   │   └── route.ts          # REST API (Zod validated)
│   ├── data/
│   │   └── commands.json     # Data file
│   ├── globals.css           # Tailwind + CSS variables
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── dev-caddy/            # 🆕 Atomic components
│   │   ├── Sidebar.tsx       # Category navigation
│   │   ├── Header.tsx        # Search bar
│   │   ├── CommandList.tsx   # Command list
│   │   ├── CommandCard.tsx   # Command display
│   │   ├── skeletons.tsx     # Loading states
│   │   └── backup-controls.tsx # Export/Import
│   └── ui/                   # Shadcn UI components
│
├── hooks/                    # 🆕 Custom React hooks
│   └── use-commands.ts       # Data fetching + state
│
├── lib/
│   ├── utils.ts              # Utility functions (cn)
│   └── schemas.ts            # 🆕 Zod validation schemas
│
├── types/                    # 🆕 Centralized types (SSoT)
│   └── index.ts              # All type definitions
│
├── store/                    # Zustand state management
│   ├── appStore.ts           # App state
│   └── uiStore.ts            # UI state
│
└── public/                   # Static assets
```

---

## Architecture Principles

### 1. Single Source of Truth (SSoT)

**Types:** All type definitions live in `types/index.ts`
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

### 3. Atomic Component Design

Components are small, focused, and reusable:
- **Sidebar** handles navigation only
- **CommandCard** handles display only
- **useCommands** handles data only

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
  "type": "prompt"
}
```

---

## API Endpoints

### GET /api/commands
Returns all data from `commands.json`.

### POST /api/commands
**🔒 Zod validated** - Overwrites `commands.json` with new data.

```typescript
// Validation
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
selectedCategory: string      // Main view selection
adminSelectedCategory: string // Admin view selection

// uiStore
isSidebarCollapsed: boolean   // Sidebar toggle
```

### Data State (useCommands Hook)
```typescript
const { data, isLoading, hasMounted, fetchData, saveData, toggleFavorite, importData } = useCommands()
```

---

## Key Features

### Favorites System
- Click ⭐ to toggle favorite status
- Virtual "Favorites" category shows all starred items

### Search
- `Ctrl+K` focuses search input
- Filters by label and command content

### Backup System 🆕
- **Export:** Downloads `dev-caddy-backup-YYYY-MM-DD.json`
- **Import:** Upload JSON, validates structure, restores data
- Located in Admin panel header

### Error Handling 🆕
- **Error boundary:** Catches crashes, shows reset button
- **404 page:** Branded navigation back home
- **Toast notifications:** All errors show toasts

---

## Running Locally

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (port 3002)
npm run build   # Build for production
npm start       # Start production server
```

**URLs:**
- Main app: http://localhost:3002
- Admin panel: http://localhost:3002/admin
- Prompt editor: http://localhost:3002/admin/editor

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Category IDs | `kebab-case` | `git-essentials` |
| Command IDs | `type-category-number` | `git-simple-1` |
| Components | `PascalCase.tsx` | `CommandCard.tsx` |
| Hooks | `use-kebab-case.ts` | `use-commands.ts` |
| Stores | `camelCase.ts` | `appStore.ts` |

---

## Common Tasks

### Adding a New Category
1. Go to `/admin`
2. Click "Añadir" under Categories
3. Enter name and emoji icon
4. Save

### Creating a Backup
1. Go to `/admin`
2. Click "Exportar Backup" in header
3. JSON file downloads automatically

### Restoring from Backup
1. Go to `/admin`
2. Click "Importar Backup"
3. Select `.json` file
4. Data restores automatically

---

## Known Limitations

1. **Single-user:** No authentication
2. **Local only:** File-based storage (no serverless)
3. **No undo:** Deletions are permanent (use backups!)
