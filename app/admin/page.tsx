"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"

// --- Tipos de Datos ---
interface Command {
  id: string
  label: string
  command: string
  type: "command" | "workflow" | "prompt"
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

interface DeleteAlertState {
  isOpen: boolean;
  type: 'category' | 'command' | null;
  id: string | null;
  name?: string;
}

export default function AdminPage() {
  const [data, setData] = useState<AppData>({ categories: [], commands: {} })
  const [isLoading, setIsLoading] = useState(true)
  const [adminSelectedCategory, setAdminSelectedCategory] = useState<string | null>(null)

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")

  const [addCommandOpen, setAddCommandOpen] = useState(false)
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)
  const [newCommandLabel, setNewCommandLabel] = useState("")
  const [newCommandType, setNewCommandType] = useState<"simple" | "workflow" | "variables" | "prompt">("simple")
  const [newCommandText, setNewCommandText] = useState("")
  const [newWorkflowSteps, setNewWorkflowSteps] = useState<string[]>([""])
  const [newVariables, setNewVariables] = useState<{ name: string; placeholder: string }[]>([{ name: "", placeholder: "" }])
  const [deleteAlert, setDeleteAlert] = useState<DeleteAlertState>({ isOpen: false, type: null, id: null });

  // --- Lógica de Datos (Carga/Guardado) ---
  const fetchData = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const response = await fetch("/api/commands")
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`)
      
      const jsonData = await response.json()
      setData(jsonData)

      if (jsonData.categories && jsonData.categories.length > 0 && !adminSelectedCategory) {
        setAdminSelectedCategory(jsonData.categories[0].id)
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
  
  const triggerDeleteCategory = () => {
    if (!adminSelectedCategory) return;
    const categoryName = data.categories.find(c => c.id === adminSelectedCategory)?.name;
    setDeleteAlert({
      isOpen: true,
      type: 'category',
      id: adminSelectedCategory,
      name: categoryName
    });
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
    if (command.type === 'prompt') {
      setNewCommandType('prompt');
    } else if(command.type === 'workflow') {
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
        alert("Debes seleccionar una categoría y añadir un label para el item.")
        return
    }

    let finalCommand: Command;
    let commandList = [...(data.commands[adminSelectedCategory] || [])];

    if (editingCommand) { // --- MODO EDICIÓN ---
      const baseCommand = { ...editingCommand, label: newCommandLabel, command: newCommandText };
      if (newCommandType === 'prompt') {
        finalCommand = { ...baseCommand, type: 'prompt', steps: undefined, variables: undefined };
      } else if (newCommandType === 'workflow') {
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
       if (newCommandType === "prompt") {
        finalCommand = { ...baseCommand, type: "prompt" };
       } else if (newCommandType === "workflow") {
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
    setAddCommandOpen(false);
  }

  const triggerDeleteCommand = (command: Command) => {
    setDeleteAlert({
      isOpen: true,
      type: 'command',
      id: command.id,
      name: command.label
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteAlert.id || !deleteAlert.type) return;
  
    if (deleteAlert.type === 'category') {
      const newCategories = data.categories.filter((c) => c.id !== deleteAlert.id);
      const newCommands = { ...data.commands };
      delete newCommands[deleteAlert.id];
      saveData({ categories: newCategories, commands: newCommands });
      setAdminSelectedCategory(null); 
    } else if (deleteAlert.type === 'command' && adminSelectedCategory) {
      const newCommandsData = { ...data.commands };
      newCommandsData[adminSelectedCategory] = newCommandsData[adminSelectedCategory].filter(
        (c) => c.id !== deleteAlert.id
      );
      saveData({ ...data, commands: newCommandsData });
    }
  
    setDeleteAlert({ isOpen: false, type: null, id: null });
  };
  
  // --- Helpers para formularios dinámicos ---
  const updateStep = (idx: number, value: string) => setNewWorkflowSteps((s) => s.map((v, i) => (i === idx ? value : v)))
  const removeStep = (idx: number) => setNewWorkflowSteps((s) => s.filter((_, i) => i !== idx))
  const addStepField = () => setNewWorkflowSteps((s) => [...s, ""])

  const updateVariable = (idx: number, field: "name" | "placeholder", value: string) => setNewVariables((v) => v.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  const removeVariable = (idx: number) => setNewVariables((v) => v.filter((_, i) => i !== idx))
  const addVariableField = () => setNewVariables((v) => [...v, { name: "", placeholder: "" }])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-400">Cargando Panel de Administración...</h1>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                <Link href="/" className="p-2 rounded-md hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Panel de Administración</h1>
                    <p className="text-gray-400">Añade, edita o elimina tus categorías y contenido.</p>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6 pt-6 overflow-y-hidden">
            {/* Columna de Categorías */}
            <div className="col-span-1 flex flex-col gap-2 min-h-0">
                <h3 className="font-bold text-lg">Categorías</h3>
                <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAddCategory}>
                        <PlusCircle size={16} />
                        Añadir
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-2" onClick={triggerDeleteCategory} disabled={!adminSelectedCategory}>
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
            
            {/* Columna de Comandos/Items */}
            <div className="md:col-span-2 flex flex-col gap-2 min-w-0 min-h-0">
                <h3 className="font-bold text-lg">
                    Contenido en:{" "}
                    <span className="text-blue-400">
                        {data.categories.find(c => c.id === adminSelectedCategory)?.name || "..."}
                    </span>
                </h3>
                <Button size="sm" className="w-fit gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAddCommand} disabled={!adminSelectedCategory}>
                    <PlusCircle size={16} />
                    Añadir Item
                </Button>
                <ScrollArea className="flex-1 bg-gray-950/50 rounded-md border border-gray-700">
                    <div className="p-2 space-y-2">
                        {adminSelectedCategory && data.commands[adminSelectedCategory]?.map((cmd) => (
                            <div key={cmd.id} className="group grid grid-cols-[1fr_auto] items-center gap-4 p-2 bg-gray-800 rounded-md">
                                <div className="flex flex-col overflow-hidden min-w-0">
                                    <span className="font-semibold text-sm truncate">{cmd.label}</span>
                                    <span className="text-xs text-gray-400 font-mono truncate">{cmd.command}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditCommand(cmd)}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => triggerDeleteCommand(cmd)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
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
                    <Button onClick={handleSaveCategory} className="bg-blue-600 hover:bg-blue-700 mt-2 sm:mt-0">Guardar</Button>
                    <DialogClose asChild><Button type="button" variant="destructive">Cancelar</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={addCommandOpen} onOpenChange={setAddCommandOpen}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingCommand ? 'Editar' : 'Nuevo'} Item</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input
                  placeholder="Label"
                  value={newCommandLabel}
                  onChange={(e) => setNewCommandLabel(e.target.value)}
                   className="bg-gray-800 border-gray-700 focus:border-blue-500"
                />
                <ToggleGroup
                  type="single"
                  value={newCommandType}
                  onValueChange={(v) => { if (v) setNewCommandType(v as any) }}
                  className="w-full justify-start gap-2"
                  disabled={!!editingCommand}
                >
                  <ToggleGroupItem value="simple" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Simple</ToggleGroupItem>
                  <ToggleGroupItem value="prompt" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Prompt</ToggleGroupItem>
                  <ToggleGroupItem value="workflow" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Workflow</ToggleGroupItem>
                  <ToggleGroupItem value="variables" variant="outline" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200">Con Variables</ToggleGroupItem>
                </ToggleGroup>
                
                {newCommandType === 'prompt' ? (
                  <Textarea placeholder="Contenido del prompt..." value={newCommandText} onChange={(e) => setNewCommandText(e.target.value)} className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500 min-h-[150px]" />
                ) : newCommandType === 'workflow' ? (
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
                ) : newCommandType === 'variables' ? (
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
                ) : (
                   <Input placeholder="Comando" value={newCommandText} onChange={(e) => setNewCommandText(e.target.value)} className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500"/>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleSaveCommand} className="bg-blue-600 hover:bg-blue-700 mt-2 sm:mt-0">Guardar Item</Button>
                 <DialogClose asChild>
                    <Button type="button" variant="destructive">Cancelar</Button>
                  </DialogClose>
              </DialogFooter>
            </DialogContent>
        </Dialog>

        <AlertDialog open={deleteAlert.isOpen} onOpenChange={(isOpen) => setDeleteAlert({ ...deleteAlert, isOpen })}>
          <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                {deleteAlert.type === 'category'
                  ? `Esto eliminará permanentemente la categoría "${deleteAlert.name}" y todos los comandos que contiene.`
                  : `Esto eliminará permanentemente el comando "${deleteAlert.name}".`}
                  <br />
                  Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Sí, eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}