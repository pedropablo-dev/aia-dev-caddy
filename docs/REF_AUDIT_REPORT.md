# Refactor Audit Report: Single Context Application Migration

> **Date:** 2026-02-06  
> **Objective:** Migrate from Multi-Page App to Single Context Application with Global Edit Mode

---

## Executive Summary

This audit analyzes the current Dev-Caddy architecture to prepare for merging the Admin View (`app/admin/`) into the Main Dashboard (`app/page.tsx`) using a "Global Edit Mode" toggle.

### Key Findings

| Metric | Value | Impact |
|--------|-------|--------|
| Total files to refactor | **8** | Medium complexity |
| Admin page size | **484 lines** | Requires modular extraction |
| Editor page size | **466 lines** | Zen Mode ready for overlay migration |
| Store conflicts | **1** (category selection) | Easy merge |
| UI components ready | **Sheet, Dialog, Switch** | ✅ Available |
| Dependencies installed | **@dnd-kit/core, /sortable, /utilities** | ✅ Already in package.json |

---

## Part 1: File-by-File Analysis

### 1.1 Main Dashboard — `app/page.tsx` (214 lines)

**Current Responsibilities:**
- Category navigation via `Sidebar`
- Command list display via `CommandList`
- Fuzzy search with Fuse.js
- Keyboard navigation (Arrow keys, Enter, Escape)
- Copy-to-clipboard functionality
- Toggle favorites

**State Used:**
```typescript
const { selectedCategory } = useAppStore()      // ← Visual mode category
const [searchQuery, setSearchQuery] = useState("")
const [selectedIndex, setSelectedIndex] = useState(0)
const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
const [variableValues, setVariableValues] = useState<Record<string, string>>({})
const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
```

**Data Source:** `useCommands()` hook

**Migration Impact:** LOW — This is the target page. Will receive admin functionality.

---

### 1.2 Admin Panel — `app/admin/page.tsx` (484 lines)

**Current Responsibilities:**
- Full CRUD for Categories (Add, Edit, Delete, Duplicate)
- Full CRUD for Commands (Add, Edit, Delete, Duplicate)
- Drag & Drop reordering (DndContext, SortableContext)
- Route to Prompt Editor (`/admin/editor`)
- Backup controls (Export/Import JSON)

**State Used:**
```typescript
const { adminSelectedCategory, setAdminSelectedCategory } = useAppStore()  // ← Admin category
const [data, setData] = useState<AppData>({ categories: [], commands: {} })
const [isLoading, setIsLoading] = useState(true)
const [addCategoryOpen, setAddCategoryOpen] = useState(false)
const [editingCategory, setEditingCategory] = useState<Category | null>(null)
const [addCommandOpen, setAddCommandOpen] = useState(false)
const [editingCommand, setEditingCommand] = useState<Command | null>(null)
// ... dialog states, form states
```

**Components to Extract:**

| Component | Lines | Description | Target |
|-----------|-------|-------------|--------|
| `CategoryFormDialog` | ~40 | Add/Edit category modal | `components/forms/CategoryFormDialog.tsx` |
| `CommandFormSheet` | ~100 | Add/Edit command side panel | `components/forms/CommandFormSheet.tsx` |
| `DeleteConfirmation` | ~30 | Alert dialog for deletion | `components/forms/DeleteConfirmation.tsx` |
| DnD Logic | ~60 | `handleDragEnd`, sensors | Integrate into main page |

**Migration Impact:** HIGH — Core of the refactor. Must be decomposed into smaller units.

---

### 1.3 Prompt Editor — `app/admin/editor/page.tsx` (466 lines)

**Current Responsibilities:**
- Full-featured Markdown editor
- Text formatting toolbar (Bold, Italic, Headers, Lists, etc.)
- Dynamic variables management
- Zen Mode (full-screen editing)
- In-text search with navigation
- Save & Exit functionality

**State Used:**
```typescript
const [label, setLabel] = useState("")
const [text, setText] = useState("")
const [variables, setVariables] = useState<string[]>([])
const [isZenMode, setIsZenMode] = useState(false)
const [searchTerm, setSearchTerm] = useState("")
const [searchMatches, setSearchMatches] = useState<number[]>([])
```

**Query Params:** `commandId`, `categoryId`

> [!IMPORTANT]
> The editor already has Zen Mode implemented (`isZenMode` state). The refactor should convert this entire component into an **EditorOverlay** that opens on top of the dashboard instead of navigating to a new route.

**Migration Impact:** MEDIUM — Logic can be extracted as-is into an overlay component.

---

### 1.4 Zustand Stores

#### `store/appStore.ts` (24 lines)

```typescript
interface AppState {
  selectedCategory: string              // ← Used in Visual Mode (page.tsx)
  adminSelectedCategory: string | null  // ← Used in Edit Mode (admin/page.tsx)
  setSelectedCategory: (id: string) => void
  setAdminSelectedCategory: (id: string | null) => void
}
```

> [!WARNING]
> **Conflict Identified:** Two separate category selections exist.
> 
> **Proposed Solution:** Unify into a single `selectedCategory` that works in both modes. When toggling to Edit Mode, the current category stays selected.

#### `store/uiStore.ts` (21 lines)

```typescript
interface UIState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}
```

**Migration Impact:** LOW — No conflicts. This store is fine.

---

### 1.5 Components Analysis

#### `components/dev-caddy/Sidebar.tsx` (176 lines)

**Current:** Uses `selectedCategory` from appStore. Contains Admin Panel link.

**Required Changes:**
- Add Mode Toggle switch to header area
- Conditionally show Edit/Delete buttons on categories when in Edit Mode
- Keep Admin Panel link as fallback during transition

---

#### `components/dev-caddy/CommandCard.tsx` (233 lines)

**Current:** Display-only with copy functionality.

**Required Changes:**
- Accept `isEditMode` prop
- Conditionally render Edit/Delete buttons when in Edit Mode
- Click behavior changes: Copy (Visual) → Open Form (Edit)

---

#### `components/dev-caddy/SortableCategoryItem.tsx` (92 lines)

**Current:** Admin-only. Has drag handle, edit button, delete button.

**Required Changes:** None — will be lazy-loaded for Edit Mode only.

---

#### `components/dev-caddy/SortableCommandItem.tsx` (99 lines)

**Current:** Admin-only. Has drag handle, edit/delete/duplicate buttons.

**Required Changes:** None — will be lazy-loaded for Edit Mode only.

---

### 1.6 UI Components Available

| Component | Path | Usage |
|-----------|------|-------|
| **Sheet** | `components/ui/sheet.tsx` | Side panels for Create/Edit forms |
| **Dialog** | `components/ui/dialog.tsx` | Modals for confirmations, category form |
| **Switch** | `components/ui/switch.tsx` | Mode toggle in header |
| **AlertDialog** | `components/ui/alert-dialog.tsx` | Delete confirmations |

All required UI primitives are **already available** in the project.

---

## Part 2: Dependency Analysis

### Current Dependencies (from package.json)

| Dependency | Version | Used By | Migration Impact |
|------------|---------|---------|------------------|
| `@dnd-kit/core` | ^6.3.1 | Admin page | Move to main page |
| `@dnd-kit/sortable` | ^10.0.0 | Admin page | Lazy load |
| `@dnd-kit/utilities` | ^3.2.2 | Admin page | Lazy load |
| `fuse.js` | ^7.1.0 | Main page | None |
| `zustand` | ^5.0.6 | Both pages | Unify store |
| `sonner` | ^1.7.1 | Both pages | None |
| `prism-react-renderer` | ^2.4.1 | Both pages | None |

> [!NOTE]
> All dependencies are already installed. No new packages required.

---

## Part 3: Potential Issues & Risks

### Risk 1: Keyboard Navigation Conflicts

**Issue:** Main page uses keyboard navigation (Arrow keys for command selection). Edit Mode introduces drag & drop which also responds to keyboard.

**Mitigation:** Disable keyboard navigation when in Edit Mode. DnD already has its own keyboard support.

---

### Risk 2: Performance Impact

**Issue:** Loading DnD libraries increases bundle size on initial load.

**Mitigation:** Use `React.lazy()` and `dynamic()` for Edit Mode components:
```typescript
const SortableCommandItem = dynamic(() => import('@/components/dev-caddy/SortableCommandItem'), { ssr: false })
```

---

### Risk 3: State Synchronization

**Issue:** After editing, the Visual Mode needs to reflect changes immediately.

**Mitigation:** Use the existing `useCommands()` hook's `fetchData()` to refresh after mutations.

---

## Part 4: Files to Delete After Migration

| File | Reason |
|------|--------|
| `app/admin/page.tsx` | Logic moved to main page + components |
| `app/admin/editor/page.tsx` | Converted to `EditorOverlay` component |
| `app/admin/` directory | Route no longer needed |

---

## Appendix: Component Dependency Graph

```
app/page.tsx (Unified)
├── components/dev-caddy/Sidebar.tsx
│   ├── Mode Toggle (NEW)
│   └── Category List
├── components/dev-caddy/Header.tsx
│   └── Search + Controls
├── components/dev-caddy/CommandList.tsx
│   ├── CommandCard (Visual Mode)
│   └── SortableCommandItem (Edit Mode, lazy)
├── components/forms/CategoryFormSheet.tsx (NEW)
├── components/forms/CommandFormSheet.tsx (NEW)
├── components/forms/DeleteConfirmation.tsx (NEW)
└── components/overlays/EditorOverlay.tsx (NEW)
```

---

## Conclusion

The codebase is well-structured for this migration. Key advantages:
1. **Component architecture is already modular**
2. **UI primitives (Sheet, Dialog, Switch) are ready**
3. **Drag & Drop dependencies are installed**
4. **Editor Zen Mode provides a template for overlay behavior**

Primary challenges:
1. **Store unification** (merging `selectedCategory` + `adminSelectedCategory`)
2. **Conditional rendering** (switching between Visual and Edit modes)
3. **Lazy loading** (preserving initial load performance)

**Recommendation:** Proceed with the step-by-step roadmap in `ROADMAP.md`.
