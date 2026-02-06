"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Lock, Unlock } from "lucide-react"
import { useAppStore } from "@/store/appStore"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"

interface CategorySpotlightProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
}

export function CategorySpotlight({ isOpen, onClose, categories }: CategorySpotlightProps) {
    const { selectedCategory, setSelectedCategory, isEditMode, toggleEditMode } = useAppStore()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCategories = searchQuery
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : categories

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId)
        onClose()
        setSearchQuery("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Navegar Categorías</span>
                        <button
                            onClick={onClose}
                            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar categorías..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                            autoFocus
                        />
                    </div>

                    {/* Edit Mode Toggle */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
                        <Label htmlFor="spotlight-edit-mode" className="flex items-center gap-2 text-sm font-semibold text-gray-200 cursor-pointer">
                            {isEditMode ? (
                                <Unlock className="h-4 w-4 text-green-400" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span>Modo Edición</span>
                        </Label>
                        <Switch
                            id="spotlight-edit-mode"
                            checked={isEditMode}
                            onCheckedChange={toggleEditMode}
                            className="data-[state=checked]:bg-green-600"
                        />
                    </div>

                    {/* Categories List */}
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-1 pr-4">
                            {filteredCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                                        selectedCategory === category.id
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:bg-gray-800"
                                    )}
                                >
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="font-medium text-lg">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-800">
                        Presiona <kbd className="px-2 py-1 bg-gray-800 rounded">Cmd+K</kbd> para abrir este menú
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
