"use client"

import { useState } from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoreVertical, Copy, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface SortableCategoryItemProps {
    category: Category
    isSelected: boolean
    isEditMode: boolean
    isCollapsed: boolean
    onSelect: (categoryId: string) => void
    onEdit: (category: Category) => void
    onDuplicate: (category: Category) => void
    onDelete: (id: string) => void
}

export function SortableCategoryItem({
    category,
    isSelected,
    isEditMode,
    isCollapsed,
    onSelect,
    onEdit,
    onDuplicate,
    onDelete,
}: SortableCategoryItemProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
    }

    const contentClasses = isCollapsed ? "hidden" : ""

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group ${isSelected
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
                } ${isCollapsed ? "justify-center" : ""}min-w-0`}
        >
            {/* Drag Handle - Only in Edit Mode and Not Collapsed */}
            {isEditMode && !isCollapsed && (
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-gray-700/50 -ml-1 mr-2 flex-shrink-0"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}

            <button
                onClick={() => onSelect(category.id)}
                className="flex items-center gap-3 flex-1 text-left w-0 min-w-0"
            >
                <span className="text-lg flex-shrink-0">{category.icon}</span>
                <span className={`font-medium truncate flex-1 ${contentClasses}`}>
                    {category.name}
                </span>
            </button>

            {/* Dropdown Menu (Edit Mode Only, Not Collapsed) */}
            {isEditMode && !isCollapsed && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="bg-gray-900 border-gray-700"
                    >
                        <DropdownMenuItem
                            onClick={() => onEdit(category)}
                            className="text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                        >
                            <Pencil className="h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDuplicate(category)}
                            className="text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setDeleteDialogOpen(true)}
                            className="text-red-400 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(category.id)
                                setDeleteDialogOpen(false)
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
