"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    HelpCircle,
    Terminal,
    Sparkles,
    Save,
    Moon,
    SortAsc,
    Copy,
    Edit3
} from "lucide-react"

interface HelpModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function HelpModal({ isOpen, onOpenChange }: HelpModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                        <HelpCircle className="text-blue-500" /> Guía de Uso Dev-Caddy
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8 max-w-2xl mx-auto">

                        {/* Intro */}
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Tu Asistente de Desarrollo Personal
                            </h2>
                            <p className="text-gray-400">
                                Organiza comandos y prompts de IA en un solo lugar. 100% Local.
                            </p>
                        </div>

                        {/* Section 1: Commands */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-green-400 border-b border-gray-800 pb-2">
                                <Terminal className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Comandos (CLI)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Copy className="w-4 h-4 text-blue-400" />}
                                    title="Copiar Rápido"
                                    desc="Haz clic en cualquier tarjeta para copiar el comando al portapapeles instantáneamente."
                                />
                                <InfoCard
                                    icon={<SortAsc className="w-4 h-4 text-orange-400" />}
                                    title="Organización LIFO"
                                    desc="Los comandos nuevos siempre aparecen arriba para un acceso inmediato."
                                />
                            </div>
                        </section>

                        {/* Section 2: Prompts */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-purple-400 border-b border-gray-800 pb-2">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-bold text-lg">AI Prompts (Killer Feature)</h3>
                            </div>
                            <p className="text-gray-300 text-sm">
                                Dev-Caddy detecta automáticamente variables en tus prompts usando la sintaxis <code className="bg-gray-800 px-1 py-0.5 rounded text-yellow-300">{`{variable}`}</code>.
                            </p>
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Ejemplo</p>
                                <code className="block bg-black/50 p-3 rounded text-sm text-gray-300 font-mono mb-3">
                                    Escribe un artículo de blog sobre <span className="text-yellow-400">{`{Tema}`}</span> con tono <span className="text-yellow-400">{`{Tono}`}</span>.
                                </code>
                                <p className="text-sm text-gray-400">
                                    Al crear este prompt, aparecerán automáticamente campos de texto para "Tema" y "Tono" en la tarjeta. ¡Rellénalos y copia el resultado final!
                                </p>
                            </div>
                        </section>

                        {/* Section 3: Data Management */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 border-b border-gray-800 pb-2">
                                <Save className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Gestión de Datos</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-blue-500/10 p-2 rounded-lg mt-1">
                                        <Save className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">100% Local (LocalStorage)</h4>
                                        <p className="text-sm text-gray-400">Tus datos nunca salen de tu navegador. Sin bases de datos, sin login.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-green-500/10 p-2 rounded-lg mt-1">
                                        <Edit3 className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Backup Importar/Exportar</h4>
                                        <p className="text-sm text-gray-400">
                                            Usa el modo "Edición" (candado en la sidebar) para exportar tus datos a JSON. ¡Haz copias de seguridad regularmente!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Tips */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-yellow-400 border-b border-gray-800 pb-2">
                                <Moon className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Pro Tips</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="text-yellow-500">★</span>
                                    Usa <strong>Ctrl+K</strong> para abrir la búsqueda global instantáneamente.
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-yellow-500">★</span>
                                    Arrastra categorías y comandos en <strong>Modo Edición</strong> para reordenarlos.
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-yellow-500">★</span>
                                    Haz clic en el icono del candado <LockIcon className="w-3 h-3 inline" /> para desbloquear la gestión completa.
                                </li>
                            </ul>
                        </section>

                    </div>
                </ScrollArea>

                <DialogFooter className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <DialogClose asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                            ¡A trabajar!
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-200">
                {icon}
                {title}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    )
}
