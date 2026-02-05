# Dev-Caddy Project Bible

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
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Main launchpad UI
│   ├── admin/
│   │   ├── page.tsx        # Admin panel (CRUD)
│   │   └── editor/
│   │       └── page.tsx    # Rich text prompt editor
│   ├── api/
│   │   └── commands/
│   │       └── route.ts    # REST API endpoints
│   ├── data/
│   │   └── commands.json   # Data file (source of truth)
│   ├── globals.css         # Tailwind + CSS variables
│   └── layout.tsx          # Root layout
│
├── components/
│   └── ui/                 # Shadcn UI components (50 files)
│
├── store/                  # Zustand state management
│   ├── appStore.ts         # App state (selected category)
│   └── uiStore.ts          # UI state (sidebar collapsed)
│
├── hooks/                  # Custom React hooks
├── lib/
│   └── utils.ts            # Utility functions (cn)
├── public/                 # Static assets
└── styles/                 # Additional styles
```

---

## Item Types

### 1. Simple Command
A single command ready to copy.
```json
{
  "id": "git-simple-1",
  "label": "Ver Historial de Commits",
  "command": "git log --graph --oneline",
  "type": "command"
}
```

### 2. Command with Variables
Template with dynamic placeholders.
```json
{
  "id": "ssh-1",
  "label": "Conectar a Servidor",
  "command": "ssh {user}@{host} -p {port}",
  "type": "command",
  "variables": [
    { "name": "user", "placeholder": "root" },
    { "name": "host", "placeholder": "192.168.1.1" },
    { "name": "port", "placeholder": "22" }
  ]
}
```

### 3. Workflow
Sequential multi-step command sequence.
```json
{
  "id": "git-workflow-1",
  "label": "Git Save Sequence",
  "command": "workflow",
  "type": "workflow",
  "steps": [
    "git status",
    "git add .",
    "git commit -m \"message\"",
    "git push origin main"
  ]
}
```

### 4. Prompt
Multi-line AI prompt with Markdown support.
```json
{
  "id": "prompt-1",
  "label": "Generate React Component",
  "command": "Create a React component...",
  "type": "prompt",
  "variables": ["{ComponentName}"]
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Category IDs | `kebab-case` | `git-essentials` |
| Command IDs | `type-category-number` | `git-simple-1` |
| Component files | `PascalCase.tsx` | `CommandCard.tsx` |
| Stores | `camelCase.ts` | `appStore.ts` |
| CSS classes | Tailwind utilities | `bg-gray-900` |

---

## API Endpoints

### GET /api/commands
Returns all data from `commands.json`.

```typescript
// Response
{
  categories: Category[],
  commands: Record<string, Command[]>
}
```

### POST /api/commands
Overwrites `commands.json` with new data.

```typescript
// Request body
{
  categories: Category[],
  commands: Record<string, Command[]>
}

// Response
{ message: "Commands saved successfully!" }
```

---

## State Management

### Global State (Zustand)
Persisted in localStorage:

```typescript
// appStore
selectedCategory: string      // Main view selection
adminSelectedCategory: string // Admin view selection

// uiStore  
isSidebarCollapsed: boolean   // Sidebar toggle
```

### Local State
Each page manages:
- `data` - Fetched commands/categories
- `isLoading` - Loading states
- Form inputs for CRUD operations

---

## Key Features

### Favorites System
- Click ⭐ to toggle favorite status
- Virtual "Favorites" category shows all favorites
- Persisted in `commands.json` as `isFavorite: true`

### Search
- `Ctrl+K` focuses search input
- Filters by label and command content
- Category sidebar has separate search

### Drag & Reorder
- Up/Down arrows in Admin panel
- Updates `order` field
- Saves immediately to file

### Prompt Editor
- Rich markdown toolbar
- Variable insertion panel
- Zen mode for distraction-free editing
- Character/word count
- Find within content

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (port 3002)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**URLs:**
- Main app: http://localhost:3002
- Admin panel: http://localhost:3002/admin
- Prompt editor: http://localhost:3002/admin/editor

---

## Common Tasks

### Adding a New Category
1. Go to `/admin`
2. Click "Añadir" under Categories
3. Enter name and emoji icon
4. Save

### Adding a New Command
1. Select a category in Admin
2. Click "Añadir Item" for simple/workflow
3. Or "Añadir Prompt" for rich prompts
4. Fill form and save

### Editing Data Directly
Edit `app/data/commands.json` and restart the dev server.

---

## Known Limitations

1. **Single-user**: No authentication
2. **Local only**: File-based storage doesn't scale
3. **No undo**: Deletions are permanent
4. **No backup**: Manual backup required
