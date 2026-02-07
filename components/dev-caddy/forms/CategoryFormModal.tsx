"use client"

import { useEffect, useState } from "react"
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

    const handleDelete = () => {
        if (initialData?.id && onDelete) {
            setDeleteDialogOpen(true)
        }
    }

    const confirmDelete = () => {
        if (initialData?.id && onDelete) {
            onDelete(initialData.id)
            onClose()
            setDeleteDialogOpen(false)
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Borrar esta categoría eliminará todos sus comandos. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    )
}
