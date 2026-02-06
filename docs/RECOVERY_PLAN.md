# Recovery Plan: Step 6.6 Page Unification

> **Status:** Ready for Execution  
> **Previous Attempt:** Failed (Creation Error due to missing ID generation)  
> **Constraint:** Sidebar MUST remain untouched

---

## Executive Summary

This plan outlines how to safely integrate Admin components (`CommandFormSheet`, `EditorOverlay`) into `app/page.tsx` while preserving data integrity and the existing Sidebar-based navigation.

---

## Root Cause Analysis

### Why the Previous Attempt Failed

```typescript
// BROKEN CODE (Previous Attempt)
const handleSave = (updatedCommand: Command) => {
  // ...
  newData.commands[categoryId].push(updatedCommand)  // ❌ No ID generation!
}
```

**Problem:** When creating a new command, the `updatedCommand` object from the form may not have an `id` property, or it might have an empty/undefined ID. The API validation likely rejected this, causing the creation error.

---

## Implementation Plan

### Phase 1: Add State & Imports (~15 lines)

**Location:** `app/page.tsx` (lines 1-25)

**Changes Required:**

```typescript
// NEW IMPORTS
import dynamic from "next/dynamic"
import { toast } from "sonner"
import type { AppData } from "@/types"  // Add AppData
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// LAZY LOAD ADMIN COMPONENTS
const CommandFormSheet = dynamic(
  () => import("@/components/dev-caddy/forms/CommandFormSheet")
       .then(mod => ({ default: mod.CommandFormSheet })),
  { ssr: false, loading: () => null }
)

const EditorOverlay = dynamic(
  () => import("@/components/dev-caddy/editor/EditorOverlay")
       .then(mod => ({ default: mod.EditorOverlay })),
  { ssr: false, loading: () => null }
)

// EXTRACT saveData FROM HOOK
const { data, isLoading, hasMounted, saveData, toggleFavorite } = useCommands()

// ADD isEditMode FROM STORE
const { selectedCategory, isEditMode } = useAppStore()

// NEW STATE FOR EDIT FLOWS
const [activeCommand, setActiveCommand] = useState<Command | null>(null)
const [isSheetOpen, setIsSheetOpen] = useState(false)
const [isEditorOpen, setIsEditorOpen] = useState(false)
const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
```

---

### Phase 2: Implement CRUD Handlers (~70 lines)

**Location:** After `handleVariableChange` (around line 120)

#### 2.1 `handleCreate` Handler

```typescript
const handleCreate = () => {
  setActiveCommand(null)
  setSheetMode('create')
  setIsSheetOpen(true)
}
```

#### 2.2 `handleEdit` Handler

```typescript
const handleEdit = (command: Command) => {
  setActiveCommand(command)
  if (command.type === 'prompt') {
    setIsEditorOpen(true)
  } else {
    setSheetMode('edit')
    setIsSheetOpen(true)
  }
}
```

#### 2.3 `handleDelete` Handler

```typescript
const handleDelete = (commandId: string) => {
  if (!window.confirm('¿Estás seguro de que quieres eliminar este comando?')) {
    return
  }

  // Deep clone to avoid mutation
  const newData: AppData = JSON.parse(JSON.stringify(data))
  
  for (const categoryId in newData.commands) {
    const idx = newData.commands[categoryId].findIndex(cmd => cmd.id === commandId)
    if (idx !== -1) {
      newData.commands[categoryId].splice(idx, 1)
      saveData(newData)
      toast.success('Comando eliminado correctamente')
      return
    }
  }
}
```

#### 2.4 `handleSave` Handler (CRITICAL FIX)

```typescript
/**
 * generateUniqueId - Creates a collision-resistant ID
 */
const generateUniqueId = () => {
  return `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * findCommandCategoryId - Finds which category contains a command by ID
 */
const findCommandCategoryId = (commandId: string, data: AppData): string | null => {
  for (const categoryId in data.commands) {
    if (data.commands[categoryId].some(cmd => cmd.id === commandId)) {
      return categoryId
    }
  }
  return null
}

const handleSave = (updatedCommand: Command) => {
  // Step 1: Deep clone to ensure immutability
  const newData: AppData = JSON.parse(JSON.stringify(data))
  
  // Step 2: Determine target category
  const targetCategoryId = selectedCategory === 'favorites' 
    ? Object.keys(newData.commands)[0]  // Default to first category
    : selectedCategory
    
  if (!targetCategoryId || !newData.commands[targetCategoryId]) {
    toast.error('Categoría no válida')
    return
  }

  // Step 3: Determine if UPDATE or CREATE
  const isUpdate = activeCommand !== null && activeCommand.id === updatedCommand.id
  
  if (isUpdate) {
    // CASE A: Update existing command
    const existingCategoryId = findCommandCategoryId(updatedCommand.id, newData)
    
    if (existingCategoryId) {
      const idx = newData.commands[existingCategoryId].findIndex(c => c.id === updatedCommand.id)
      if (idx !== -1) {
        newData.commands[existingCategoryId][idx] = updatedCommand
      }
    }
  } else {
    // CASE B: Create new command
    const newCommand: Command = {
      ...updatedCommand,
      id: updatedCommand.id || generateUniqueId(),  // ✅ ENSURE ID EXISTS
      order: newData.commands[targetCategoryId].length,  // ✅ Set order
    }
    newData.commands[targetCategoryId].push(newCommand)
  }

  // Step 4: Save and cleanup
  saveData(newData)
  toast.success(isUpdate ? 'Comando actualizado' : 'Comando creado')
  
  setIsSheetOpen(false)
  setIsEditorOpen(false)
  setActiveCommand(null)
}
```

---

### Phase 3: Wire CommandList Props (~5 lines)

**Location:** `<CommandList />` component (around line 196)

```diff
  <CommandList
    commands={filteredCommands}
    selectedIndex={selectedIndex}
    searchQuery={searchQuery}
    onClearSearch={() => setSearchQuery("")}
    copiedCommand={copiedCommand}
    variableValues={variableValues}
    workflowStep={workflowStep}
    onCopyCommand={handleCopyCommand}
    onWorkflowStep={handleWorkflowStep}
    onToggleFavorite={toggleFavorite}
    onVariableChange={handleVariableChange}
+   onEdit={handleEdit}
+   onDelete={handleDelete}
  />
```

> **Note:** `CommandList.tsx` and `CommandCard.tsx` already have the props defined from Step 6.5.

---

### Phase 4: Render Admin Components (~40 lines)

**Location:** After `</div>` closing the central panel, before final `</>` 

```tsx
{/* Edit Mode: Floating Action Button */}
{isEditMode && (
  <Button
    onClick={handleCreate}
    size="lg"
    className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40"
    title="Crear nuevo comando"
  >
    <Plus className="h-6 w-6" />
  </Button>
)}

{/* Edit Mode: Admin Components (Lazy Loaded) */}
{isEditMode && (
  <>
    <CommandFormSheet
      isOpen={isSheetOpen}
      onClose={() => {
        setIsSheetOpen(false)
        setActiveCommand(null)
      }}
      mode={sheetMode}
      initialData={activeCommand}
      onSave={handleSave}
      categoryId={selectedCategory === 'favorites' ? Object.keys(data.commands)[0] : selectedCategory}
    />
    <EditorOverlay
      isOpen={isEditorOpen}
      onClose={() => {
        setIsEditorOpen(false)
        setActiveCommand(null)
      }}
      initialData={activeCommand || undefined}
      onSave={handleSave}
      categoryId={selectedCategory === 'favorites' ? Object.keys(data.commands)[0] : selectedCategory}
    />
  </>
)}
```

---

## Verification Checklist

After implementation, verify:

- [ ] `npm run build` succeeds without errors
- [ ] Toggle Edit Mode → FAB appears (bottom-right)
- [ ] Click FAB → CommandFormSheet opens (Create mode)
- [ ] Fill form → Save → No error, command appears in list
- [ ] Click Edit button on Command → Sheet opens with data
- [ ] Click Edit on Prompt → EditorOverlay opens
- [ ] Click Delete → Confirmation → Command removed
- [ ] New commands have unique IDs (check `commands.json`)
- [ ] Sidebar remains functional

---

## File Summary

| File | Action | Lines Changed (~) |
|------|--------|-------------------|
| `app/page.tsx` | Modify | +130 |
| `components/dev-caddy/CommandList.tsx` | Restore | +4 (re-add props) |

---

## Risk Mitigation

1. **ID Collision Prevention:** Using `Date.now()` + random string ensures uniqueness
2. **Deep Clone:** `JSON.parse(JSON.stringify())` prevents mutation bugs
3. **Category Fallback:** Defaulting to first category prevents undefined errors
4. **Lazy Loading:** Admin components don't impact initial bundle size
5. **Conditional Rendering:** Components only mount when `isEditMode` is true

---

## Execution Order

1. Update imports and add lazy-loaded components
2. Add new state variables
3. Add helper functions (`generateUniqueId`, `findCommandCategoryId`)
4. Add CRUD handlers in order: `handleCreate`, `handleEdit`, `handleDelete`, `handleSave`
5. Update `<CommandList />` props
6. Add FAB and admin components JSX
7. Verify build
8. Test all CRUD operations

---

*Document Created: 2026-02-06*  
*Status: Pending Execution*
