"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
    Settings,
    HelpCircle,
    PanelLeftClose,
    Search,
    Lock,
    Unlock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import ReactMarkdown, { Components } from "react-markdown"
import { useUIStore } from "@/store/uiStore"
import { useAppStore } from "@/store/appStore"
import type { Category } from "@/types"

interface SidebarProps {
    categories: Category[];
    helpContent: string;
}

const markdownComponents: Components = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-blue-400 mt-6 mb-2" {...props} />,
    hr: ({ ...props }) => <hr className="my-4 border-gray-700" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 pl-4" {...props} />,
    li: ({ ...props }) => <li className="text-gray-300" {...props} />,
    p: ({ ...props }) => <p className="text-gray-300 mb-4" {...props} />,
    strong: ({ ...props }) => <strong className="font-semibold text-gray-200" {...props} />,
    code: ({ ...props }) => <code className="bg-gray-800 text-purple-300 font-mono rounded-md px-1.5 py-0.5 text-sm" {...props} />
}

export function Sidebar({ categories, helpContent }: SidebarProps) {
    const { selectedCategory, setSelectedCategory, isEditMode, toggleEditMode } = useAppStore();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();
    const [categorySearch, setCategorySearch] = useState("");
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const filteredCategories = categorySearch
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
        : categories;

    const sidebarClasses = isSidebarCollapsed ? "w-20" : "w-80";
    const contentClasses = isSidebarCollapsed ? "hidden" : "";

    return (
        <div className={`transition-all duration-300 ${sidebarClasses} bg-gray-900 border-r border-gray-800 flex flex-col`}>
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
                        broWorks Dev-Caddy
                    </h1>
                </div>

                <div className={`flex items-center mt-3 mb-4 gap-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <Link href="/admin" className="w-full">
                        <Button variant="ghost" className={`w-full gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                            <Settings className="h-5 w-5 flex-shrink-0" />
                            <span className={`font-bold text-sm ${contentClasses}`}>Panel de Administración</span>
                        </Button>
                    </Link>
                </div>

                {!isSidebarCollapsed && (
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar categorías..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 p-2">
                {!isSidebarCollapsed && (
                    <h3 className="text-sm font-bold text-gray-400 mb-3 px-3">
                        Categorías
                    </h3>
                )}
                <div className="space-y-1">
                    {filteredCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedCategory === category.id
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <span className="text-lg">{category.icon}</span>
                            <span className={`font-medium whitespace-nowrap ${contentClasses}`}>
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-2 border-t border-gray-800 flex flex-col gap-2">
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

                <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                        >
                            <HelpCircle className="h-5 w-5 flex-shrink-0" />
                            <span className={`font-bold text-sm ${contentClasses}`}>
                                Ayuda
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <HelpCircle /> Guía de uso
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="prose prose-invert max-w-none w-full">
                                <ReactMarkdown components={markdownComponents}>
                                    {helpContent}
                                </ReactMarkdown>
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                    Entendido
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
