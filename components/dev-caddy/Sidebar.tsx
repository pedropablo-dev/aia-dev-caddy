"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import {
    Plus,
    MoreVertical,
    X,
    Search,
    PanelLeftClose,
    Lock,
    Unlock,
    Download,
    Upload,
    RotateCcw,
    RotateCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUIStore } from "@/store/uiStore"
import { useAppStore } from "@/store/appStore"
import { useCommands } from "@/hooks/use-commands"
import { toast } from "sonner"
import type { Category, AppData } from "@/types"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableCategoryItem } from "./SortableCategoryItem"

interface SidebarProps {
    categories: Category[];
    data: AppData; // Added for Export
    onCreateCategory: () => void;
    onEditCategory: (category: Category) => void;
    onDuplicateCategory?: (category: Category) => void;
    onDeleteCategory?: (id: string) => void;
    onReorderCategories?: (newOrder: Category[]) => void;
    onImport: (info: AppData) => Promise<void>; // Added for Import
    // Undo/Redo props
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}



export function Sidebar({
    categories,
    data,
    onCreateCategory,
    onEditCategory,
    onDuplicateCategory,
    onDeleteCategory,
    onReorderCategories,
    onImport,
    undo,
    redo,
    canUndo,
    canRedo
}: SidebarProps) {
    const { selectedCategory, setSelectedCategory, isEditMode, toggleEditMode } = useAppStore();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();
    // useCommands removed to fix state isolation
    const [categorySearch, setCategorySearch] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id && onReorderCategories) {
            // NOTE: We only reorder the non-favorites categories
            // The logic implies 'categories' prop passed here includes favorites at index 0
            // But SortableContext should only wrap the reorderable ones.

            // However, to keep it simple, we will assume 'categories' prop contains everything,
            // but we only pass the reorderable subset to SortableContext.

            const oldIndex = categories.findIndex((cat) => cat.id === active.id)
            const newIndex = categories.findIndex((cat) => cat.id === over?.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                // Determine the new full order
                // Note: 'categories' currently has Favorites at [0] usually.
                // We should be careful not to move things before Favorites if it is present.

                const newOrder = arrayMove(categories, oldIndex, newIndex)

                // Remove Favorites/Others that shouldn't be persisted if logic requires, 
                // but handleReorderCategories in page.tsx expects the full list or handles it.
                // Let's pass the full new order and let page.tsx decide what to save.

                // Actually, page.tsx logic (which we will write) will likely filter out favorites before saving.
                // Or we send only the user categories.

                // Let's stick to sending the modified array.
                onReorderCategories(newOrder)
            }
        }
    }

    const filteredCategories = categorySearch
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
        : categories;

    const sidebarClasses = isSidebarCollapsed ? "w-20" : "w-80";
    const contentClasses = isSidebarCollapsed ? "hidden" : "";

    // Export handler - downloads JSON backup
    const handleExport = () => {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        const filename = `dev-caddy-backup-${dateString}.json`;

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Datos exportados correctamente');
    };

    // Import handler - restores from JSON backup
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);

                // Validate schema - must have commands object
                if (!parsedData || typeof parsedData !== 'object' || !parsedData.commands) {
                    toast.error('Archivo inválido: formato de datos incorrecto');
                    return;
                }

                // Restore data using parent handler (updates page state)
                await onImport(parsedData);

                // Success feedback handled by parent or here if needed
                // refreshCommands() is no longer needed as parent state update triggers re-render
            } catch (error) {
                toast.error('Error al leer el archivo: JSON malformado');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);

        // Reset input so same file can be selected again
        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className={`transition-all duration-300 ${sidebarClasses} bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-x-hidden`}>
            <div className="p-4 border-b border-gray-800">
                <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <Image
                        src="/logo.png"
                        alt="Dev-Caddy Logo"
                        width={32}
                        height={32}
                        className="flex-shrink-0"
                    />
                    <h1 className={`text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-300 bg-clip-text text-transparent whitespace-nowrap ${contentClasses}`}>
                        AIA Dev-Caddy
                    </h1>
                </div>



                {!isSidebarCollapsed && (
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar categorías..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="pl-10 pr-8 bg-gray-800 border-gray-700 focus:border-blue-500"
                        />
                        {categorySearch && (
                            <button
                                onClick={() => setCategorySearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Categories Header and Favorites - Outside ScrollArea */}
            <div className="p-2">
                {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between mb-3 px-3">
                        <h3 className="text-sm font-bold text-gray-400">
                            Categorías
                        </h3>
                        {/* Add Category Button (Edit Mode Only) */}
                        {isEditMode && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-800 flex-shrink-0"
                                onClick={onCreateCategory}
                                title="Nueva categoría"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Render Favorites (Fixed) - Outside ScrollArea */}
                <div className="space-y-1">
                    {filteredCategories.filter(c => c.id === 'favorites').map(category => (
                        <div
                            key={category.id}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group ${selectedCategory === category.id
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                                } ${isSidebarCollapsed ? 'justify-center' : ''} min-w-0`}
                        >
                            <button
                                onClick={() => setSelectedCategory(category.id)}
                                className="flex items-center gap-3 flex-1 text-left w-0 min-w-0"
                            >
                                <span className="text-lg flex-shrink-0">{category.icon}</span>
                                <span className={`font-medium truncate flex-1 ${contentClasses}`}>
                                    {category.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ScrollArea only for dynamic categories */}
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredCategories.filter(c => c.id !== 'favorites')}
                            strategy={verticalListSortingStrategy}
                        >
                            {filteredCategories.filter(c => c.id !== 'favorites').map((category) => (
                                <SortableCategoryItem
                                    key={category.id}
                                    category={category}
                                    isSelected={selectedCategory === category.id}
                                    isEditMode={isEditMode}
                                    isCollapsed={isSidebarCollapsed}
                                    onSelect={setSelectedCategory}
                                    onEdit={onEditCategory}
                                    onDuplicate={(cat) => onDuplicateCategory?.(cat)}
                                    onDelete={(id) => onDeleteCategory?.(id)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </ScrollArea>

            <div className="p-2 border-t border-gray-800 flex flex-col gap-2">
                {/* Hidden file input for import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />

                {/* Undo / Redo Buttons */}
                {!isSidebarCollapsed && (
                    <div className="flex gap-2">
                        <Button
                            onClick={undo}
                            disabled={!canUndo}
                            variant="ghost"
                            className={`flex-1 gap-2 border border-gray-800 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed`}
                            size="sm"
                            title="Deshacer (Ctrl+Z)"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Deshacer</span>
                        </Button>
                        <Button
                            onClick={redo}
                            disabled={!canRedo}
                            variant="ghost"
                            className={`flex-1 gap-2 border border-gray-800 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed`}
                            size="sm"
                            title="Rehacer (Ctrl+Y)"
                        >
                            <RotateCw className="h-4 w-4" />
                            <span>Rehacer</span>
                        </Button>
                    </div>
                )}

                {/* Import/Export Buttons - Only in Edit Mode */}
                {isEditMode && !isSidebarCollapsed && (
                    <>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleExport}
                                variant="outline"
                                className="flex-1 gap-2 text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                                size="sm"
                            >
                                <Upload className="h-4 w-4" />
                                Exportar
                            </Button>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="flex-1 gap-2 text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                                size="sm"
                            >
                                <Download className="h-4 w-4" />
                                Importar
                            </Button>
                        </div>
                        <hr className="border-gray-700" />
                    </>
                )}

                {/* Edit Mode Toggle */}
                <div className={`flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-800/50 border border-gray-700 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isSidebarCollapsed && (
                        <Label htmlFor="edit-mode-toggle" className="flex items-center gap-2 text-sm font-semibold text-gray-200 cursor-pointer">
                            {isEditMode ? (
                                <Unlock className="h-4 w-4 text-green-400" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span>Modo Edición</span>
                        </Label>
                    )}
                    <Switch
                        id="edit-mode-toggle"
                        checked={isEditMode}
                        onCheckedChange={toggleEditMode}
                        className="data-[state=checked]:bg-green-600"
                    />
                </div>

                <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                    className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                >
                    <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
                    <span className={`font-bold text-sm ${contentClasses}`}>
                        Colapsar
                    </span>
                </Button>
            </div>
        </div>
    );
}
