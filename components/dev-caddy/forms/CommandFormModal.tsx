"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PlusCircle, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Command } from "@/types"

// Form schema for command creation/editing
const commandFormSchema = z.object({
    label: z.string().min(1, "El label es requerido"),
    type: z.enum(["simple", "workflow", "variables"], {
        required_error: "Debes seleccionar un tipo",
    }),
    command: z.string(),
    isFavorite: z.boolean().optional(),
    steps: z.array(z.string()).optional(),
    variables: z
        .array(
            z.object({
                name: z.string(),
                placeholder: z.string(),
            })
        )
        .optional(),
})

type CommandFormValues = z.infer<typeof commandFormSchema>

interface CommandFormModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CommandFormValues) => void
    initialData?: Partial<Command> | null
}

export function CommandFormModal({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
}: CommandFormModalProps) {
    const isEditMode = !!initialData

    // Local state for dynamic fields
    const [workflowSteps, setWorkflowSteps] = useState<string[]>([""])
    const [variables, setVariables] = useState<
        { name: string; placeholder: string }[]
    >([{ name: "", placeholder: "" }])

    const form = useForm<CommandFormValues>({
        resolver: zodResolver(commandFormSchema),
        defaultValues: {
            label: "",
            type: "simple",
            command: "",
            isFavorite: false,
            steps: [],
            variables: [],
        },
    })

    const commandType = form.watch("type")

    // Reset form when initialData changes or when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Determine type based on command data
                let type: "simple" | "workflow" | "variables" = "simple"
                if (initialData.type === "workflow") {
                    type = "workflow"
                } else if (initialData.variables && initialData.variables.length > 0) {
                    type = "variables"
                }

                form.reset({
                    label: initialData.label || "",
                    type,
                    command: initialData.command || "",
                    isFavorite: initialData.isFavorite || false,
                    steps: initialData.steps || [],
                    variables: initialData.variables as any || [],
                })

                // Set dynamic fields
                if (initialData.steps) {
                    setWorkflowSteps(initialData.steps.length > 0 ? initialData.steps : [""])
                }
                if (initialData.variables) {
                    setVariables(
                        initialData.variables.length > 0
                            ? (initialData.variables as any)
                            : [{ name: "", placeholder: "" }]
                    )
                }
            } else {
                form.reset({
                    label: "",
                    type: "simple",
                    command: "",
                    isFavorite: false,
                    steps: [],
                    variables: [],
                })
                setWorkflowSteps([""])
                setVariables([{ name: "", placeholder: "" }])
            }
        }
    }, [isOpen, initialData, form])

    const handleSubmit = (data: CommandFormValues) => {
        // Build final command data based on type
        const finalData: CommandFormValues = {
            ...data,
        }

        if (data.type === "workflow") {
            finalData.steps = workflowSteps.filter((s) => s.trim())
            finalData.variables = undefined
        } else if (data.type === "variables") {
            finalData.variables = variables.filter((v) => v.name.trim())
            finalData.steps = undefined
        } else {
            finalData.steps = undefined
            finalData.variables = undefined
        }

        onSubmit(finalData)
        form.reset()
        setWorkflowSteps([""])
        setVariables([{ name: "", placeholder: "" }])
    }

    // Keyboard shortcut: Ctrl+Enter to submit
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                form.handleSubmit(handleSubmit)()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, form, handleSubmit])

    // Workflow step handlers
    const addStep = () => setWorkflowSteps([...workflowSteps, ""])
    const removeStep = (index: number) =>
        setWorkflowSteps(workflowSteps.filter((_, i) => i !== index))
    const updateStep = (index: number, value: string) =>
        setWorkflowSteps(workflowSteps.map((s, i) => (i === index ? value : s)))

    // Variable handlers
    const addVariable = () =>
        setVariables([...variables, { name: "", placeholder: "" }])
    const removeVariable = (index: number) =>
        setVariables(variables.filter((_, i) => i !== index))
    const updateVariable = (
        index: number,
        field: "name" | "placeholder",
        value: string
    ) =>
        setVariables(
            variables.map((v, i) => (i === index ? { ...v, [field]: value } : v))
        )

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEditMode ? "Editar" : "Nuevo"} Comando
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isEditMode
                            ? "Modifica los datos del comando"
                            : "Crea un nuevo comando, workflow o atajo"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Label */}
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ej: Git Push, SSH Connect..."
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type Toggle */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Tipo</FormLabel>
                                    <FormControl>
                                        <ToggleGroup
                                            type="single"
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="w-full justify-start gap-2"
                                            disabled={isEditMode}
                                        >
                                            <ToggleGroupItem
                                                value="simple"
                                                variant="outline"
                                                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200 border-gray-700"
                                            >
                                                Simple
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="workflow"
                                                variant="outline"
                                                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200 border-gray-700"
                                            >
                                                Workflow
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="variables"
                                                variant="outline"
                                                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-700 hover:bg-blue-800/50 hover:text-blue-200 border-gray-700"
                                            >
                                                Con Variables
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Favorite Toggle */}


                        {/* Dynamic fields based on type */}
                        {commandType === "workflow" ? (
                            <div className="space-y-3">
                                <FormLabel className="text-gray-200">
                                    Pasos del Workflow
                                </FormLabel>
                                {workflowSteps.map((step, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            placeholder={`Paso ${idx + 1}`}
                                            value={step}
                                            onChange={(e) => updateStep(idx, e.target.value)}
                                            className="flex-1 font-mono bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => removeStep(idx)}
                                            disabled={workflowSteps.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addStep}
                                    className="gap-2 bg-gray-700 hover:bg-gray-600"
                                    variant="outline"
                                >
                                    <PlusCircle size={16} />
                                    Añadir Paso
                                </Button>
                            </div>
                        ) : commandType === "variables" ? (
                            <div className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="command"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">
                                                Comando con Variables
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ej: ssh {user}@{host}"
                                                    className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormLabel className="text-gray-200">Variables</FormLabel>
                                {variables.map((variable, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            placeholder="Nombre (sin {})"
                                            value={variable.name}
                                            onChange={(e) => updateVariable(idx, "name", e.target.value)}
                                            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                        />
                                        <Input
                                            placeholder="Placeholder"
                                            value={variable.placeholder}
                                            onChange={(e) =>
                                                updateVariable(idx, "placeholder", e.target.value)
                                            }
                                            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => removeVariable(idx)}
                                            disabled={variables.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addVariable}
                                    className="gap-2 bg-gray-700 hover:bg-gray-600"
                                    variant="outline"
                                >
                                    <PlusCircle size={16} />
                                    Añadir Variable
                                </Button>
                            </div>
                        ) : (
                            <FormField
                                control={form.control}
                                name="command"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Comando</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="ej: git push origin main"
                                                className="font-mono bg-gray-800 border-gray-700 focus:border-blue-500 text-white resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isEditMode ? "Guardar Cambios" : "Crear Comando"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
