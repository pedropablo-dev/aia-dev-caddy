"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import Fuse from "fuse.js"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Command, Category, AppData } from "@/types"
import { Sidebar } from "@/components/dev-caddy/Sidebar"
import { Header } from "@/components/dev-caddy/Header"
import { CommandList } from "@/components/dev-caddy/CommandList"
import { DashboardSkeleton } from "@/components/dev-caddy/skeletons"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Terminal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/store/appStore"
import { useCommands } from "@/hooks/use-commands"

// Lazy load admin components
const CommandFormModal = dynamic(
  () => import("@/components/dev-caddy/forms/CommandFormModal").then(mod => ({ default: mod.CommandFormModal })),
  { ssr: false, loading: () => null }
)

const EditorOverlay = dynamic(
  () => import("@/components/dev-caddy/editor/EditorOverlay").then(mod => ({ default: mod.EditorOverlay })),
  { ssr: false, loading: () => null }
)

const CategoryFormModal = dynamic(
  () => import("@/components/dev-caddy/forms/CategoryFormModal").then(mod => ({ default: mod.CategoryFormModal })),
  { ssr: false, loading: () => null }
)

export default function BroworksLaunchpad() {
  // --- Custom Hook for Data Logic ---
  // --- Custom Hook for Data Logic ---
  const { data, isLoading, hasMounted, saveData, toggleFavorite, importData, incrementUsage, resetUsage } = useCommands()

  // --- UI State ---
  const { selectedCategory, isEditMode, setSelectedCategory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
  const [favoritesSort, setFavoritesSort] = useState<'usage' | 'category' | 'alpha'>('category')
  const [helpContent, setHelpContent] = useState("")

  // --- Initialize Sort Preference from LocalStorage ---
  useEffect(() => {
    const savedSort = localStorage.getItem('dev-caddy-sort') as 'usage' | 'category' | 'alpha' | null
    if (savedSort && ['usage', 'category', 'alpha'].includes(savedSort)) {
      setFavoritesSort(savedSort)
    }
  }, [])

  // --- Persist Sort Preference ---
  const handleSortChange = (sort: 'usage' | 'category' | 'alpha') => {
    setFavoritesSort(sort)
    localStorage.setItem('dev-caddy-sort', sort)
  }

  // --- Edit Mode State ---
  const [activeCommand, setActiveCommand] = useState<Command | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  // --- Category Modal State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // --- Delete Dialog State ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commandToDelete, setCommandToDelete] = useState<string | null>(null)

  // --- Lógica de Ayuda ---
  useEffect(() => {
    const loadHelpContent = async () => {
      try {
        const response = await fetch("/help.md")
        if (response.ok) {
          const text = await response.text()
          setHelpContent(text)
        }
      } catch (err) {
        console.error("Error loading help content:", err)
      }
    }
    loadHelpContent()
  }, [])

  // --- Categorías y Comandos Filtrados ---
  const sortedCategories = useMemo(() => {
    const favCategory: Category = {
      id: 'favorites',
      name: 'Favoritos',
      icon: '⭐',
      order: -1
    }
    const regularCategories = [...data.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    return [favCategory, ...regularCategories]
  }, [data.categories])

  // --- All Commands (flattened for fuzzy search) ---
  const allCommands = useMemo(() => {
    return Object.entries(data.commands).flatMap(([categoryId, commands]) => {
      const category = data.categories.find((cat) => cat.id === categoryId);
      return commands.map((cmd) => ({
        ...cmd,
        categoryId, // Inject category ID for navigation
        categoryName: category?.name || 'Unknown',
      }));
    });
  }, [data.commands, data.categories])

  // --- Fuse.js Instance (memoized) ---
  const fuse = useMemo(() => {
    return new Fuse(allCommands, {
      keys: ['label', 'command', 'type'],
      threshold: 0.3,
      ignoreLocation: true,
    })
  }, [allCommands])

  // --- Filtered Commands ---
  const filteredCommands = useMemo(() => {
    // If search is active, use Fuse.js to search globally
    if (searchQuery) {
      const results = fuse.search(searchQuery)
      return results.map(result => result.item)
    }

    // Otherwise, filter by category
    let commandsToShow: Command[]

    if (selectedCategory === 'favorites') {
      commandsToShow = [...allCommands] // CRITICAL: Create copy before sorting
        .filter((cmd) => cmd.isFavorite)
        .sort((a, b) => {
          if (favoritesSort === 'usage') {
            // Primary: copyCount descending (most used first)
            const countDiff = (b.copyCount || 0) - (a.copyCount || 0);
            if (countDiff !== 0) return countDiff;
            // Secondary: order ascending
            return (a.order ?? 0) - (b.order ?? 0);
          } else if (favoritesSort === 'alpha') {
            return a.label.localeCompare(b.label);
          } else {
            // Category sort (default)
            // Primary: Category Name
            const catCompare = (a.categoryName || '').localeCompare(b.categoryName || '');
            if (catCompare !== 0) return catCompare;
            // Secondary: Order within category
            return (a.order ?? 0) - (b.order ?? 0);
          }
        })
    } else {
      commandsToShow = [...(data.commands[selectedCategory] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    return commandsToShow
  }, [selectedCategory, data.commands, searchQuery, fuse, allCommands, favoritesSort]) // Added favoritesSort dependency explicitly

  // --- Reset selectedIndex when search or category changes ---
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery, selectedCategory])

  // --- Lógica de Interacción con Comandos ---
  const handleCopyCommand = (commandId: string, baseCommand: string, variables?: any[]) => {
    let finalCommand = baseCommand
    if (variables) {
      variables.forEach((variable) => {
        const varName = typeof variable === 'string' ? variable : variable.name
        const value = variableValues[`${commandId}_${varName}`] || ""
        finalCommand = finalCommand.replace(`{${varName}}`, value)
      })
    }
    navigator.clipboard.writeText(finalCommand)
    setCopiedCommand(commandId)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const handleWorkflowStep = (commandId: string, steps: string[]) => {
    const currentStep = workflowStep[commandId] || 0
    const nextStep = (currentStep + 1) % steps.length
    handleCopyCommand(commandId + "_step_" + currentStep, steps[currentStep])
    setWorkflowStep((prev) => ({ ...prev, [commandId]: nextStep }))
  }

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }))
  }

  // --- Helper Functions ---
  const generateUniqueId = () => {
    return `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  const findCommandCategoryId = (commandId: string, data: AppData): string | null => {
    for (const categoryId in data.commands) {
      if (data.commands[categoryId].some(cmd => cmd.id === commandId)) {
        return categoryId
      }
    }
    return null
  }

  // --- CRUD Handlers for Edit Mode ---
  const handleCreate = () => {
    setActiveCommand(null)
    setIsFormOpen(true)
  }

  const handleCreatePrompt = () => {
    // Set skeleton prompt object so EditorOverlay knows it's a new prompt
    setActiveCommand({
      id: '',
      label: '',
      command: '',
      type: 'prompt',
      isFavorite: false,
      order: 0,
    })
    setIsEditorOpen(true)
  }

  const handleEdit = (command: Command) => {
    setActiveCommand(command)
    if (command.type === 'prompt') {
      setIsEditorOpen(true)
    } else {
      setIsFormOpen(true)
    }
  }

  const handleDelete = (commandId: string) => {
    setCommandToDelete(commandId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!commandToDelete) return

    // Deep clone to avoid mutation
    const newData: AppData = JSON.parse(JSON.stringify(data))

    for (const categoryId in newData.commands) {
      const idx = newData.commands[categoryId].findIndex(cmd => cmd.id === commandToDelete)
      if (idx !== -1) {
        newData.commands[categoryId].splice(idx, 1)
        saveData(newData)
        toast.success('Comando eliminado correctamente')
        setDeleteDialogOpen(false)
        setCommandToDelete(null)
        return
      }
    }

    setDeleteDialogOpen(false)
    setCommandToDelete(null)
  }

  const handleDuplicate = (command: Command) => {
    // Deep clone the command
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // Find which category the command belongs to
    const categoryId = findCommandCategoryId(command.id, newData)

    if (!categoryId) {
      toast.error('No se pudo encontrar la categoría del comando')
      return
    }

    // Create duplicate with new ID and modified label
    const duplicatedCommand: Command = {
      ...command,
      id: generateUniqueId(),  // Generate new unique ID
      label: `${command.label} (Copia)`,  // Append (Copia) to label
      order: newData.commands[categoryId].length,  // Set order to end of list
    }

    // Add to same category
    newData.commands[categoryId].push(duplicatedCommand)

    // Save and notify
    saveData(newData)
    toast.success('Comando duplicado correctamente')
  }

  const handleSave = (updatedCommand: Command) => {
    // Step 1: Deep clone to ensure immutability
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // Step 2: Determine target category
    const categoryId = selectedCategory === 'favorites' ? 'all' : selectedCategory

    // Step 3: Check if updating or creating
    // If ID is present and NOT empty string, try to update
    if (activeCommand && activeCommand.id) {
      // Update existing command across all categories
      for (const catId in newData.commands) {
        const idx = newData.commands[catId].findIndex(cmd => cmd.id === activeCommand.id)
        if (idx !== -1) {
          // Update in place
          newData.commands[catId][idx] = updatedCommand
          saveData(newData)
          toast.success('Comando actualizado correctamente')
          setIsFormOpen(false)
          setIsEditorOpen(false) // Added this line for editor overlay
          setActiveCommand(null)
          return
        }
      }
    } else {
      // Create new command
      const newCommand: Command = {
        ...updatedCommand,
        id: updatedCommand.id || generateUniqueId(), // Ensure ID exists for new commands
        order: 0, // NEW: New items always at top
      }

      if (!newData.commands[categoryId]) {
        newData.commands[categoryId] = []
      }

      // UX: Add to beginning of array (LIFO)
      newData.commands[categoryId].unshift(newCommand)

      // Re-index subsequent items to keep order clean
      newData.commands[categoryId].forEach((cmd, idx) => {
        cmd.order = idx;
      });

      saveData(newData)
      toast.success('Comando creado correctamente')
      setIsFormOpen(false)
      setIsEditorOpen(false) // Added this line for editor overlay
      setActiveCommand(null)
    }
  }

  // --- Category CRUD Handlers ---
  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    const newData: AppData = JSON.parse(JSON.stringify(data))

    if (categoryData.id) {
      // Update existing category
      const idx = newData.categories.findIndex(cat => cat.id === categoryData.id)
      if (idx !== -1) {
        newData.categories[idx] = {
          ...newData.categories[idx],
          name: categoryData.name!,
          icon: categoryData.icon!,
        }
        saveData(newData)
        toast.success('Categoría actualizada')
      }
    } else {
      // Create new category
      const newCategory: Category = {
        id: generateUniqueId(),
        name: categoryData.name!,
        icon: categoryData.icon!,
        order: 0, // LIFO: New categories at top
      }
      // UX: Add to beginning of array
      newData.categories.unshift(newCategory)

      // Re-index
      newData.categories.forEach((cat, idx) => {
        cat.order = idx;
      });

      newData.commands[newCategory.id] = []
      saveData(newData)
      toast.success('Categoría creada')
    }

    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const handleDuplicateCategory = (category: Category) => {
    // Deep clone the data
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // Generate new unique ID for the category
    const newCategoryId = generateUniqueId()

    // Create the duplicated category
    const duplicatedCategory: Category = {
      ...category,
      id: newCategoryId,
      name: `${category.name} (Copia)`,
      order: 0, // LIFO: New categories at top
    }

    // Add to beginning of categories array
    newData.categories.unshift(duplicatedCategory)

    // Re-index categories
    newData.categories.forEach((cat, idx) => {
      cat.order = idx
    })

    // Clone all commands from the original category
    const originalCommands = data.commands[category.id] || []
    const clonedCommands: Command[] = originalCommands.map((cmd) => ({
      ...cmd,
      id: generateUniqueId(), // Generate unique ID for each command
    }))

    // Add cloned commands to new category
    newData.commands[newCategoryId] = clonedCommands

    // Save and notify
    saveData(newData)
    toast.success('Categoría duplicada correctamente')
  }

  const handleDeleteCategory = (categoryId: string) => {
    const { setSelectedCategory } = useAppStore.getState()
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // Remove category from list
    newData.categories = newData.categories.filter(cat => cat.id !== categoryId)

    // Delete all commands in this category
    delete newData.commands[categoryId]

    // If we're deleting the selected category, switch to favorites
    if (selectedCategory === categoryId) {
      setSelectedCategory('favorites')
    }

    saveData(newData)
    toast.success('Categoría eliminada')
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const handleReorderCategories = (newOrder: Category[]) => {
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // Filter out favorites from the input newOrder just in case, though Sidebar sends full list
    // We want to update the order of user categories.
    const userCategories = newOrder.filter(c => c.id !== 'favorites')

    // Update the categories list in newData
    // We keep them in the order received, and update their 'order' property
    newData.categories = userCategories.map((cat, index) => ({
      ...cat,
      order: index
    }))

    saveData(newData)
  }

  const handleReorderCommands = (newOrder: Command[]) => {
    // 1. Determine local category context
    const categoryId = selectedCategory === 'favorites' ? 'all' : selectedCategory

    // 2. Deep clone data
    const newData: AppData = JSON.parse(JSON.stringify(data))

    // 3. Update the specific category
    // Note: If 'favorites' or search is active, we might be reordering a subset
    // For MVP, we only allow reordering when a specific category is selected (not favorites/search)
    if (categoryId === 'all' || searchQuery) {
      toast.error('Solo puedes reordenar dentro de una categoría específica')
      return
    }

    if (newData.commands[categoryId]) {
      // Update order property for each command to match new index
      const updatedCommands = newOrder.map((cmd, index) => ({
        ...cmd,
        order: index
      }))

      newData.commands[categoryId] = updatedCommands
      saveData(newData)
    }
  }

  // Form submit handler - transforms form data to Command
  const onFormSubmit = (formData: any) => {
    // Convert form type to command type
    let commandType: "command" | "workflow" | "prompt" = "command"
    if (formData.type === "workflow") {
      commandType = "workflow"
    }

    // Build command object
    const commandData: Command = {
      id: activeCommand?.id || "", // Will be generated in handleSave if empty
      label: formData.label,
      command: formData.command,
      type: commandType,
      isFavorite: formData.isFavorite,
      order: activeCommand?.order || 0,
    }

    // Add type-specific fields
    if (formData.type === "workflow" && formData.steps) {
      commandData.steps = formData.steps
    } else if (formData.type === "variables" && formData.variables) {
      commandData.variables = formData.variables
    }

    handleSave(commandData)
  }

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("command-search")?.focus()
        return
      }

      // Don't interfere with typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const maxIndex = filteredCommands.length - 1

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => prev >= maxIndex ? 0 : prev + 1)
          break

        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => prev <= 0 ? maxIndex : prev - 1)
          break

        case "Enter":
          e.preventDefault()
          const selectedCommand = filteredCommands[selectedIndex]
          if (selectedCommand) {
            if (selectedCommand.type === "workflow" && selectedCommand.steps) {
              handleWorkflowStep(selectedCommand.id, selectedCommand.steps)
            } else {
              handleCopyCommand(selectedCommand.id, selectedCommand.command, selectedCommand.variables)
            }
          }
          break

        case "Escape":
          e.preventDefault()
          setSearchQuery("")
          document.getElementById("command-search")?.blur()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredCommands, selectedIndex, variableValues])

  if (isLoading || !hasMounted) {
    return (
      <>
        <Toaster richColors position="bottom-center" />
        <DashboardSkeleton />
      </>
    )
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-7xl mx-auto flex h-screen">
          <Sidebar
            categories={sortedCategories}
            data={data}
            helpContent={helpContent}
            onCreateCategory={handleCreateCategory}
            onEditCategory={handleEditCategory}
            onDuplicateCategory={handleDuplicateCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategories={handleReorderCategories}
            onImport={importData}
          />

          {/* Central Panel */}
          <div className="flex-1 flex flex-col bg-gray-950">
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={selectedCategory === 'favorites' ? 'favorites' : 'default'}
              favoritesSort={favoritesSort}
              onSortChange={handleSortChange}
            />
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
              onEdit={isEditMode ? handleEdit : undefined}
              onDelete={isEditMode ? handleDelete : undefined}
              onDuplicate={isEditMode ? handleDuplicate : undefined}
              onReorder={isEditMode ? handleReorderCommands : undefined}
              onSelect={setSelectedIndex}
              incrementUsage={incrementUsage}
              resetUsage={resetUsage}
              onNavigateCategory={setSelectedCategory}
              viewMode={selectedCategory === 'favorites' ? 'favorites' : 'default'}
            />
          </div>
        </div>

        {/* Edit Mode: Floating Action Button with Dropdown */}
        {isEditMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className={`fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40 ${selectedCategory === 'favorites' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                title={selectedCategory === 'favorites' ? "Selecciona una categoría para crear" : "Crear nuevo"}
                disabled={selectedCategory === 'favorites'}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="bg-gray-900 border-gray-800 text-white"
            >
              <DropdownMenuItem
                onClick={handleCreate}
                className="hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                Nuevo Comando
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCreatePrompt}
                className="hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Nuevo Prompt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Edit Mode: Admin Components (Lazy Loaded) */}
        {isEditMode && (
          <>
            <CommandFormModal
              isOpen={isFormOpen}
              onOpenChange={(open) => {
                setIsFormOpen(open)
                if (!open) setActiveCommand(null)
              }}
              onSubmit={onFormSubmit}
              initialData={activeCommand}
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
            <CategoryFormModal
              isOpen={isCategoryModalOpen}
              onClose={() => {
                setIsCategoryModalOpen(false)
                setEditingCategory(null)
              }}
              onSave={handleSaveCategory}
              onDelete={handleDeleteCategory}
              initialData={editingCategory}
            />
          </>
        )}
      </div>

      {/* Delete Command Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}