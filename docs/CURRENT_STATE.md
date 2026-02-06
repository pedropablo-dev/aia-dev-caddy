# Dev-Caddy: Current Technical State

> Last updated: February 6, 2026  
> Version: 0.4.0 (Unified + Data Security)

---

## 📋 Executive Summary

Dev-Caddy has successfully completed its **Unification Phase**. The application now features a single-page interface that consolidates all command management capabilities, introducing data backup/restore, Edit Mode persistence, and improved UX patterns.

**Key Accomplishments:**
- ✅ Unified interface (no more context switching between main/admin)
- ✅ Dual creation modes (Modal for commands, Zen Mode for prompts)
- ✅ Data security (Import/Export JSON backups)
- ✅ Edit Mode persistence (localStorage)
- ✅ Command duplication feature
- ✅ Text truncation for better list view

---

## 🏗️ Architecture

### Core Components

#### **Main Orchestrator: `app/page.tsx`**
The central controller managing all user interactions.

**Responsibilities:**
- Renders `Sidebar`, `Header`, `CommandList`
- Controls modal/overlay visibility (`isFormOpen`, `isEditorOpen`)
- Handles CRUD operations via `handleSave`, `handleEdit`, `handleDelete`, `handleDuplicate`
- Manages keyboard shortcuts and navigation
- Integrates FAB dropdown for creation flows

**State Management:**
- `useCommands()` hook for data fetching/saving
- `useAppStore()` for Edit Mode and category selection (persisted)
- `useUIStore()` for sidebar collapse state
- Local state for modals, search, variables, workflow steps

---

#### **Data Layer: `hooks/use-commands.ts`**
Custom hook managing all data operations.

**Exports:**
- `data`: Current `AppData` (categories + commands)
- `isLoading`: Loading state
- `hasMounted`: Hydration safety flag
- `fetchData`: Manual data fetch
- `saveData(newData, shouldUpdate)`: Saves to API and optionally updates state
- `toggleFavorite(commandId)`: Toggles favorite status
- `importData(newData)`: Specialized import handler
- `refreshCommands()`: Force data refresh from API

**Flow:**
1. Initial mount → `fetchData()` calls `/api/commands` (GET)
2. User edits → `saveData(newData)` calls `/api/commands` (POST) + updates state
3. User imports → `importData()` + `refreshCommands()` ensures UI updates

---

#### **Display: `components/dev-caddy/CommandList.tsx`**
Renders the filtered list of commands.

**Features:**
- Empty state when no results
- Scroll-to-selected behavior
- Passes props down to `CommandCard`

---

#### **Card: `components/dev-caddy/CommandCard.tsx`**
Individual command display with action buttons.

**Features:**
- Syntax highlighting (Prism React Renderer)
- Text truncation (`line-clamp-3`)
- Edit Mode: reveals Edit, Duplicate, Delete buttons
- View Mode: shows Copy and Favorite toggle
- Supports commands, workflows, and prompts

---

#### **Creation Forms**

**1. `components/dev-caddy/forms/CommandFormModal.tsx`**
- Dialog-based form for standard commands
- Supports simple, workflow, and variable types
- Form validation via `react-hook-form` + Zod
- Centered modal experience

**2. `components/dev-caddy/forms/EditorOverlay.tsx`**
- Full-screen editor for AI prompts
- Markdown toolbar
- Live preview
- Specialized for long-form content

---

#### **Navigation: `components/dev-caddy/Sidebar.tsx`**
Left sidebar with categories and controls.

**Features:**
- Category list with fuzzy search
- Link to `/admin` (legacy)
- **Import/Export buttons** (visible only in Edit Mode)
- **Edit Mode toggle** (persisted to localStorage)
- Help dialog

---

### State Management

#### **Zustand Stores**

**`store/appStore.ts`:**
```typescript
interface AppState {
  selectedCategory: string       // Current active category
  isEditMode: boolean            // Edit Mode toggle (PERSISTED)
  setSelectedCategory: (id) => void
  toggleEditMode: () => void
}
```
- Uses `persist` middleware with localStorage
- Key: `dev-caddy-app-state`
- **Both fields persisted** (previously only selectedCategory)

**`store/uiStore.ts`:**
```typescript
interface UIState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}
```

---

### API Layer

**`app/api/commands/route.ts`**
RESTful endpoint for data operations.

**GET `/api/commands`:**
- Reads `app/data/commands.json`
- Returns `AppData` structure
- Validates with Zod schema

**POST `/api/commands`:**
- Accepts `AppData` in body
- Validates with Zod
- Writes to `app/data/commands.json`
- Returns 200 on success, 400 on validation error

**Data Structure:**
```typescript
interface AppData {
  categories: Category[]
  commands: Record<string, Command[]>  // Key = categoryId
}

interface Category {
  id: string
  name: string
  icon: string
  order: number
}

interface Command {
  id: string
  label: string
  command: string
  type: 'command' | 'workflow' | 'prompt'
  isFavorite: boolean
  order: number
  variables?: Variable[]
  steps?: string[]
}
```

---

## 🔄 Key User Flows

### **Creating a Command**
1. User toggles Edit Mode ON
2. FAB dropdown appears
3. Click "Nuevo Comando" → `CommandFormModal` opens
4. Fill form → Submit
5. `onFormSubmit` transforms data → `handleSave` called
6. `saveData` writes to API
7. State updates → UI reflects new command

### **Creating a Prompt**
1. Edit Mode ON
2. Click "Nuevo Prompt" from FAB
3. `EditorOverlay` opens full-screen
4. Type prompt in Zen Mode editor
5. Save → `handleSave` called
6. Data persists → Overlay closes

### **Duplicating a Command**
1. Edit Mode ON
2. Hover command card → Duplicate button appears (green)
3. Click → `handleDuplicate` called
4. New command created with:
   - New unique ID (`Date.now() + Math.random()`)
   - Label appended with "(Copia)"
   - Same category as original
5. Toast: "Comando duplicado correctamente"

### **Importing Backup**
1. Edit Mode ON
2. Click "Importar" in Sidebar
3. Select `.json` file
4. `handleImport` validates schema
5. **If valid:**
   - `await importData(parsedData)` → writes to API + updates state
   - `await refreshCommands()` → re-fetches data to ensure UI sync
   - Toast: "Backup restaurado correctamente"
6. **If invalid:** Toast error

---

## ⚠️ Known Issues & Technical Debt

### **1. Import UI Refresh**
**Status:** ✅ FIXED (v0.4.0)  
**Previous Issue:** Importing JSON didn't update UI without manual refresh  
**Solution:** Added explicit `refreshCommands()` call after `importData()`

**Current Flow:**
```typescript
await importData(parsedData);     // Save to API + setData
await refreshCommands();           // Force re-fetch from API
```

### **2. Admin Panel Duplication**
**Status:** 🔶 ACCEPTED (for now)  
**Issue:** `/admin` page still exists with overlapping functionality  
**Reason:** Provides superior drag-and-drop experience for category management  
**Plan:** Integrate category DnD into main page in Phase 7

### **3. Component Size**
**Status:** 🔶 NEEDS REFACTOR  
**Issue:** `app/page.tsx` is 437 lines (too large)  
**Recommendation:** Extract into smaller hooks:
- `useCommandNavigation()` for keyboard shortcuts
- `useCommandCRUD()` for save/edit/delete handlers
- `useCommandCreation()` for modal/overlay state

### **4. Missing Tests**
**Status:** ❌ CRITICAL  
**Coverage:** 0%  
**Priority:** High  
**Recommendation:** Start with critical hooks (`use-commands.ts`) and components (`CommandCard.tsx`)

### **5. Hydration Safety**
**Status:** ✅ HANDLED  
**Implementation:** `hasMounted` flag prevents SSR mismatches  
**Zustand persist:** Uses `createJSONStorage(() => localStorage)` for client-only access

---

## 📊 Performance Characteristics

| Metric | Current | Notes |
|--------|---------|-------|
| Initial load | ~1.8s | Next.js dev mode |
| Command list render | <100ms | Even with 100+ commands |
| Search responsiveness | Instant | Fuse.js fuzzy matching |
| Import operation | ~200ms | Depends on JSON size |
| Export operation | Instant | Blob creation + download |

---

## 🔒 Data Persistence

**Storage Location:** `app/data/commands.json`  
**Format:** JSON with pretty-print (2-space indent)  
**Backup:** Manual export via Sidebar  
**Validation:** Zod schemas on API endpoints  
**Concurrency:** None (single-user, file-based)

**Backup Filename Format:**
```
dev-caddy-backup-YYYY-MM-DD.json
Example: dev-caddy-backup-2026-02-06.json
```

---

## 🚧 Phase 7 Preview: Full Integration

**Goals:**
1. Integrate category management into main page
2. Implement category drag-and-drop in Sidebar
3. Deprecate `/admin` completely
4. Add category creation modal
5. Unify all CRUD operations in single interface

**Estimated Effort:** 2-3 days

---

## 📝 Development Notes

### **Adding a New Command Type**
1. Update `types.ts` with new type
2. Extend `CommandFormModal` to support it
3. Add rendering logic in `CommandCard`
4. Update Zod schemas in `api/commands/route.ts`

### **Modifying Data Structure**
**⚠️ Breaking Change Process:**
1. Update `types.ts`
2. Update API validation schemas
3. Create migration script for `commands.json`
4. Update all components reading the structure
5. Test import/export with old and new formats

### **Common Pitfalls**
- **Don't call `saveData` directly in Sidebar:** Use `importData` for imports (includes toast)
- **Always generate unique IDs:** Use `Date.now() + Math.random().toString(36)` pattern
- **Remember `shouldUpdate` parameter:** `saveData(data, true)` for UI updates
- **Handle async in FileReader:** Use `async` for `reader.onload` when calling async functions

---

## 🎯 Conclusion

Dev-Caddy v0.4.0 represents a mature, unified interface with robust data management capabilities. The architecture is modular, the state management is clear, and the user experience is polished.

**Next milestone:** Phase 7 - Full integration and /admin deprecation.
