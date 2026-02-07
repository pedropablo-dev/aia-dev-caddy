"use client"

import {
    Copy,
    Check,
    Play,
    Terminal,
    Sparkles,
    Star,
    Pencil,
    Trash2,
    Files,
    GripVertical,
    Flame,
    RotateCcw,
} from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/appStore"
import { PromptCard } from "./PromptCard"
import type { Command } from "@/types"

interface CommandCardProps {
    command: Command;
    isActive?: boolean;
    isCopied: boolean;
    variableValues: Record<string, string>;
    currentStep: number;
    onCopy: (commandId: string, baseCommand: string, variables?: any[]) => void;
    onWorkflowStep: (commandId: string, steps: string[]) => void;
    onToggleFavorite: (commandId: string) => void;
    onVariableChange: (key: string, value: string) => void;
    onEdit?: (command: Command) => void;
    onDelete?: (commandId: string) => void;
    onDuplicate?: (command: Command) => void;
    // Analytics props
    incrementUsage: (commandId: string) => void;
    resetUsage: (commandId: string) => void;
    onNavigateCategory: (categoryId: string) => void;
    viewMode: "default" | "favorites";
}

export function CommandCard({
    command: cmd,
    isActive = false,
    isCopied,
    variableValues,
    currentStep,
    onCopy,
    onWorkflowStep,
    onToggleFavorite,
    onVariableChange,
    onEdit,
    onDelete,
    onDuplicate,
    incrementUsage,
    resetUsage,
    onNavigateCategory,
    viewMode,
}: CommandCardProps) {
    const { isEditMode } = useAppStore();

    // dnd-kit hook
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cmd.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // Prevent scrolling while dragging on touch devices
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className={`bg-gray-900 border-gray-800 transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
                }`}>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-3">
                        {/* Drag Handle - Only in Edit Mode AND NOT in Favorites */}
                        {isEditMode && viewMode !== 'favorites' && (
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-gray-800"
                            >
                                <GripVertical className="h-5 w-5" />
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-yellow-400"
                            onClick={() => onToggleFavorite(cmd.id)}
                        >
                            <Star
                                className={`transition-all ${cmd.isFavorite ? "text-yellow-400 fill-yellow-400" : ""
                                    }`}
                            />
                        </Button>
                        <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                            {cmd.type === "workflow" ? (
                                <Play className="w-4 h-4 text-purple-400" />
                            ) : cmd.type === "prompt" ? (
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                            ) : (
                                <Terminal className="w-4 h-4 text-blue-400" />
                            )}
                            {cmd.label}
                            {/* Category origin badge (clickeable for navigation) */}
                            {cmd.categoryName && (
                                <Badge
                                    variant="outline"
                                    className={`ml-2 text-xs border-gray-600 text-gray-400 ${viewMode === 'favorites' ? 'cursor-pointer hover:bg-gray-700 hover:underline' : ''
                                        }`}
                                    onClick={(e) => {
                                        if (viewMode === 'favorites' && cmd.categoryId) {
                                            e.stopPropagation();
                                            onNavigateCategory(cmd.categoryId);
                                        }
                                    }}
                                >
                                    {cmd.categoryName}
                                </Badge>
                            )}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Analytics UI (Favorites Mode) */}
                        {viewMode === 'favorites' && (
                            <div className="flex items-center gap-2 mr-2">
                                {/* Usage Counter */}
                                <div className="flex items-center gap-1 text-orange-400">
                                    <Flame className="h-4 w-4" />
                                    <span className="text-sm font-mono">{cmd.copyCount || 0}</span>
                                </div>
                                {/* Reset Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-500 hover:text-gray-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetUsage(cmd.id);
                                    }}
                                    title="Resetear contador"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {/* Edit Mode Actions (Hidden in Favorites) */}
                        {isEditMode && viewMode !== 'favorites' && (
                            <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                                {onEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(cmd);
                                        }}
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(cmd.id);
                                        }}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDuplicate && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDuplicate(cmd);
                                        }}
                                        title="Duplicar"
                                    >
                                        <Files className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                        {/* View Mode Actions */}
                        {cmd.type === "prompt" && (
                            <Badge variant="secondary" className="bg-yellow-900 text-yellow-200 hover:bg-yellow-900/80">
                                Prompt
                            </Badge>
                        )}
                        {cmd.type === "command" &&
                            (!cmd.variables || cmd.variables.length === 0) && (
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        onCopy(cmd.id, cmd.command);
                                        incrementUsage(cmd.id);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
                                >
                                    {isCopied ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    <span className="ml-2">Copy</span>
                                </Button>
                            )}
                        {cmd.type === "command" &&
                            cmd.variables &&
                            cmd.variables.length > 0 && (
                                <Badge variant="secondary" className="bg-green-900 text-green-200 hover:bg-green-900/80">
                                    Con Variables
                                </Badge>
                            )}
                        {cmd.type === "workflow" && (
                            <Badge variant="secondary" className="bg-purple-900 text-purple-200 hover:bg-purple-900/80">
                                Workflow
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    {cmd.type === "prompt" ? (
                        <PromptCard
                            command={cmd}
                            isCopied={isCopied}
                            variableValues={variableValues}
                            onCopy={(id, content) => {
                                onCopy(id, content);
                                incrementUsage(id);
                            }}
                            onVariableChange={onVariableChange}
                        />
                    ) : cmd.type === "workflow" ? (
                        <div className="space-y-3">
                            <div className="text-sm text-gray-400">
                                Step {currentStep + 1} of {cmd.steps?.length}
                            </div>
                            <Highlight
                                theme={themes.vsDark}
                                code={cmd.steps?.[currentStep] || ""}
                                language="bash"
                            >
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre
                                        className="p-3 rounded-md overflow-x-auto text-sm border border-gray-700 max-w-full line-clamp-3"
                                        style={style}
                                    >
                                        {tokens.map((line, i) => (
                                            <div key={i} {...getLineProps({ line })}>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                )}
                            </Highlight>
                            <Button
                                onClick={() => {
                                    onWorkflowStep(cmd.id, cmd.steps || []);
                                    incrementUsage(cmd.id);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition-transform"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Step & Next
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Highlight
                                theme={themes.vsDark}
                                code={cmd.command}
                                language="bash"
                            >
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre
                                        className="p-3 rounded-md overflow-x-auto text-sm border border-gray-700 max-w-full line-clamp-3"
                                        style={style}
                                    >
                                        {tokens.map((line, i) => (
                                            <div key={i} {...getLineProps({ line })}>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                )}
                            </Highlight>
                            {cmd.variables && (
                                <div className="grid gap-2 mt-4">
                                    {cmd.variables.map((variable) => {
                                        // Handle both formats: object with name/placeholder or string
                                        const varName = typeof variable === 'string' ? variable : variable.name;
                                        const varPlaceholder = typeof variable === 'string' ? variable : variable.placeholder;

                                        return (
                                            <div key={varName} className="flex items-center">
                                                <div className="bg-gray-800 text-blue-400 px-3 py-2 rounded-l-md border border-r-0 border-gray-700 font-mono text-sm">
                                                    {`{${varName}}`}
                                                </div>
                                                <Input
                                                    placeholder={varPlaceholder}
                                                    value={variableValues[`${cmd.id}_${varName}`] || ""}
                                                    onChange={(e) =>
                                                        onVariableChange(`${cmd.id}_${varName}`, e.target.value)
                                                    }
                                                    className="bg-gray-900 border-gray-700 focus:border-blue-500 text-white rounded-l-none"
                                                />
                                            </div>
                                        );
                                    })}
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            onCopy(cmd.id, cmd.command, cmd.variables);
                                            incrementUsage(cmd.id);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 active:scale-95 transition-transform w-fit"
                                    >
                                        {isCopied ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        <span className="ml-2">Copy</span>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
