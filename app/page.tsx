"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import Fuse from "fuse.js"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import type { Command, Category, AppData } from "@/types"
import { Sidebar } from "@/components/dev-caddy/Sidebar"
import { Header } from "@/components/dev-caddy/Header"
import { CommandList } from "@/components/dev-caddy/CommandList"
import { DashboardSkeleton } from "@/components/dev-caddy/skeletons"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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

export default function BroworksLaunchpad() {
  // --- Custom Hook for Data Logic ---
  const { data, isLoading, hasMounted, saveData, toggleFavorite } = useCommands()

  // --- UI State ---
  const { selectedCategory, isEditMode } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
  const [helpContent, setHelpContent] = useState("")

  // --- Edit Mode State ---
  const [activeCommand, setActiveCommand] = useState<Command | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

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
    return Object.values(data.commands).flat()
  }, [data.commands])

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
      commandsToShow = allCommands
        .filter((cmd) => cmd.isFavorite)
        .sort((a, b) => (a.label > b.label) ? 1 : -1)
    } else {
      commandsToShow = [...(data.commands[selectedCategory] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    return commandsToShow
  }, [selectedCategory, data.commands, searchQuery, fuse, allCommands])

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

  const handleEdit = (command: Command) => {
    setActiveCommand(command)
    if (command.type === 'prompt') {
      setIsEditorOpen(true)
    } else {
      setIsFormOpen(true)
    }
  }

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
      // CASE B: Create new command - ENSURE ID EXISTS
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

    setIsFormOpen(false)
    setIsEditorOpen(false)
    setActiveCommand(null)
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
        <Toaster richColors />
        <DashboardSkeleton />
      </>
    )
  }

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-7xl mx-auto flex h-screen">
          <Sidebar categories={sortedCategories} helpContent={helpContent} />

          {/* Central Panel */}
          <div className="flex-1 flex flex-col bg-gray-950">
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

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
          </>
        )}
      </div>
    </>
  )
}