"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommandCard } from "./CommandCard"
import { EmptyState } from "./empty-state"
import type { Command } from "@/types"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"

interface CommandListProps {
    commands: Command[];
    selectedIndex: number;
    searchQuery: string;
    onClearSearch: () => void;
    copiedCommand: string | null;
    variableValues: Record<string, string>;
    workflowStep: Record<string, number>;
    onCopyCommand: (commandId: string, baseCommand: string, variables?: any[]) => void;
    onWorkflowStep: (commandId: string, steps: string[]) => void;
    onToggleFavorite: (commandId: string) => void;
    onVariableChange: (key: string, value: string) => void;
    onEdit?: (command: Command) => void;
    onDelete?: (commandId: string) => void;
    onDuplicate?: (command: Command) => void;
    onReorder?: (newOrder: Command[]) => void;
}

export function CommandList({
    commands,
    selectedIndex,
    searchQuery,
    onClearSearch,
    copiedCommand,
    variableValues,
    workflowStep,
    onCopyCommand,
    onWorkflowStep,
    onToggleFavorite,
    onVariableChange,
    onEdit,
    onDelete,
    onDuplicate,
    onReorder,
}: CommandListProps) {
    const selectedRef = useRef<HTMLDivElement>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id && onReorder) {
            const oldIndex = commands.findIndex((cmd) => cmd.id === active.id)
            const newIndex = commands.findIndex((cmd) => cmd.id === over?.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(commands, oldIndex, newIndex)
                onReorder(newOrder)
            }
        }
    }

    // Auto-scroll to selected item
    useEffect(() => {
        selectedRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        })
    }, [selectedIndex])

    // Show empty state if no commands
    if (commands.length === 0) {
        return <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <ScrollArea className="flex-1">
                <SortableContext
                    items={commands}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="p-6 space-y-4">
                        {commands.map((cmd, index) => (
                            <div
                                key={cmd.id}
                                ref={index === selectedIndex ? selectedRef : null}
                            >
                                <CommandCard
                                    command={cmd}
                                    isActive={index === selectedIndex}
                                    isCopied={copiedCommand === cmd.id}
                                    variableValues={variableValues}
                                    currentStep={workflowStep[cmd.id] || 0}
                                    onCopy={onCopyCommand}
                                    onWorkflowStep={onWorkflowStep}
                                    onToggleFavorite={onToggleFavorite}
                                    onVariableChange={onVariableChange}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onDuplicate={onDuplicate}
                                />
                            </div>
                        ))}
                    </div>
                </SortableContext>
            </ScrollArea>
        </DndContext>
    );
}
