"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    X, Save, Bold, Italic, Code, List, Heading1, Heading2, Heading3, Heading4,
    Pilcrow, Minus, PanelRightClose, PanelRightOpen, Underline, SquareCode, ListTodo,
    Maximize, Minimize, Copy, ChevronUp, ChevronDown, Search, ClipboardPaste
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Command } from "@/types"

interface EditorOverlayProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Command
    onSave: (updatedCommand: Command) => void
    categoryId: string
}

export function EditorOverlay({
    isOpen,
    onClose,
    initialData,
    onSave,
    categoryId,
}: EditorOverlayProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [label, setLabel] = useState("")
    const [text, setText] = useState("")
    const [maxChars, setMaxChars] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [variables, setVariables] = useState<string[]>([])
    const [newVariable, setNewVariable] = useState("")
    const [isVariablesPanelOpen, setIsVariablesPanelOpen] = useState(false)
    const [isZenMode, setIsZenMode] = useState(false)

    const [searchTerm, setSearchTerm] = useState("")
    const [searchMatches, setSearchMatches] = useState<number[]>([])
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)

    // Initialize from initialData prop
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setLabel(initialData.label || "")
                setText(initialData.command || "")
                setVariables((initialData.variables as string[]) || [])
            } else {
                // New command
                setLabel("")
                setText("")
                setVariables([])
            }
            setMaxChars(null)
            setIsVariablesPanelOpen(false)
            setIsZenMode(false)
            setSearchTerm("")
            setSearchMatches([])
            setCurrentMatchIndex(-1)
        }
    }, [isOpen, initialData])

    // Search logic
    useEffect(() => {
        if (searchTerm && text) {
            const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi')
            const matches = [...text.matchAll(regex)].map(match => match.index!)
            setSearchMatches(matches)
        } else {
            setSearchMatches([])
        }
        setCurrentMatchIndex(-1)
    }, [searchTerm, text])

    const focusOnMatch = (index: number) => {
        const textarea = textareaRef.current
        if (textarea && searchMatches[index] !== undefined) {
            const matchPos = searchMatches[index]
            textarea.focus()
            textarea.setSelectionRange(matchPos, matchPos + searchTerm.length)

            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
            const lines = text.substring(0, matchPos).match(/\n/g)?.length || 0
            textarea.scrollTop = lines * lineHeight
        }
    }

    const handleInitialSearch = () => {
        if (searchMatches.length > 0) {
            setCurrentMatchIndex(0)
            focusOnMatch(0)
        }
    }

    const navigateSearch = (direction: 'next' | 'prev') => {
        if (searchMatches.length === 0) return

        let nextIndex
        if (direction === 'next') {
            nextIndex = (currentMatchIndex + 1) % searchMatches.length
        } else {
            nextIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length
        }
        setCurrentMatchIndex(nextIndex)
        focusOnMatch(nextIndex)
    }

    // Escape key to exit Zen Mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isZenMode) {
                setIsZenMode(false)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isZenMode])

    const handleAddVariable = () => {
        if (newVariable && !variables.includes(newVariable)) {
            const formattedVariable = `{${newVariable.replace(/[{}]/g, "")}}`
            setVariables([...variables, formattedVariable])
            setNewVariable("")
        }
    }

    const handleRemoveVariable = (variableToRemove: string) => {
        setVariables(variables.filter(v => v !== variableToRemove))
    }

    const handleInsertVariable = (variable: string) => {
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newText = text.substring(0, start) + variable + text.substring(end)
        setText(newText)
        textarea.focus()
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + variable.length
        }, 0)
    }

    const applyFormat = (format: 'bold' | 'italic' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'hr' | 'link' | 'image' | 'list-ul' | 'list-ol' | 'list-todo' | 'underline' | 'code-block') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = text.substring(start, end)

        let prefix = ''
        let suffix = ''

        switch (format) {
            case 'bold': prefix = '**'; suffix = '**'; break
            case 'italic': prefix = '*'; suffix = '*'; break
            case 'underline': prefix = '<u>'; suffix = '</u>'; break
            case 'code': prefix = '`'; suffix = '`'; break
            case 'code-block': prefix = '```\n'; suffix = '\n```'; break
            case 'h1': prefix = '# '; break
            case 'h2': prefix = '## '; break
            case 'h3': prefix = '### '; break
            case 'h4': prefix = '#### '; break
            case 'blockquote': prefix = '> '; break
            case 'hr':
                setText(`${text.substring(0, start)}\n---\n${text.substring(end)}`)
                return
            case 'link':
                const url = prompt("Introduce la URL del enlace:", "https://")
                if (!url) return
                prefix = `[${selectedText || 'texto del enlace'}](${url})`
                break
            case 'image':
                const imageUrl = prompt("Introduce la URL de la imagen:", "https://")
                if (!imageUrl) return
                prefix = `![${selectedText || 'alt text'}](${imageUrl})`
                break
            case 'list-ul':
            case 'list-ol':
            case 'list-todo':
                let marker
                if (format === 'list-ul') marker = '- '
                else if (format === 'list-ol') marker = '1. '
                else marker = '- [ ] '

                const lines = selectedText.split('\n')
                const newLines = lines.map((line, index) => `${format === 'list-ol' ? `${index + 1}. ` : marker}${line}`)
                setText(text.substring(0, start) + newLines.join('\n') + text.substring(end))
                return
        }

        const newText = `${text.substring(0, start)}${prefix}${selectedText || ''}${suffix}${text.substring(end)}`
        setText(newText)
        textarea.focus()
        setTimeout(() => {
            if (format === 'link' || format === 'image') {
                textarea.selectionStart = textarea.selectionEnd = start + prefix.length
            } else {
                textarea.selectionStart = start + prefix.length
                textarea.selectionEnd = end + prefix.length
            }
        }, 0)
    }

    const handleSave = async () => {
        if (!label) {
            setIsAlertOpen(true)
            return
        }

        setIsSaving(true)
        try {
            // Fetch current data
            const res = await fetch("/api/commands")
            const currentData = await res.json()
            const commandsForCategory = [...(currentData.commands[categoryId] || [])]

            let savedCommand: Command

            if (initialData && initialData.id) {
                // Edit mode
                const cmdIndex = commandsForCategory.findIndex(c => c.id === initialData.id)
                if (cmdIndex !== -1) {
                    savedCommand = {
                        ...commandsForCategory[cmdIndex],
                        label,
                        command: text,
                        variables,
                    }
                    commandsForCategory[cmdIndex] = savedCommand
                } else {
                    throw new Error("Command not found")
                }
            } else {
                // Create mode
                savedCommand = {
                    id: `cmd-${Date.now()}`,
                    label,
                    command: text,
                    type: "prompt",
                    order: commandsForCategory.length,
                    isFavorite: false,
                    variables,
                }
                commandsForCategory.push(savedCommand)
            }

            const newData = {
                ...currentData,
                commands: {
                    ...currentData.commands,
                    [categoryId]: commandsForCategory,
                },
            }

            await fetch("/api/commands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            })

            toast.success("¡Prompt guardado correctamente!")
            onSave(savedCommand)
            onClose()
        } catch (error) {
            console.error("Failed to save prompt:", error)
            toast.error("Error al guardar el prompt.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(text)
        toast.success("Contenido copiado al portapapeles")
    }

    const handlePasteFromClipboard = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText()
            const textarea = textareaRef.current
            if (!textarea) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newText = text.substring(0, start) + clipboardText + text.substring(end)
            setText(newText)
            textarea.focus()
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + clipboardText.length
            }, 0)
        } catch (err) {
            toast.error("No se pudo pegar el contenido.")
            console.error('Failed to read clipboard contents: ', err)
        }
    }

    const currentChars = text.length
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const hasExceeded = maxChars !== null && currentChars > maxChars

    if (!isOpen) return null

    return (
        <>
            <div className={cn(
                "fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm",
                "animate-in fade-in duration-200",
                isZenMode && "is-zen"
            )}>
                {isZenMode && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-gray-700 hover:opacity-90 fixed top-4 right-4 z-50"
                        onClick={() => setIsZenMode(false)}
                    >
                        <Minimize size={18} />
                    </Button>
                )}

                <header className={cn("p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10", isZenMode && "hidden")}>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <h1 className="text-xl font-bold whitespace-nowrap text-white">
                            {initialData ? 'Editando Prompt' : 'Nuevo Prompt'}
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start">
                            <Button variant="outline" className="gap-2 bg-gray-700 hover:opacity-90 text-white" onClick={onClose}>
                                <X size={18} />
                                Cancelar
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSave} disabled={isSaving}>
                                <Save size={18} />
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-gray-700 hover:opacity-90" onClick={handleCopyToClipboard} title="Copiar Prompt">
                                <Copy size={18} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-gray-700 hover:opacity-90" onClick={handlePasteFromClipboard} title="Pegar desde portapapeles">
                                <ClipboardPaste size={18} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-gray-700 hover:opacity-90" onClick={() => setIsVariablesPanelOpen(!isVariablesPanelOpen)} title={isVariablesPanelOpen ? "Ocultar Panel" : "Mostrar Panel"}>
                                {isVariablesPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-gray-700 hover:opacity-90" onClick={() => setIsZenMode(true)} title="Modo Zen">
                                <Maximize size={18} />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className={cn(
                    "flex-1 p-4 w-full min-h-0",
                    isZenMode
                        ? "p-0 max-w-full"
                        : `grid gap-4 max-w-7xl mx-auto ${isVariablesPanelOpen ? "grid-cols-1 md:grid-cols-[1fr_300px]" : "grid-cols-1"}`
                )}>
                    <div className={cn("flex flex-col gap-4 min-h-0", isZenMode && "h-full p-4")}>
                        <div className={cn(isZenMode && "hidden")}>
                            <label htmlFor="prompt-label" className="text-base font-bold text-gray-400 mb-2 block">Label del Prompt</label>
                            <Input id="prompt-label" placeholder="Escribe aquí el título para tu prompt..." value={label} onChange={(e) => setLabel(e.target.value)} className="w-full text-lg bg-gray-800 border-gray-700 focus:border-blue-500 text-white" />
                        </div>
                        <div className={cn("flex-1 flex flex-col min-h-0", isZenMode && "h-full")}>
                            <div className={cn("flex justify-between items-center mb-2", isZenMode && "hidden")}>
                                <label htmlFor="prompt-content" className="text-base font-bold text-gray-400">Contenido del Prompt</label>
                                <div className="flex items-center gap-1 border border-gray-700 rounded-md p-1 flex-wrap">
                                    <Button variant="ghost" size="icon" title="Negrita" className="h-7 w-7" onClick={() => applyFormat('bold')}><Bold size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Cursiva" className="h-7 w-7" onClick={() => applyFormat('italic')}><Italic size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Subrayado" className="h-7 w-7" onClick={() => applyFormat('underline')}><Underline size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Título 1" className="h-7 w-7" onClick={() => applyFormat('h1')}><Heading1 size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Título 2" className="h-7 w-7" onClick={() => applyFormat('h2')}><Heading2 size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Título 3" className="h-7 w-7" onClick={() => applyFormat('h3')}><Heading3 size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Código" className="h-7 w-7" onClick={() => applyFormat('code')}><Code size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Bloque de Código" className="h-7 w-7" onClick={() => applyFormat('code-block')}><SquareCode size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Cita" className="h-7 w-7" onClick={() => applyFormat('blockquote')}><Pilcrow size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Lista de Tareas" className="h-7 w-7" onClick={() => applyFormat('list-todo')}><ListTodo size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Lista" className="h-7 w-7" onClick={() => applyFormat('list-ul')}><List size={16} /></Button>
                                    <Button variant="ghost" size="icon" title="Línea Horizontal" className="h-7 w-7" onClick={() => applyFormat('hr')}><Minus size={16} /></Button>
                                </div>
                            </div>
                            <Textarea id="prompt-content" ref={textareaRef} placeholder="Escribe aquí tu prompt..." value={text} onChange={(e) => setText(e.target.value)} className={cn("w-full h-full flex-1 resize-none text-base bg-gray-800 border-gray-700 focus:border-blue-500 custom-scrollbar text-white", isZenMode && "!text-lg rounded-none border-none")} />
                            <div className={cn("flex items-center justify-between mt-2 text-sm text-gray-400", isZenMode && "hidden")}>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="max-chars">Límite:</label>
                                        <Input id="max-chars" type="number" placeholder="Opcional" className="w-32 h-8 bg-gray-800 border-gray-700 text-white" value={maxChars ?? ''} onChange={(e) => setMaxChars(e.target.value ? parseInt(e.target.value, 10) : null)} />
                                    </div>
                                    <div className={cn("font-mono", hasExceeded && "text-red-500 font-bold")}>
                                        {maxChars !== null ? `${currentChars} / ${maxChars}` : currentChars} Caracteres
                                    </div>
                                </div>
                                <div className="font-mono">{wordCount} Palabras</div>
                            </div>
                        </div>
                    </div>
                    <div className={cn("flex-col gap-4 bg-gray-950/50 p-4 rounded-lg border border-gray-800 min-h-0", isVariablesPanelOpen ? "flex" : "hidden", isZenMode && "!hidden")}>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-2">Buscador</h3>
                            <div className="flex gap-1">
                                <div className="relative flex-1">
                                    <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleInitialSearch()} className="bg-gray-800 border-gray-700 h-9 text-white" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={handleInitialSearch} disabled={searchMatches.length === 0}><Search size={18} /></Button>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400">{searchTerm && (searchMatches.length > 0 ? `${currentMatchIndex === -1 ? 0 : currentMatchIndex + 1} de ${searchMatches.length}` : "No hay resultados")}</span>
                                <div className="flex">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateSearch('prev')} disabled={searchMatches.length === 0}><ChevronUp /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateSearch('next')} disabled={searchMatches.length === 0}><ChevronDown /></Button>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-white mt-4">Variables Dinámicas</h3>
                        <div className="flex gap-2">
                            <Input placeholder="Nombre variable..." value={newVariable} onChange={(e) => setNewVariable(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddVariable()} className="bg-gray-800 border-gray-700 text-white" />
                            <Button onClick={handleAddVariable} className="bg-gray-700 hover:bg-gray-600">Añadir</Button>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                            <p className="text-xs text-gray-500">Haz clic en una variable para insertarla en el prompt.</p>
                            {variables.map(v => (
                                <Badge key={v} variant="secondary" className="flex justify-between items-center p-2 text-base font-mono cursor-pointer bg-purple-900/50 border-purple-700 text-purple-200 hover:bg-purple-900/80" onClick={() => handleInsertVariable(v)}>
                                    {v}
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveVariable(v); }} className="ml-2 rounded-full hover:bg-white/20 p-0.5">
                                        <X size={14} />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Label Requerido</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            El prompt debe tener un label.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setIsAlertOpen(false)}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Entendido
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
