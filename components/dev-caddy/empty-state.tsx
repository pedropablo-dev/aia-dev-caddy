"use client"

import { SearchX, Command } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    searchQuery?: string
    onClearSearch?: () => void
}

export function EmptyState({ searchQuery, onClearSearch }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
            <div className="mb-6">
                {searchQuery ? (
                    <SearchX className="w-16 h-16 text-gray-600" />
                ) : (
                    <Command className="w-16 h-16 text-gray-600" />
                )}
            </div>

            <h3 className="text-xl font-bold text-gray-300 mb-2">
                {searchQuery ? "No commands found" : "No commands yet"}
            </h3>

            <p className="text-gray-500 mb-6 max-w-md">
                {searchQuery
                    ? `No results for "${searchQuery}". Try searching for something else or clear your search.`
                    : "Get started by adding your first command in the admin panel."
                }
            </p>

            {searchQuery && onClearSearch && (
                <Button
                    onClick={onClearSearch}
                    variant="outline"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                    Clear Search
                </Button>
            )}
        </div>
    )
}
