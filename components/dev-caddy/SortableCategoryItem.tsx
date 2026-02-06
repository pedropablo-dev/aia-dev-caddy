"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category } from "@/types"

interface SortableCategoryItemProps {
    category: Category
    isSelected: boolean
    isEditMode: boolean
    isCollapsed: boolean
    onSelect: (categoryId: string) => void
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
}

export function SortableCategoryItem({
    category,
    isSelected,
    isEditMode,
    isCollapsed,
    onSelect,
    onEdit,
    onDelete,
}: SortableCategoryItemProps) {
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
                } ${isCollapsed ? "justify-center" : ""}`}
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
                className="flex items-center gap-3 flex-1 text-left min-w-0"
            >
                <span className="text-lg flex-shrink-0">{category.icon}</span>
                <span className={`font-medium whitespace-nowrap truncate ${contentClasses}`}>
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
                            className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                        >
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (window.confirm("¿Estás seguro de borrar esta categoría?")) {
                                    onDelete(category.id)
                                }
                            }}
                            className="text-red-400 hover:bg-gray-800 cursor-pointer"
                        >
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}
