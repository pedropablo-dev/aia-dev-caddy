"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Toaster } from "@/components/ui/sonner"
import type { Command, Category } from "@/types"
import { Sidebar } from "@/components/dev-caddy/Sidebar"
import { Header } from "@/components/dev-caddy/Header"
import { CommandList } from "@/components/dev-caddy/CommandList"
import { useAppStore } from "@/store/appStore"
import { useCommands } from "@/hooks/use-commands"

export default function BroworksLaunchpad() {
  // --- Custom Hook for Data Logic ---
  const { data, isLoading, hasMounted, toggleFavorite } = useCommands()

  // --- UI State ---
  const { selectedCategory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredCommands = useMemo(() => {
    let commandsToShow: Command[]

    if (selectedCategory === 'favorites') {
      commandsToShow = Object.values(data.commands)
        .flat()
        .filter((cmd) => cmd.isFavorite)
        .sort((a, b) => (a.label > b.label) ? 1 : -1)
    } else {
      commandsToShow = [...(data.commands[selectedCategory] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    if (searchQuery) {
      return commandsToShow.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return commandsToShow
  }, [selectedCategory, data.commands, searchQuery])

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

  // --- Atajo de Teclado ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("command-search")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (isLoading || !hasMounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Dev-Caddy Logo" width={32} height={32} className="flex-shrink-0" />
          <h1 className="text-2xl font-bold text-yellow-500">Loading Dev-Caddy...</h1>
        </div>
      </div>
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