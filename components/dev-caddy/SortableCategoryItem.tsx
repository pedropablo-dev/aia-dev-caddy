"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

interface SortableCategoryItemProps {
    category: Category
    isSelected: boolean
    onSelect: () => void
    onEdit: () => void
    onDelete: () => void
}

export function SortableCategoryItem({
    category,
    isSelected,
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
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-2 rounded-md cursor-pointer ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                }`}
            onClick={onSelect}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
            >
                <GripVertical size={16} className="text-gray-400" />
            </div>

            {/* Category Info */}
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium truncate">{category.name}</span>
            </div>

            {/* Edit Button */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                }}
            >
                <Pencil size={16} />
            </Button>

            {/* Delete Button (visible when selected) */}
            {isSelected && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 size={16} />
                </Button>
            )}
        </div>
    )
}
