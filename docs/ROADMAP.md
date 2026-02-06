# Dev-Caddy Roadmap: Path to Production

> From MVP to 10/10 Production-Grade Application

---

## Current State: v0.3.0 (UX Excellence)

✅ Drag & Drop Reordering  
✅ Fuzzy Search & Keyboard Nav  
✅ Syntax Highlighting  
✅ Component architecture  
⏳ Database migration pending  

---

## Phase 1-5: Foundation → UX Excellence ✅ COMPLETED

See previous sections in version history. All foundational work complete.

---

## 🚀 Phase 6: Single Context Application (NEW)

> **Goal:** Merge Admin View into Main Dashboard with Global Edit Mode toggle.  
> **Reference:** [REF_AUDIT_REPORT.md](REF_AUDIT_REPORT.md)

### Overview

Transform Dev-Caddy from a multi-page app into a seamless single-view experience:
- **Visual Mode:** Click to copy, clean read-only UI
- **Edit Mode:** Drag & Drop, Edit/Delete buttons, inline forms

---

### Step 6.1: Store & State Preparation

**Objective:** Add global `isEditMode` state and unify category selection.

**Files to Modify:**
- `store/appStore.ts`

**Changes:**
```typescript
interface AppState {
  selectedCategory: string              // Unified (replaces adminSelectedCategory)
  isEditMode: boolean                   // NEW
  setSelectedCategory: (id: string) => void
  setEditMode: (value: boolean) => void // NEW
}
```

**Verification:**
- [ ] Import `isEditMode` in any component without errors
- [ ] Toggle persists across page refresh (localStorage)

**Estimated Effort:** 🟢 Low (~30 min)

---

### Step 6.2: Component Extraction — Forms as Sheets

**Objective:** Extract admin forms into reusable Sheet/Dialog components.

**New Files to Create:**

| File | Source | Description |
|------|--------|-------------|
| `components/forms/CategoryFormDialog.tsx` | Lines 380-395 of admin/page.tsx | Add/Edit category modal |
| `components/forms/CommandFormSheet.tsx` | Lines 397-456 of admin/page.tsx | Add/Edit command side panel |
| `components/forms/DeleteConfirmation.tsx` | Lines 458-480 of admin/page.tsx | Reusable delete alert |

**Props Interface:**
```typescript
// CategoryFormDialog.tsx
interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCategory?: Category | null
  onSave: (name: string, icon: string) => void
}

// CommandFormSheet.tsx
interface CommandFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  editingCommand?: Command | null
  onSave: (command: Partial<Command>) => void
}
```

**Verification:**
- [ ] Forms render correctly when opened
- [ ] Edit mode populates existing data
- [ ] Save triggers callback and closes form
- [ ] No TypeScript errors

**Estimated Effort:** 🟡 Medium (~2 hours)

---

### Step 6.3: Editor Migration — EditorOverlay Component

**Objective:** Convert the Prompt Editor page into a full-screen overlay that opens on top of the dashboard.

**Files:**
- `app/admin/editor/page.tsx` → `components/overlays/EditorOverlay.tsx`

**Key Changes:**
1. Remove router navigation logic
2. Accept `commandId`, `categoryId`, `onClose` as props
3. Render as fixed full-screen overlay (z-50)
4. Preserve existing Zen Mode functionality
5. Call `onClose()` instead of `router.push('/admin')`

**Component Signature:**
```typescript
interface EditorOverlayProps {
  commandId?: string | null
  categoryId: string
  onClose: () => void
  onSave: (data: AppData) => void
}
```

**Verification:**
- [ ] Overlay covers entire screen with backdrop
- [ ] ESC key closes overlay
- [ ] Save updates data and closes overlay
- [ ] Scroll position of main dashboard preserved
- [ ] All formatting buttons work

**Estimated Effort:** 🟡 Medium (~2 hours)

---

### Step 6.4: Sidebar Enhancement — Mode Toggle

**Objective:** Add Visual/Edit Mode toggle switch to the Sidebar header.

**File to Modify:**
- `components/dev-caddy/Sidebar.tsx`

**Changes:**
1. Import `Switch` from `@/components/ui/switch`
2. Import `useAppStore` to access `isEditMode`
3. Add toggle UI below logo/title area

**UI Example:**
```tsx
<div className="flex items-center justify-between">
  <span className="text-sm text-gray-400">
    {isEditMode ? "Edit Mode" : "Visual Mode"}
  </span>
  <Switch checked={isEditMode} onCheckedChange={setEditMode} />
</div>
```

**Verification:**
- [ ] Toggle is visible and interactive
- [ ] State changes reflect immediately
- [ ] Persists across page refresh

**Estimated Effort:** 🟢 Low (~30 min)

---

### Step 6.5: CommandCard Enhancement — Conditional Edit UI

**Objective:** Show Edit/Delete buttons on CommandCard when in Edit Mode.

**File to Modify:**
- `components/dev-caddy/CommandCard.tsx`

**Changes:**
1. Accept `isEditMode` prop
2. Accept `onEdit`, `onDelete` callbacks
3. Conditionally render action buttons in header
4. Change click behavior:
   - Visual Mode: Copy command
   - Edit Mode: Open edit form

**Verification:**
- [ ] Buttons hidden in Visual Mode
- [ ] Buttons visible in Edit Mode
- [ ] Click to copy works in Visual Mode
- [ ] Click to edit works in Edit Mode

**Estimated Effort:** 🟢 Low (~1 hour)

---

### Step 6.6: Page Unification — Integrate All Components

**Objective:** Merge admin logic into `app/page.tsx` with lazy loading.

**Files to Modify:**
- `app/page.tsx`

**Integration Steps:**

1. **Import stores and new components:**
```typescript
import { useAppStore } from "@/store/appStore"
import dynamic from 'next/dynamic'

// Lazy load Edit Mode components
const CategoryFormDialog = dynamic(() => import('@/components/forms/CategoryFormDialog'))
const CommandFormSheet = dynamic(() => import('@/components/forms/CommandFormSheet'))
const EditorOverlay = dynamic(() => import('@/components/overlays/EditorOverlay'))
const DndContext = dynamic(() => import('@dnd-kit/core').then(m => m.DndContext), { ssr: false })
```

2. **Add Edit Mode state handlers:**
```typescript
const { isEditMode, selectedCategory, setSelectedCategory } = useAppStore()
const [editingCommand, setEditingCommand] = useState<Command | null>(null)
const [editorOpen, setEditorOpen] = useState(false)
```

3. **Conditional rendering:**
```tsx
{isEditMode ? (
  <DndContext ...>
    <SortableContext ...>
      {commands.map(cmd => <SortableCommandItem ... />)}
    </SortableContext>
  </DndContext>
) : (
  <CommandList ... />
)}
```

4. **Render overlays at root level:**
```tsx
{editorOpen && (
  <EditorOverlay
    commandId={editingCommand?.id}
    categoryId={selectedCategory}
    onClose={() => setEditorOpen(false)}
    onSave={handleSave}
  />
)}
```

**Verification:**
- [ ] Page loads without errors
- [ ] Visual Mode works exactly as before
- [ ] Edit Mode shows DnD + action buttons
- [ ] Forms open and save correctly
- [ ] Editor overlay opens for prompts
- [ ] Initial load performance unchanged (lazy loading works)

**Estimated Effort:** 🔴 High (~4 hours)

---

### Step 6.7: Cleanup — Remove Old Admin Routes

**Objective:** Delete deprecated admin pages after successful integration.

**Files to Delete:**
- `app/admin/page.tsx`
- `app/admin/editor/page.tsx`
- `app/admin/` directory

**Changes to Other Files:**
- Remove "Panel de Administración" link from `Sidebar.tsx`
- Update any references to `/admin` route

**Verification:**
- [ ] No broken imports
- [ ] No 404 errors
- [ ] Build succeeds: `npm run build`

**Estimated Effort:** 🟢 Low (~30 min)

---

## Phase 6 Summary

| Step | Description | Effort | Dependencies |
|------|-------------|--------|--------------|
| 6.1 | Store & State Preparation | 🟢 Low | None |
| 6.2 | Component Extraction (Forms) | 🟡 Medium | 6.1 |
| 6.3 | Editor Migration (Overlay) | 🟡 Medium | 6.1 |
| 6.4 | Sidebar Enhancement (Toggle) | 🟢 Low | 6.1 |
| 6.5 | CommandCard Enhancement | 🟢 Low | 6.1 |
| 6.6 | Page Unification | 🔴 High | 6.2, 6.3, 6.4, 6.5 |
| 6.7 | Cleanup | 🟢 Low | 6.6 |

**Total Estimated Effort:** ~10 hours

---

## Version Milestones (Updated)

| Version | Features | Status |
|---------|----------|--------|
| **v0.1.0** | MVP - Core functionality | ✅ Complete |
| **v0.2.0** | Refactor - Architecture | ✅ Complete |
| **v0.3.0** | UX Excellence | ✅ Complete |
| **v0.4.0** | Single Context App | 📋 In Progress |
| **v0.5.0** | Database migration | 📋 Planned |
| **v1.0.0** | Production-ready | 📋 Planned |

---

## Success Criteria for v0.4.0

- [ ] Single page serves both viewing and editing
- [ ] Mode toggle in sidebar
- [ ] No full-page navigations for CRUD operations
- [ ] Editor opens as overlay, not new route
- [ ] Lazy loading for Edit Mode components
- [ ] Admin routes deleted
- [ ] All existing functionality preserved

---

## Previous Phases (Archived)

<details>
<summary>Phase 1: Foundation Hardening ✅</summary>

### Step 1.1: Implement Zod Validation ✅
- Created `lib/schemas.ts` with full AppData schema
- API route validates all incoming data
- Returns 400 with detailed errors on validation failure

### Step 1.2: Centralize Type Definitions ✅
- Created `types/index.ts` as single source of truth
- All components import from `@/types`

### Step 1.3: Replace alert() with toast() ✅
- Replaced all `alert()` with `sonner` toasts
- Added `<Toaster richColors />` to pages

</details>

<details>
<summary>Phase 2: Component Atomic Design ✅</summary>

### Step 2.1: Extract Shared Components ✅
Created 6 atomic components in `components/dev-caddy/`:
- `Sidebar.tsx` (190 lines)
- `Header.tsx` (24 lines)
- `CommandList.tsx` (48 lines)
- `CommandCard.tsx` (205 lines)
- `skeletons.tsx` (80 lines)
- `backup-controls.tsx` (108 lines)

### Step 2.2: Create Custom Hooks ✅
Created `hooks/use-commands.ts` (133 lines)

**Impact:** `app/page.tsx` reduced from 483 → 160 lines (-67%)

</details>

<details>
<summary>Phase 3: Data Layer Migration ⏳</summary>

### Option A: SQLite with Turso (Recommended)
### Option B: Supabase
### Option C: JSON in Cloud Storage

> Deferred until serverless deployment is required.

</details>

<details>
<summary>Phase 4: Error Handling & UX Polish ✅</summary>

- Global Error Boundary
- Loading States
- Data Backup

</details>

<details>
<summary>Phase 5: UX Excellence ✅</summary>

- Keyboard-first navigation
- Drag & Drop reordering
- Fuzzy search
- Syntax highlighting
- Micro-interactions

</details>
