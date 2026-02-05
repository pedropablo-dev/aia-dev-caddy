"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { CommandCard } from "./CommandCard"
import type { Command } from "@/types"

interface CommandListProps {
    commands: Command[];
    copiedCommand: string | null;
    variableValues: Record<string, string>;
    workflowStep: Record<string, number>;
    onCopyCommand: (commandId: string, baseCommand: string, variables?: any[]) => void;
    onWorkflowStep: (commandId: string, steps: string[]) => void;
    onToggleFavorite: (commandId: string) => void;
    onVariableChange: (key: string, value: string) => void;
}

export function CommandList({
    commands,
    copiedCommand,
    variableValues,
    workflowStep,
    onCopyCommand,
    onWorkflowStep,
    onToggleFavorite,
    onVariableChange,
}: CommandListProps) {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                {commands.map((cmd) => (
                    <CommandCard
                        key={cmd.id}
                        command={cmd}
                        isCopied={copiedCommand === cmd.id}
                        variableValues={variableValues}
                        currentStep={workflowStep[cmd.id] || 0}
                        onCopy={onCopyCommand}
                        onWorkflowStep={onWorkflowStep}
                        onToggleFavorite={onToggleFavorite}
                        onVariableChange={onVariableChange}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}
