"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
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
    name: z.string().min(1, "El nombre de la categoría es requerido"),
    icon: z.string().min(1, "El icono es requerido"),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormSheetProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CategoryFormValues) => void
    initialData?: Pick<Category, "name" | "icon"> | null
}

export function CategoryFormSheet({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
}: CategoryFormSheetProps) {
    const isEditMode = !!initialData

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            icon: "",
        },
    })

    // Reset form when initialData changes or when sheet opens/closes
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
        onSubmit(data)
        form.reset()
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-white">
                        {isEditMode ? "Editar" : "Nueva"} Categoría
                    </SheetTitle>
                    <SheetDescription className="text-gray-400">
                        {isEditMode
                            ? "Modifica los datos de la categoría"
                            : "Crea una nueva categoría para organizar tus comandos"}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6 py-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">
                                        Nombre de la Categoría
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ej: Desarrollo, DevOps, Git..."
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
                                    <FormLabel className="text-gray-200">
                                        Icono (Emoji)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ej: ⚡️, 🚀, 📦, 🔧..."
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white text-2xl text-center"
                                            maxLength={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter>
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
                                {isEditMode ? "Guardar Cambios" : "Crear Categoría"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
