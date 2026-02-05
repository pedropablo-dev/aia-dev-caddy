"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Command } from "@/types"

interface SortableCommandItemProps {
    command: Command
    onEdit: () => void
    onDelete: () => void
    onDuplicate: () => void
}

export function SortableCommandItem({
    command,
    onEdit,
    onDelete,
    onDuplicate,
}: SortableCommandItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `cmd-${command.id}` })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as 'relative',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 p-2 bg-gray-800 rounded-md"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
            >
                <GripVertical size={16} className="text-gray-400" />
            </div>

            {/* Command Info */}
            <div className="flex flex-col overflow-hidden min-w-0">
                <span className="font-semibold text-sm truncate">{command.label}</span>
                <span className="text-xs text-gray-400 font-mono truncate">{command.command}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDuplicate()
                    }}
                >
                    <Copy size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }}
                >
                    <Pencil size={16} />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    )
}
