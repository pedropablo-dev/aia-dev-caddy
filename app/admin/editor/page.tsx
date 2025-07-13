"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"

interface Command {
  id: string;
  label: string;
  command: string;
  type: "prompt";
  isFavorite?: boolean;
  order?: number;
}

interface AppData {
  categories: { id: string; name: string; icon: string; order?: number }[];
  commands: Record<string, Command[]>;
}

function PromptEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [label, setLabel] = useState("")
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const commandId = searchParams.get('commandId')
  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
    if (!commandId) {
      setIsLoading(false)
      return;
    }

    const fetchCommandData = async () => {
      try {
        const response = await fetch("/api/commands");
        const data: AppData = await response.json();
        const command = data.commands[categoryId!]?.find(c => c.id === commandId);
        if (command) {
          setLabel(command.label);
          setText(command.command);
        }
      } catch (error) {
        console.error("Error fetching command data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommandData();
  }, [commandId, categoryId]);

  const handleSave = async () => {
    if (!label || !categoryId) {
      alert("El prompt debe tener un label y pertenecer a una categoría.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/commands");
      const currentData: AppData = await res.json();
      
      const newCommandsForCategory = [...(currentData.commands[categoryId] || [])];
      
      if (commandId) { // Editar existente
        const cmdIndex = newCommandsForCategory.findIndex(c => c.id === commandId);
        if (cmdIndex !== -1) {
          newCommandsForCategory[cmdIndex] = {
            ...newCommandsForCategory[cmdIndex],
            label,
            command: text,
          };
        }
      } else { // Crear nuevo
        const newCommand: Command = {
          id: `cmd-${Date.now()}`,
          label,
          command: text,
          type: "prompt",
          order: newCommandsForCategory.length,
          isFavorite: false,
        };
        newCommandsForCategory.push(newCommand);
      }
      
      const newData: AppData = {
        ...currentData,
        commands: {
          ...currentData.commands,
          [categoryId]: newCommandsForCategory,
        },
      };

      await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      router.push('/admin');

    } catch (error) {
      console.error("Failed to save prompt:", error);
      alert("Error al guardar el prompt.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-400">Cargando Editor...</h1></div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">{commandId ? 'Editando' : 'Nuevo'} Prompt</h1>
            <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className="gap-2 bg-gray-700 hover:opacity-90"
                onClick={() => router.push('/admin')}
            >
                <ArrowLeft />
                Volver sin guardar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSave} disabled={isSaving}>
                <Save />
                {isSaving ? 'Guardando...' : 'Guardar y Volver'}
            </Button>
            </div>
        </div>
      </header>
      <main className="flex-1 p-4 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div>
            <label htmlFor="prompt-label" className="text-sm font-medium text-gray-400 mb-2 block">Label del Prompt</label>
            <Input
                id="prompt-label"
                placeholder="Escribe aquí el título para tu prompt..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full text-lg bg-gray-800 border-gray-700 focus:border-blue-500"
            />
        </div>
        <div className="flex-1 flex flex-col">
            <label htmlFor="prompt-content" className="text-sm font-medium text-gray-400 mb-2 block">Contenido del Prompt</label>
            <Textarea
                id="prompt-content"
                placeholder="Escribe aquí tu prompt..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-full flex-1 resize-none text-base bg-gray-800 border-gray-700 focus:border-blue-500 custom-scrollbar"
            />
        </div>
      </main>
    </div>
  )
}


export default function PromptEditorPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PromptEditor />
        </Suspense>
    )
}