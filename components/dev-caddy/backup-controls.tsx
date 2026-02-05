"use client"

import { useRef } from "react"
import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { AppData } from "@/types"

interface BackupControlsProps {
    data: AppData
    onImport: (data: AppData) => void
}

export function BackupControls({ data, onImport }: BackupControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Export logic: Download JSON backup
    const handleExport = () => {
        const dateStr = new Date().toISOString().split('T')[0]
        const filename = `dev-caddy-backup-${dateStr}.json`

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("Backup descargado correctamente")
    }

    // Import logic: Upload and restore JSON backup
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const parsedData = JSON.parse(text)

                // Validate structure
                if (!parsedData.categories || !parsedData.commands) {
                    toast.error("Archivo de backup inválido: falta estructura requerida")
                    return
                }

                // Additional validation
                if (!Array.isArray(parsedData.categories)) {
                    toast.error("Archivo de backup inválido: 'categories' debe ser un array")
                    return
                }

                if (typeof parsedData.commands !== 'object') {
                    toast.error("Archivo de backup inválido: 'commands' debe ser un objeto")
                    return
                }

                onImport(parsedData as AppData)
            } catch (error) {
                console.error("Error parsing backup file:", error)
                toast.error("Error al leer el archivo: formato JSON inválido")
            }
        }

        reader.onerror = () => {
            toast.error("Error al leer el archivo")
        }

        reader.readAsText(file)

        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
                <Download className="w-4 h-4" />
                Exportar Backup
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
            />

            <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
                <Upload className="w-4 h-4" />
                Importar Backup
            </Button>
        </div>
    )
}
