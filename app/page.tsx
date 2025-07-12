"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Copy,
  Check,
  Play,
  Terminal,
  Zap,
  Settings,
  PlusCircle,
  Trash2,
  HelpCircle,
  PanelLeftClose,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import ReactMarkdown, { Components } from "react-markdown"
import { useUIStore } from "@/store/uiStore"

// --- Tipos de Datos ---
interface Command {
  id: string
  label: string
  command: string
  type: "command" | "workflow"
  variables?: { name: string; placeholder: string }[]
  steps?: string[]
}

interface Category {
  id: string
  name: string
  icon: string
}

interface AppData {
  categories: Category[]
  commands: Record<string, Command[]>
}

// --- Componentes para Markdown (para futura mejora) ---
const markdownComponents: Components = {
    h1: ({...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
    h3: ({...props}) => <h3 className="text-lg font-semibold text-blue-400 mt-6 mb-2" {...props} />,
    hr: ({...props}) => <hr className="my-4 border-gray-700" {...props} />,
    ul: ({...props}) => <ul className="list-disc list-inside space-y-2 pl-4" {...props} />,
    li: ({...props}) => <li className="text-gray-300" {...props} />,
    p: ({...props}) => <p className="text-gray-300 mb-4" {...props} />,
    strong: ({...props}) => <strong className="font-semibold text-gray-200" {...props} />,
    code: ({...props}) => <code className="bg-gray-800 text-purple-300 font-mono rounded-md px-1.5 py-0.5 text-sm" {...props} />
}

export default function BroworksLaunchpad() {
  // --- Estados de Datos y UI Principal ---
  const [data, setData] = useState<AppData>({ categories: [], commands: {} })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})

  // --- Estados de la Barra Lateral ---
  const { isSidebarCollapsed, toggleSidebar } = useUIStore()

  // --- Estados de los Modales y Edición---
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminSelectedCategory, setAdminSelectedCategory] = useState<string | null>(null)

  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [helpContent, setHelpContent] = useState("")

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")

  const [addCommandOpen, setAddCommandOpen] = useState(false)
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)
  const [newCommandLabel, setNewCommandLabel] = useState("")
  const [newCommandType, setNewCommandType] = useState<"simple" | "workflow" | "variables">("simple")
  const [newCommandText, setNewCommandText] = useState("")
  const [newWorkflowSteps, setNewWorkflowSteps] = useState<string[]>([""])
  const [newVariables, setNewVariables] = useState<{ name: string; placeholder: string }[]>([{ name: "", placeholder: "" }])

  // --- Lógica de Datos (Carga/Guardado) ---
  const fetchData = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const response = await fetch("/api/commands")
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`)

      const jsonData = await response.json()
      setData(jsonData)

      if (jsonData.categories && jsonData.categories.length > 0 && !selectedCategory) {
        setSelectedCategory(jsonData.categories[0].id)
      }
    } catch (error) {
      console.error("Error loading commands:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: AppData) => {
    try {
      await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })
      await fetchData()
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Error al guardar los datos.")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Lógica de Ayuda ---
  useEffect(() => {
    if (isHelpOpen) {
      fetch("/help.md")
        .then((r) => r.text())
        .then(setHelpContent)
        .catch(() => setHelpContent("No se pudo cargar la ayuda."))
    }
  }, [isHelpOpen])

  // --- Lógica de Administración de Categorías ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryIcon("");
    setAddCategoryOpen(true);
  }

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryIcon(category.icon);
    setAddCategoryOpen(true);
  }

  const handleSaveCategory = () => {
    let newData: AppData;

    if (editingCategory) { // --- MODO EDICIÓN ---
        newData = {
            ...data,
            categories: data.categories.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName, icon: newCategoryIcon } : c)
        }
    } else { // --- MODO CREACIÓN ---
        if (!newCategoryName || !newCategoryIcon) {
            alert("El nombre y el icono son obligatorios.")
            return
        }
        const newId = newCategoryName.toLowerCase().replace(/\s+/g, "-")
        if (data.categories.some((c) => c.id === newId)) {
            alert("Ya existe una categoría con un ID similar.")
            return
        }
        const newCategory: Category = { id: newId, name: newCategoryName, icon: newCategoryIcon }
        newData = {
            ...data,
            categories: [...data.categories, newCategory],
            commands: { ...data.commands, [newId]: [] },
        }
    }
    
    saveData(newData)
    setAddCategoryOpen(false)
  }

  const handleDeleteCategory = () => {
    if (!adminSelectedCategory) return alert("Selecciona una categoría para eliminar.")
    if (confirm(`¿Seguro que quieres eliminar la categoría "${data.categories.find(c => c.id === adminSelectedCategory)?.name}" y todos sus comandos?`)) {
      const newCategories = data.categories.filter((c) => c.id !== adminSelectedCategory)
      const newCommands = { ...data.commands }
      delete newCommands[adminSelectedCategory]
      const newData = { categories: newCategories, commands: newCommands }
      setAdminSelectedCategory(null)
      saveData(newData)
    }
  }

  // --- Lógica de Administración de Comandos ---
  const handleOpenAddCommand = () => {
    if(!adminSelectedCategory) return;
    setEditingCommand(null);
    setNewCommandLabel("");
    setNewCommandText("");
    setNewCommandType("simple");
    setNewWorkflowSteps([""]);
    setNewVariables([{ name: "", placeholder: "" }]);
    setAddCommandOpen(true);
  }

  const handleOpenEditCommand = (command: Command) => {
    setEditingCommand(command);
    setNewCommandLabel(command.label);
    setNewCommandText(command.command || "");
    if(command.type === 'workflow') {
      setNewCommandType('workflow');
      setNewWorkflowSteps(command.steps || [""]);
    } else if (command.variables && command.variables.length > 0) {
      setNewCommandType('variables');
      setNewVariables(command.variables);
    } else {
      setNewCommandType('simple');
    }
    setAddCommandOpen(true);
  }

  const handleSaveCommand = () => {
    if (!adminSelectedCategory || !newCommandLabel) {
        alert("Debes seleccionar una categoría y añadir un label para el comando.")
        return
    }

    let finalCommand: Command;
    let commandList = [...(data.commands[adminSelectedCategory] || [])];

    if (editingCommand) { // --- MODO EDICIÓN ---
      const baseCommand = { ...editingCommand, label: newCommandLabel, command: newCommandText };
      if (newCommandType === 'workflow') {
        finalCommand = { ...baseCommand, type: 'workflow', steps: newWorkflowSteps.filter(s => s.trim()), variables: undefined };
      } else if (newCommandType === 'variables') {
        finalCommand = { ...baseCommand, type: 'command', variables: newVariables.filter(v => v.name.trim()), steps: undefined };
      } else {
        finalCommand = { ...baseCommand, type: 'command', variables: undefined, steps: undefined };
      }
      commandList = commandList.map(cmd => cmd.id === editingCommand.id ? finalCommand : cmd);

    } else { // --- MODO CREACIÓN ---
      const id = `cmd-${Date.now()}`;
      const baseCommand = { id, label: newCommandLabel, command: newCommandText };
       if (newCommandType === "workflow") {
        finalCommand = { ...baseCommand, command: "workflow", type: "workflow", steps: newWorkflowSteps.filter((s) => s.trim() !== "") }
      } else if (newCommandType === "variables") {
        finalCommand = { ...baseCommand, type: "command", variables: newVariables.filter((v) => v.name.trim() || v.placeholder.trim()) }
      } else {
        finalCommand = { ...baseCommand, type: "command" }
      }
      commandList.push(finalCommand);
    }
    
    const newCommandsData = { ...data.commands, [adminSelectedCategory]: commandList };
    saveData({ ...data, commands: newCommandsData });

    // Resetear formulario
    setAddCommandOpen(false);
  }
  
  // --- Helpers para formularios dinámicos ---
  const updateStep = (idx: number, value: string) => setNewWorkflowSteps((s) => s.map((v, i) => (i === idx ? value : v)))
  const removeStep = (idx: number) => setNewWorkflowSteps((s) => s.filter((_, i) => i !== idx))
  const addStepField = () => setNewWorkflowSteps((s) => [...s, ""])

  const updateVariable = (idx: number, field: "name" | "placeholder", value: string) => setNewVariables((v) => v.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  const removeVariable = (idx: number) => setNewVariables((v) => v.filter((_, i) => i !== idx))
  const addVariableField = () => setNewVariables((v) => [...v, { name: "", placeholder: "" }])

  const handleDeleteCommand = (commandId: string) => {
    if (!adminSelectedCategory) return
    if (confirm("¿Seguro que quieres eliminar este comando?")) {
      const newCommandsData = { ...data.commands }
      newCommandsData[adminSelectedCategory] = newCommandsData[adminSelectedCategory].filter((c) => c.id !== commandId)
      saveData({ ...data, commands: newCommandsData })
    }
  }
  
  // --- Lógica de Filtrado y Búsqueda ---
  const filteredCommands = data.commands[selectedCategory]?.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  const filteredCategories = data.categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // --- Lógica de Interacción con Comandos ---
  const handleCopyCommand = (commandId: string, baseCommand: string, variables?: any[]) => {
    let finalCommand = baseCommand
    if (variables) {
      variables.forEach((variable) => {
        const value = variableValues[`${commandId}_${variable.name}`] || ""
        finalCommand = finalCommand.replace(`{${variable.name}}`, value)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-400">Loading Dev-Caddy...</h1>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-80"} bg-gray-900 border-r border-gray-800 flex flex-col`}>
          <div className="p-4 border-b border-gray-800">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap ${isSidebarCollapsed ? "hidden" : ""}`}>
                broWorks dev-caddy
              </h1>
            </div>
            
            <div className={`flex items-center mt-3 mb-4 gap-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
              <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span className={`font-bold text-sm ${isSidebarCollapsed ? "hidden" : ""}`}>Panel de Administración</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Panel de Administración</DialogTitle>
                    <DialogDescription>Añade, edita o elimina tus categorías y comandos.</DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                    <div className="col-span-1 flex flex-col gap-2 min-h-0">
                      <h3 className="font-bold">Categorías</h3>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAddCategory}>
                            <PlusCircle size={16} />
                            Añadir
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDeleteCategory} disabled={!adminSelectedCategory}>
                          <Trash2 size={16} />
                          Eliminar
                        </Button>
                      </div>
                      <ScrollArea className="flex-1 bg-gray-950/50 rounded-md border border-gray-700">
                        <div className="p-2 space-y-1">
                          {data.categories.map((cat) => (
                            <div key={cat.id} className={`group grid grid-cols-[1fr_auto] items-center gap-2 p-2 rounded-md cursor-pointer ${
                                adminSelectedCategory === cat.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                            }`}
                              onClick={() => setAdminSelectedCategory(cat.id)}
                            >
                              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="truncate">{cat.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); handleOpenEditCategory(cat)}}>
                                  <Pencil size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2 min-w-0 min-h-0">
                       <h3 className="font-bold">
                        Comandos en:{" "}
                        <span className="text-blue-400">
                          {data.categories.find(
                            (c) => c.id === adminSelectedCategory
                          )?.name || "..."}
                        </span>
                      </h3>
                      <Button size="sm" className="w-fit gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAddCommand} disabled={!adminSelectedCategory}>
                        <PlusCircle size={16} />
                        Añadir Comando
                      </Button>
                      <ScrollArea className="flex-1 bg-gray-950/50 rounded-md border border-gray-700">
                        <div className="p-2 space-y-2">
                          {adminSelectedCategory &&
                            data.commands[adminSelectedCategory]?.map(
                              (cmd) => (
                                <div
                                  key={cmd.id}
                                  className="group grid grid-cols-[1fr_auto] items-center gap-4 p-2 bg-gray-800 rounded-md"
                                >
                                  <div className="flex flex-col overflow-hidden min-w-0">
                                    <span className="font-semibold text-sm truncate">
                                      {cmd.label}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono truncate">
                                      {cmd.command}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditCommand(cmd)}>
                                          <Pencil size={16} />
                                      </Button>
                                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteCommand(cmd.id)}>
                                          <Trash2 size={16} />
                                      </Button>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                   <DialogFooter>
                    <Button type="button" onClick={() => setAdminOpen(false)} className="bg-gray-700 text-white hover:bg-gray-600">
                      Cerrar Panel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {!isSidebarCollapsed && (
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 p-2">
             {!isSidebarCollapsed && (
                <h3 className="text-sm font-bold text-gray-400 mb-3 px-3">
                    Categorías
                </h3>
             )}
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span
                    className={`font-medium whitespace-nowrap ${
                      isSidebarCollapsed ? "hidden" : ""
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-2 border-t border-gray-800 flex flex-col gap-2">
            <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <HelpCircle className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`font-bold text-sm ${
                      isSidebarCollapsed ? "hidden" : ""
                    }`}
                  >
                    Ayuda
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle /> Guía de uso
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <div className="prose prose-invert max-w-none w-full">
                    <ReactMarkdown components={markdownComponents}>
                        {helpContent}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Entendido
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
              <span
                className={`font-bold text-sm ${
                  isSidebarCollapsed ? "hidden" : ""
                }`}
              >
                Colapsar
              </span>
            </Button>
          </div>
        </div>

        {/* Central Panel */}
        <div className="flex-1 flex flex-col bg-gray-950">
          <div className="p-6 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="command-search"
                placeholder="Search commands or press Ctrl+K..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-900 border-gray-700 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {filteredCommands.map((cmd) => (
                <Card
                  key={cmd.id}
                  className="bg-gray-900 border-gray-800 transition-colors hover:bg-gray-900"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                      {cmd.type === "workflow" ? (
                        <Play className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Terminal className="w-4 h-4 text-blue-400" />
                      )}
                      {cmd.label}
                    </CardTitle>
                    {cmd.type === "command" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCopyCommand(
                            cmd.id,
                            cmd.command,
                            cmd.variables
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {copiedCommand === cmd.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-2">Copy</span>
                      </Button>
                    )}
                    {cmd.type === "workflow" && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-900 text-purple-200 hover:bg-purple-900/80"
                      >
                        Workflow
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    {cmd.type === "workflow" ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-400">
                          Step {(workflowStep[cmd.id] || 0) + 1} of{" "}
                          {cmd.steps?.length}
                        </div>
                        <Input
                          value={
                            cmd.steps?.[workflowStep[cmd.id] || 0] || ""
                          }
                          readOnly
                          className="font-mono bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          onClick={() =>
                            handleWorkflowStep(cmd.id, cmd.steps || [])
                          }
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Step & Next
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Input
                          value={cmd.command}
                          readOnly
                          className="font-mono bg-gray-800 border-gray-700 text-white"
                        />
                        {cmd.variables && (
                          <div className="space-y-2 mt-2">
                            {cmd.variables.map((variable) => (
                              <Input
                                key={variable.name}
                                placeholder={variable.placeholder}
                                value={
                                  variableValues[
                                    `${cmd.id}_${variable.name}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setVariableValues((prev) => ({
                                    ...prev,
                                    [`${cmd.id}_${variable.name}`]:
                                      e.target.value,
                                  }))
                                }
                                className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* DIALOGS DE FORMULARIOS */}
        <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Nombre de la categoría" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="bg-gray-800 border-gray-700 focus:border-blue-500" />
                    <Input placeholder="Icono (ej: ⚡️)" value={newCategoryIcon} onChange={e => setNewCategoryIcon(e.target.value)} className="bg-gray-800 border-gray-700 focus:border-blue-500" />
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveCategory} className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
                    <DialogClose asChild><Button type="button" variant="destructive">Cancelar</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={addCommandOpen} onOpenChange={setAddCommandOpen}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingCommand ? 'Editar' : 'Nuevo'} Comando</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Label"
                  value={newCommandLabel}
                  onChange={(e) => setNewCommandLabel(e.target.value)}
                   className="bg-gray-800 border-gray-700 focus:border-blue-500"
                />
                <ToggleGroup
                  type="single"
                  value={newCommandType}
                  onValueChange={(v) => {
                    if (v) setNewCommandType(v as "simple" | "workflow" | "variables")
                  }}
                  className="w-full justify-start gap-2"
                  disabled={!!editingCommand}
                >
                  <ToggleGroupItem value="simple" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Simple</ToggleGroupItem>
                  <ToggleGroupItem value="workflow" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Workflow</ToggleGroupItem>
                  <ToggleGroupItem value="variables" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Con Variables</ToggleGroupItem>
                </ToggleGroup>
                
                {newCommandType === 'simple' && (
                  <Input placeholder="Comando" value={newCommandText} onChange={(e) => setNewCommandText(e.target.value)} className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500"/>
                )}

                {newCommandType === 'workflow' && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Pasos del Workflow</h4>
                    {newWorkflowSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input placeholder={`Step ${idx + 1}`} value={step} onChange={(e) => updateStep(idx, e.target.value)} className="flex-1 font-mono bg-gray-800 border-gray-700 focus:border-blue-500"/>
                        <Button size="icon" variant="destructive" onClick={() => removeStep(idx)}><Trash2 size={16} /></Button>
                      </div>
                    ))}
                    <Button size="sm" onClick={addStepField} className="gap-2 bg-gray-700 hover:opacity-90" variant="outline"><PlusCircle size={16} />Añadir Step</Button>
                  </div>
                )}

                {newCommandType === 'variables' && (
                  <div className="space-y-2">
                    <Input placeholder="Comando (ej: ssh {user}@{host})" value={newCommandText} onChange={(e) => setNewCommandText(e.target.value)} className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500"/>
                     <h4 className="text-sm font-medium text-gray-400">Variables</h4>
                    {newVariables.map((v, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input placeholder="Nombre (sin {})" value={v.name} onChange={(e) => updateVariable( idx, "name", e.target.value)} className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500"/>
                        <Input placeholder="Placeholder" value={v.placeholder} onChange={(e) => updateVariable(idx, "placeholder", e.target.value)} className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500"/>
                        <Button size="icon" variant="destructive" onClick={() => removeVariable(idx)}><Trash2 size={16} /></Button>
                      </div>
                    ))}
                    <Button size="sm" onClick={addVariableField} className="gap-2 bg-gray-700 hover:opacity-90" variant="outline"><PlusCircle size={16} />Añadir Variable</Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleSaveCommand} className="bg-blue-600 hover:bg-blue-700">Guardar Comando</Button>
                 <DialogClose asChild>
                    <Button type="button" variant="destructive">Cancelar</Button>
                  </DialogClose>
              </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}