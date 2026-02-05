"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import type { Command, Category, AppData } from "@/types"
import { Sidebar } from "@/components/dev-caddy/Sidebar"
import { Header } from "@/components/dev-caddy/Header"
import { CommandList } from "@/components/dev-caddy/CommandList"
import { useAppStore } from "@/store/appStore"

export default function BroworksLaunchpad() {
  // --- Estados de Datos y UI Principal ---
  const [data, setData] = useState<AppData>({ categories: [], commands: {} })
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCategory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
  const [hasMounted, setHasMounted] = useState(false);
  const [helpContent, setHelpContent] = useState("")

  // --- Lógica de Datos (Carga) ---
  const fetchData = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const response = await fetch("/api/commands")
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`)

      const jsonData: AppData = await response.json()

      let needsSave = false;
      jsonData.categories.forEach((cat, index) => {
        if (cat.order === undefined) {
          cat.order = index;
          needsSave = true;
        }
      });

      for (const categoryId in jsonData.commands) {
        jsonData.commands[categoryId].forEach((cmd, index) => {
          if (cmd.order === undefined) {
            cmd.order = index;
            needsSave = true;
          }
        });
      }

      setData(jsonData)

      // Se mantiene la categoría seleccionada del store, no se resetea
      if (needsSave) {
        await saveData(jsonData, false);
      }

    } catch (error) {
      console.error("Error loading commands:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: AppData, shouldRefetch = true) => {
    try {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      // 🔒 Check if validation failed (400) or server error (500)
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error al guardar los datos";

        // Show validation errors if available
        if (errorData.errors) {
          console.error("Validation errors:", errorData.errors);
          toast.error(`${errorMessage}. Revisa los datos.`);
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      if (shouldRefetch) {
        // No se llama a fetchData para evitar bucles. 
        // El estado se actualiza localmente en las funciones que guardan.
        setData(newData);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error de conexión al guardar los datos.");
    }
  };

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

  // --- Lógica de Favoritos ---
  const handleToggleFavorite = (commandId: string) => {
    const newData = JSON.parse(JSON.stringify(data)) as AppData; // Deep clone
    for (const categoryId in newData.commands) {
      const cmd = newData.commands[categoryId].find((c) => c.id === commandId);
      if (cmd) {
        cmd.isFavorite = !cmd.isFavorite;
        break;
      }
    }
    saveData(newData);
  };

  useEffect(() => {
    setHasMounted(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Categorías y Comandos Filtrados ---
  const sortedCategories = useMemo(() => {
    const favCategory: Category = {
      id: 'favorites',
      name: 'Favoritos',
      icon: '⭐',
      order: -1
    };
    const regularCategories = [...data.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return [favCategory, ...regularCategories];
  }, [data.categories]);

  const filteredCommands = useMemo(() => {
    let commandsToShow: Command[];

    if (selectedCategory === 'favorites') {
      commandsToShow = Object.values(data.commands)
        .flat()
        .filter((cmd) => cmd.isFavorite)
        .sort((a, b) => (a.label > b.label) ? 1 : -1); // Ordenar favoritos alfabéticamente
    } else {
      commandsToShow = [...(data.commands[selectedCategory] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    if (searchQuery) {
      return commandsToShow.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return commandsToShow;
  }, [selectedCategory, data.commands, searchQuery]);


  // --- Lógica de Interacción con Comandos ---
  const handleCopyCommand = (commandId: string, baseCommand: string, variables?: any[]) => {
    let finalCommand = baseCommand
    if (variables) {
      variables.forEach((variable) => {
        const varName = typeof variable === 'string' ? variable : variable.name;
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
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

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
              onToggleFavorite={handleToggleFavorite}
              onVariableChange={handleVariableChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}