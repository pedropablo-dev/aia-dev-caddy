"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
    return (
        <div className="p-6 border-b border-gray-800">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    id="command-search"
                    placeholder="Buscar items o presionar Ctrl+K..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 h-12 bg-gray-900 border-gray-700 focus:border-blue-500 text-lg"
                />
            </div>
        </div>
    );
}
