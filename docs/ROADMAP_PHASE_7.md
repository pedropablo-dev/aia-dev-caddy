# Phase 7: Full Control Roadmap

> **Goal:** Enable complete Category and Command management from the main interface, then deprecate `/admin`.  
> **Target Version:** 0.5.0  
> **Estimated Effort:** 5-7 days

---

## 📊 Executive Summary

Phase 7 eliminates the last dependency on the legacy `/admin` route by integrating:
1. **Category CRUD** directly into the Sidebar
2. **Drag & Drop** for both categories and commands
3. **Complete legacy cleanup**

**Current State:**
- ✅ Command CRUD works via main interface
- ❌ Category management requires `/admin`
- ❌ Drag & drop only available in `/admin`
- ❌ `/admin` link still visible in Sidebar

---

## 🔍 Audit Summary

### Components Analyzed

| Component | Lines | Purpose | Notes |
|-----------|-------|---------|-------|
| `Sidebar.tsx` | 298 | Category navigation | Simple button list, no CRUD |
| `CommandList.tsx` | 85 | Command display | Clean, easy to wrap with DnD |
| `SortableCategoryItem.tsx` | 92 | DnD category (admin) | Reusable, uses `@dnd-kit` |
| `SortableCommandItem.tsx` | 99 | DnD command (admin) | Reusable, uses `@dnd-kit` |
| `admin/page.tsx` | 484 | Legacy admin panel | Full CRUD + DnD, to deprecate |

### Key Findings

**1. Sidebar Category List (lines 170-185)**
```tsx
{filteredCategories.map((category) => (
    <button
        key={category.id}
        onClick={() => setSelectedCategory(category.id)}
        className={`w-full flex items-center gap-3 ...`}
    >
        <span>{category.icon}</span>
        <span>{category.name}</span>
    </button>
))}
```
**Problem:** No edit/delete actions, no drag handle, simple button.

**2. CommandList (lines 59-80)**
```tsx
{commands.map((cmd, index) => (
    <div key={cmd.id} ref={...}>
        <CommandCard ... />
    </div>
))}
```
**Problem:** No DnD context, no sortable wrapper.

**3. Existing DnD Infrastructure**
- `@dnd-kit/core` already installed ✅
- `@dnd-kit/sortable` already installed ✅
- Sensor configuration exists in admin ✅
- `SortableCategoryItem` and `SortableCommandItem` exist ✅

---

## 📋 Implementation Plan

### Sprint 1: Category Management (2-3 days)

#### Task 1.1: Category Modal Component
Create `components/dev-caddy/forms/CategoryFormModal.tsx`

**Features:**
- Category name input
- Emoji picker for icon (use existing picker from admin or simple input)
- Create/Edit modes
- Delete confirmation (with cascade warning)

**Recommendation: Modal over Inline Edit**
| Approach | Pros | Cons |
|----------|------|------|
| **Modal (Recommended)** | Consistent with CommandFormModal, clear UX, space for emoji picker | Extra click |
| Inline Edit | Quick for simple renames | Cramped, hard to add emoji picker |
| Context Menu | Space-efficient | Less discoverable |

**Decision:** Use Modal for consistency with existing patterns.

#### Task 1.2: Sidebar CRUD UI
Update `components/dev-caddy/Sidebar.tsx`

**UI Changes:**
```
┌─────────────────────────────────┐
│ 🛠️ broWorks Dev-Caddy          │
│                                 │
│ [🔍 Search categories...]       │
│                                 │
│ Categorías        [+ Add]       │ ← Add button (Edit Mode only)
│ ┌─────────────────────────────┐ │
│ │ ⭐ Favoritos          [⋮]  │ │ ← Context menu on hover
│ │ 🔧 Tools              [⋮]  │ │
│ │ 📁 Projects           [⋮]  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ─────────────────────────────── │
│ [Export] [Import]               │
│ ─────────────────────────────── │
│ [🔓 Edit Mode Toggle]           │
└─────────────────────────────────┘
```

**Three-dot menu options (on hover in Edit Mode):**
- ✏️ Rename
- 🗑️ Delete (with confirmation)

**Implementation:**
1. Add "+" button next to "Categorías" header (visible in Edit Mode)
2. Add hover menu (DropdownMenu) on each category item
3. Wire to CategoryFormModal for create/edit
4. Add delete handler with AlertDialog

#### Task 1.3: Category CRUD Handlers
Update `app/page.tsx`

**New functions:**
```typescript
const handleCreateCategory = () => { ... }
const handleEditCategory = (category: Category) => { ... }
const handleDeleteCategory = (categoryId: string) => { ... }
const handleSaveCategory = (categoryData: Category) => { ... }
```

**Delete logic:**
1. Confirm with AlertDialog
2. Check if category has commands → warn user
3. Remove from `data.categories`
4. Remove from `data.commands[categoryId]`
5. If deleting selected category → switch to 'favorites'

---

### Sprint 2: Drag & Drop for Commands (2 days)

#### Task 2.1: DnD Context in CommandList
Create new component or update `CommandList.tsx`

**Approach Options:**

| Option | Description | Recommendation |
|--------|-------------|----------------|
| **A) Wrap existing CommandList** | Add DndContext around current implementation | ✅ Minimal change |
| B) Create SortableCommandList | New component that replaces CommandList | More code |
| C) Inline in page.tsx | DndContext at page level | Too coupled |

**Decision:** Option A - Wrap current implementation.

**Implementation:**
1. Add `DndContext` and `SortableContext` to CommandList
2. Create `SortableCommandCard.tsx` wrapper
3. Import existing sensor configuration
4. Add `onReorder` prop to CommandList
5. Handle `onDragEnd` to call `saveData` with new order

**Scope:**

| Level | Description | Priority |
|-------|-------------|----------|
| **Level 1** | Reorder within category | P0 - Must have |
| Level 2 | Move between categories | P1 - Nice to have |
| Level 3 | Reorder categories (Sidebar) | P0 - Must have |

**Note:** Level 2 (cross-category moves) is complex and may be deferred to Phase 8.

#### Task 2.2: Drag Handle Integration
Update `CommandCard.tsx`

**Add conditional drag handle:**
```tsx
{isEditMode && (
    <div className="cursor-grab" {...listeners}>
        <GripVertical className="h-4 w-4" />
    </div>
)}
```

**Visual feedback during drag:**
- Reduced opacity (0.5)
- Drop placeholder indicator
- Smooth spring animations

---

### Sprint 3: Category Drag & Drop (1 day)

#### Task 3.1: Sortable Category List
Update `Sidebar.tsx` to use `SortableCategoryItem`

**Changes:**
1. Wrap category list with `DndContext` + `SortableContext`
2. Replace simple button with `SortableCategoryItem` (only in Edit Mode)
3. Add `onReorder` handler that updates `data.categories` order
4. Persist order changes to API

**Conditional rendering:**
- **View Mode:** Current simple buttons (optimized for speed)
- **Edit Mode:** SortableCategoryItem with drag handles

---

### Sprint 4: Legacy Cleanup (1 day)

#### Task 4.1: Remove Admin Link
Update `Sidebar.tsx`

**Remove:**
```tsx
<Link href="/admin" className="w-full">
    <Button variant="ghost">
        <Settings />
        Panel de Administración
    </Button>
</Link>
```

#### Task 4.2: Archive Admin Route
**Do NOT delete immediately.** Instead:
1. Add deprecation warning on `/admin` page
2. Add redirect notice: "This page is deprecated. Use main interface."
3. After 1 version cycle, delete `app/admin/` folder

#### Task 4.3: Clean Up Unused Components
After confirming all functionality works:
- Review if `SortableCommandItem.tsx` is still needed (may be superseded by SortableCommandCard)
- Remove any admin-only components

---

## 🏗️ Library Analysis: Drag & Drop

### Recommendation: Keep `@dnd-kit`

| Library | Bundle Size | Accessibility | Next.js 14 | Status |
|---------|-------------|---------------|------------|--------|
| **@dnd-kit** ✅ | ~15KB | Excellent | Full support | Already installed |
| react-beautiful-dnd | ~32KB | Good | Deprecated | Not recommended |
| react-dnd | ~20KB | Basic | Requires config | Overkill |

**Decision:** Continue using `@dnd-kit` - already installed, well-tested in admin, excellent a11y.

**Existing Configuration (from admin):**
```typescript
const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    })
)
```

---

## 📁 File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `forms/CategoryFormModal.tsx` | Category create/edit modal |
| `SortableCommandCard.tsx` | DnD wrapper for CommandCard |

### Modified Files
| File | Changes |
|------|---------|
| `Sidebar.tsx` | Add CRUD UI, DnD for categories, remove admin link |
| `CommandList.tsx` | Add DnD context and handlers |
| `CommandCard.tsx` | Add drag handle (Edit Mode) |
| `app/page.tsx` | Add category CRUD handlers, DnD state |

### Deprecated Files
| File | Action |
|------|--------|
| `app/admin/page.tsx` | Add deprecation notice, then delete |
| `app/admin/editor/page.tsx` | Already unused (EditorOverlay in main) |

---

## ⚠️ Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| DnD conflicts with click events | Medium | Use activation constraint (8px) |
| Performance with many commands | Low | Already tested with current DnD |
| Accidental category deletion | High | AlertDialog with cascade warning |
| Breaking existing workflow | Medium | Staged rollout with deprecation period |

---

## ✅ Success Criteria

1. **Category CRUD:** User can create, rename, and delete categories from Sidebar
2. **Command Reorder:** User can drag commands to reorder within a category
3. **Category Reorder:** User can drag categories to reorder in Sidebar
4. **Legacy Removal:** `/admin` link removed from Sidebar
5. **No Regression:** All existing functionality continues to work
6. **Persistence:** All changes persist to `commands.json`

---

## 🧪 Verification Plan

### Manual Testing

**Test 1: Category Creation**
1. Enable Edit Mode
2. Click "+" next to "Categorías"
3. Enter name and select emoji
4. Save → New category appears in list
5. Refresh → Category persists

**Test 2: Category Rename**
1. Enable Edit Mode
2. Hover over category → Click "⋮" menu
3. Select "Rename"
4. Change name → Save
5. Category updates in list and persists

**Test 3: Category Delete**
1. Enable Edit Mode
2. Select category with commands
3. Click delete → Confirmation shows command count
4. Confirm → Category and commands removed
5. Refresh → Deletion persists

**Test 4: Command Drag & Drop**
1. Enable Edit Mode
2. Drag command via grip handle
3. Drop in new position
4. Order changes immediately
5. Refresh → New order persists

**Test 5: Category Drag & Drop**
1. Enable Edit Mode
2. Drag category via grip handle
3. Drop in new position
4. Sidebar reorders
5. Refresh → Order persists

---

## 📅 Timeline

| Sprint | Duration | Deliverable |
|--------|----------|-------------|
| Sprint 1 | 2-3 days | Category CRUD in Sidebar |
| Sprint 2 | 2 days | Command Drag & Drop |
| Sprint 3 | 1 day | Category Drag & Drop |
| Sprint 4 | 1 day | Legacy cleanup |
| **Total** | **5-7 days** | **Phase 7 Complete** |

---

## 🎯 Definition of Done

- [ ] All manual tests pass
- [ ] No console errors or warnings
- [ ] Build succeeds (`npm run build`)
- [ ] `/admin` link removed from Sidebar
- [ ] Documentation updated (README, CURRENT_STATE)
- [ ] Version bumped to 0.5.0
- [ ] Commit message: `feat: Phase 7 - Full Control (Category CRUD + DnD)`

---

## 🔮 Phase 8 Preview (Future)

After Phase 7:
1. **Cross-category move:** Drag command from one category to another
2. **Keyboard DnD:** Full keyboard navigation for reordering
3. **Undo/Redo:** Ctrl+Z support for all actions
4. **Database migration:** Move from JSON file to SQLite/PostgreSQL
