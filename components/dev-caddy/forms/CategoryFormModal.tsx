"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

// Form schema for category creation/editing
const categoryFormSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    icon: z.string().min(1, "El icono es requerido").max(5, "Usa un solo emoji o texto corto"),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: Partial<Category>) => void
    onDelete?: (id: string) => void
    initialData?: Category | null
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialData,
}: CategoryFormModalProps) {
    const isEditMode = !!initialData

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            icon: "",
        },
    })

    // Reset form when initialData changes or when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    icon: initialData.icon,
                })
            } else {
                form.reset({
                    name: "",
                    icon: "",
                })
            }
        }
    }, [isOpen, initialData, form])

    const handleSubmit = (data: CategoryFormValues) => {
        onSave({
            ...initialData,
            name: data.name,
            icon: data.icon,
        })
        onClose()
    }

    const handleDelete = () => {
        if (initialData?.id && onDelete) {
            if (window.confirm("Borrar esta categoría eliminará todos sus comandos. ¿Estás seguro?")) {
                onDelete(initialData.id)
                onClose()
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEditMode ? "Editar" : "Nueva"} Categoría
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isEditMode
                            ? "Modifica los detalles de la categoría"
                            : "Crea una nueva categoría para organizar tus comandos"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ej: Backend, Producción..."
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Icono</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ej: 🚀, 💻, 🛠️..."
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white text-xl w-16 text-center"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex justify-between sm:justify-between w-full">
                            {isEditMode && onDelete ? (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="bg-red-900/50 hover:bg-red-900 text-red-200 hover:text-red-100 border border-red-800"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                </Button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="hover:bg-gray-800 text-gray-300"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isEditMode ? "Guardar" : "Crear"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
