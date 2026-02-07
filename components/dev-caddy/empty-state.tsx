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
                {searchQuery ? "Ningún resultado" : "No hay nada en esta categoría"}
            </h3>

            <p className="text-gray-500 mb-6 max-w-md">
                {searchQuery
                    ? `No encuentro nada para "${searchQuery}". Prueba con otra cosa o borra la búsqueda actual.`
                    : "Empieza añadiendo un comando o un prompt pulsando en el botón azul con un +"
                }
            </p>

            {searchQuery && onClearSearch && (
                <Button
                    onClick={onClearSearch}
                    variant="outline"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                    Limpiar búsqueda
                </Button>
            )}
        </div>
    )
}
