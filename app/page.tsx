"use client"

import { useState, useEffect, useMemo } from "react"
import Fuse from "fuse.js"
import { Toaster } from "@/components/ui/sonner"
import type { Command, Category } from "@/types"
import { Sidebar } from "@/components/dev-caddy/Sidebar"
import { Header } from "@/components/dev-caddy/Header"
import { CommandList } from "@/components/dev-caddy/CommandList"
import { DashboardSkeleton } from "@/components/dev-caddy/skeletons"
import { useAppStore } from "@/store/appStore"
import { useCommands } from "@/hooks/use-commands"

export default function BroworksLaunchpad() {
  // --- Custom Hook for Data Logic ---
  const { data, isLoading, hasMounted, toggleFavorite } = useCommands()

  // --- UI State ---
  const { selectedCategory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
  const [helpContent, setHelpContent] = useState("")

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
            />
          </div>
        </div>
      </div>
    </>
  )
}