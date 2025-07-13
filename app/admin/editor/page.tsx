"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

// Clave para guardar el texto temporalmente
const PROMPT_STORAGE_KEY = "prompt_editor_text"

export default function PromptEditorPage() {
  const router = useRouter()
  const [text, setText] = useState("")

  // Al cargar la página, intenta recuperar el texto que se estaba editando
  useEffect(() => {
    const storedText = sessionStorage.getItem(PROMPT_STORAGE_KEY)
    if (storedText) {
      setText(storedText)
    }
  }, [])

  // Función para guardar y volver
  const handleSaveAndReturn = () => {
    sessionStorage.setItem(PROMPT_STORAGE_KEY, text)
    router.back() // Vuelve a la página anterior (el panel de admin)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
        <h1 className="text-xl font-bold">Editor de Prompts</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            Volver sin guardar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSaveAndReturn}>
            <Save />
            Guardar y Volver
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4">
        <Textarea
          placeholder="Escribe aquí tu prompt..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full resize-none text-lg bg-gray-800 border-gray-700"
        />
      </main>
    </div>
  )
}