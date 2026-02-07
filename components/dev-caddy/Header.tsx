"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    viewMode?: "default" | "favorites";
    favoritesSort?: 'usage' | 'category' | 'alpha';
    onSortChange?: (sort: 'usage' | 'category' | 'alpha') => void;
}

export function Header({
    searchQuery,
    onSearchChange,
    viewMode,
    favoritesSort,
    onSortChange
}: HeaderProps) {
    return (
        <div className="p-6 border-b border-gray-800">
            <div className="flex flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        id="command-search"
                        placeholder="Buscar items o presionar Ctrl+K..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-12 pr-10 h-12 bg-gray-900 border-gray-700 focus:border-blue-500 text-lg w-full"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Favorites Sort Selector */}
                {viewMode === 'favorites' && onSortChange && (
                    <select
                        value={favoritesSort}
                        onChange={(e) => onSortChange(e.target.value as any)}
                        className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-md h-12 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer w-auto min-w-[140px]"
                    >
                        <option value="category">📂 Por Categoría</option>
                        <option value="usage">🔥 Más Usados</option>
                        <option value="alpha">🔤 Alfabético</option>
                    </select>
                )}
            </div>
        </div>
    );
}
