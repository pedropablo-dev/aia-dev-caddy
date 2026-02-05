"use client"

import {
    Copy,
    Check,
    Play,
    Terminal,
    Sparkles,
    Star,
} from "lucide-react"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
}: CommandCardProps) {
    return (
        <Card className={`bg-gray-900 border-gray-800 transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
            }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
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
                    </CardTitle>
                </div>
                <div>
                    {cmd.type === "prompt" && (
                        <Badge variant="secondary" className="bg-yellow-900 text-yellow-200 hover:bg-yellow-900/80">
                            Prompt
                        </Badge>
                    )}
                    {cmd.type === "command" &&
                        (!cmd.variables || cmd.variables.length === 0) && (
                            <Button
                                size="sm"
                                onClick={() => onCopy(cmd.id, cmd.command)}
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
                    <>
                        <Highlight
                            theme={themes.vsDark}
                            code={cmd.command}
                            language="markdown"
                        >
                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                <pre
                                    className="p-4 rounded-md text-sm border border-gray-700 whitespace-pre-wrap break-words max-w-full"
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
                            size="sm"
                            onClick={() => onCopy(cmd.id, cmd.command)}
                            className="bg-yellow-600 hover:bg-yellow-700 active:scale-95 transition-transform"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                            <span className="ml-2">Copy Prompt</span>
                        </Button>
                    </>
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
                                    className="p-3 rounded-md overflow-x-auto text-sm border border-gray-700 max-w-full"
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
                            onClick={() => onWorkflowStep(cmd.id, cmd.steps || [])}
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
                                    className="p-3 rounded-md overflow-x-auto text-sm border border-gray-700 max-w-full"
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
                                        <Input
                                            key={varName}
                                            placeholder={varPlaceholder}
                                            value={variableValues[`${cmd.id}_${varName}`] || ""}
                                            onChange={(e) =>
                                                onVariableChange(`${cmd.id}_${varName}`, e.target.value)
                                            }
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                                        />
                                    );
                                })}
                                <Button
                                    size="sm"
                                    onClick={() => onCopy(cmd.id, cmd.command, cmd.variables)}
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
    );
}
