"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommandCard } from "./CommandCard"
import { EmptyState } from "./empty-state"
import type { Command } from "@/types"

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
}: CommandListProps) {
    const selectedRef = useRef<HTMLDivElement>(null)

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
        <ScrollArea className="flex-1">
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
                        />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
