"use client"

import { useMemo } from "react"
import { Copy, Check, Sparkles } from "lucide-react"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Command } from "@/types"

interface PromptCardProps {
    command: Command
    isCopied: boolean
    variableValues: Record<string, string>
    onCopy: (commandId: string, content: string) => void
    onVariableChange: (key: string, value: string) => void
}

export function PromptCard({
    command: cmd,
    isCopied,
    variableValues,
    onCopy,
    onVariableChange,
}: PromptCardProps) {
    // 1. Detect variables in prompt content
    const promptVariables = useMemo(() => {
        const regex = /{([^}]+)}/g
        const vars = new Set<string>()
        let match
        while ((match = regex.exec(cmd.command)) !== null) {
            vars.add(match[1])
        }
        return Array.from(vars)
    }, [cmd.command])

    // 2. Helper to get processed content with substituted values
    const getProcessedContent = () => {
        let content = cmd.command
        promptVariables.forEach((v) => {
            const val = variableValues[`${cmd.id}_${v}`] || ""
            content = content.replace(new RegExp(`{${v}}`, "g"), val)
        })
        return content
    }

    return (
        <>
            <Highlight
                theme={themes.vsDark}
                code={cmd.command}
                language="markdown"
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className="p-4 rounded-md text-sm border border-gray-700 whitespace-pre-wrap break-words max-w-full line-clamp-3 mb-4"
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

            {/* Render detected variables inputs */}
            {promptVariables.length > 0 && (
                <div className="grid gap-2 mb-4">
                    {promptVariables.map((varName) => (
                        <div key={varName} className="flex items-center">
                            <div className="bg-gray-800 text-purple-400 px-3 py-2 rounded-l-md border border-r-0 border-gray-700 font-mono text-sm">
                                {`{${varName}}`}
                            </div>
                            <Input
                                placeholder={`Valor para ${varName}...`}
                                value={variableValues[`${cmd.id}_${varName}`] || ""}
                                onChange={(e) =>
                                    onVariableChange(`${cmd.id}_${varName}`, e.target.value)
                                }
                                className="bg-gray-900 border-gray-700 focus:border-blue-500 text-white rounded-l-none"
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button
                size="sm"
                onClick={() => onCopy(cmd.id, getProcessedContent())}
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
    )
}
