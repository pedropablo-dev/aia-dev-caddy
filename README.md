# Dev-Caddy: Your Personal Command Arsenal

**Dev-Caddy** is an ultra-fast, centralized command palette designed to eliminate the friction of searching for and remembering terminal commands, paths, URLs, and complex AI prompts.

_Tired of searching through history, notes, or internal wikis for the same command over and over? Dev-Caddy is the solution._

---

## ✨ Key Features

### **Unified Interface** 
Everything happens on the main page - no context switching required:
- **View Mode:** Browse and execute commands instantly
- **Edit Mode:** Toggle to access creation and management tools
- **Favorites:** Star commands for quick access

### **Creation Modes**
Two specialized creation experiences:
- **📝 Command Modal:** Structured form for standard commands, workflows, and variables
- **✨ Zen Mode Editor:** Full-screen markdown editor for AI prompts with toolbar and live preview

### **Data Security** 
Never lose your data again:
- **Export:** Download JSON backups with date-stamped filenames (`dev-caddy-backup-YYYY-MM-DD.json`)
- **Import:** Restore from backup with instant UI refresh
- **Persistence:** Edit Mode state remembered across sessions

### **Productivity Features**
- **🔍 Fuzzy Search:** Find commands even with typos (`Ctrl+K`)
- **⌨️ Keyboard Navigation:** Arrow keys + Enter for mouse-free workflow
- **📋 One-Click Copy:** Instant copy with visual feedback
- **🔁 Duplicate:** Clone existing commands with one click
- **🖐️ Drag & Drop:** Reorder categories and commands (in Admin panel)
- **🎨 Syntax Highlighting:** Color-coded code blocks for better readability

### Command Types

| Type | Icon | Description |
|:-----|:-----:|:------------|
| **Simple Command** | ▶️ | Direct command ready to copy |
| **Workflow** | 🚀 | Step-by-step guided sequence |
| **With Variables** | 📝 | Templates with dynamic placeholders |
| **AI Prompt** | ✨ | Multi-line prompts with Markdown support |

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| [Next.js](https://nextjs.org/) | 14.2.30 | Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Language |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | Styling |
| [dnd-kit](https://dndkit.com/) | Core | Drag & Drop |
| [Fuse.js](https://fusejs.io/) | 7.0 | Fuzzy Search |
| [Prism React](https://github.com/FormidableLabs/prism-react-renderer) | Latest | Syntax Highlighting |
| [Zustand](https://github.com/pmndrs/zustand) | 5.0.6 | Global State (with localStorage persistence) |
| [Sonner](https://sonner.emilkowal.ski/) | 1.7.1 | Toast Notifications |
| [Zod](https://zod.dev/) | 3.24.1 | API Validation |

---

## 🏗️ Architecture

```
app/
├── page.tsx                     # Main interface (orchestrator)
├── admin/page.tsx               # Legacy admin panel (category management)
├── api/commands/route.ts        # REST API with Zod validation
└── ...

components/dev-caddy/
├── Sidebar.tsx                  # Navigation + Import/Export
├── CommandList.tsx              # Command display + search integration
├── CommandCard.tsx              # Individual command with syntax highlighting
├── forms/
│   ├── CommandFormModal.tsx     # Dialog-based command editor
│   └── EditorOverlay.tsx        # Full-screen prompt editor
└── ...

hooks/
├── use-commands.ts              # Data fetching + CRUD operations
└── ...

store/
├── appStore.ts                  # Zustand store (Edit Mode + Category selection)
└── uiStore.ts                   # UI state (Sidebar collapse)
```

**Key Flow:**
1. User interacts with `app/page.tsx` (main orchestrator)
2. `useCommands` hook manages data fetching and state
3. `CommandList` displays filtered/searched commands
4. Edit Mode reveals FAB dropdown (Create Command/Prompt) and action buttons
5. Changes persist to `app/data/commands.json` via API

---

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/broworks-dev-caddy.git
cd broworks-dev-caddy

# Install dependencies
npm install

# Start development server
npm run dev
```

**URLs:**
- Main app: http://localhost:3002
- Admin panel: http://localhost:3002/admin _(legacy, for category management)_

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Start production build |
| `npm run lint` | Run ESLint |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CURRENT_STATE.md](docs/CURRENT_STATE.md) | Architecture and technical state |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Component diagrams and dependencies |
| [PROJECT_BIBLE.md](docs/PROJECT_BIBLE.md) | Complete developer guide |
| [ROADMAP.md](docs/ROADMAP.md) | Modernization plan (Phases 1-6) |

---

## 🔮 Project Status

**Current Version:** 0.4.0 (Unified + Data Security)

| Area | Status |
|------|--------|
| Core functionality | ✅ Complete |
| Unified interface | ✅ Complete |
| Import/Export backup | ✅ Complete |
| Edit Mode persistence | ✅ Complete |
| Duplicate feature | ✅ Complete |
| Fuzzy Search | ✅ Complete |
| Drag & Drop | ✅ Complete (Admin only) |
| Syntax Highlighting | ✅ Complete |
| API Validation (Zod) | ✅ Complete |
| Tests | ❌ Pending |
| Serverless deployment | ❌ Requires database |

---

## 🏛️ Legacy Access

The `/admin` route is still available for **Category Management** (creating, editing, and drag-dropping categories). It will be integrated into the main interface in a future phase.

**Why it's separate:** The unification phase prioritized command management. Category management via the dedicated admin panel provides a more robust drag-and-drop experience for now.

---

## 📄 License

MIT