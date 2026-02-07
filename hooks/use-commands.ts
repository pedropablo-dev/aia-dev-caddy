"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { AppData } from "@/types"

export function useCommands() {
    const [data, setData] = useState<AppData>({ categories: [], commands: {} })
    const [isLoading, setIsLoading] = useState(true)
    const [hasMounted, setHasMounted] = useState(false)

    // --- Auto-Backup Logic ---
    const saveAutoBackup = useCallback((data: AppData) => {
        try {
            localStorage.setItem('dev-caddy-backup-auto', JSON.stringify(data))
            console.log('🔒 Auto-backup saved to localStorage')
        } catch (error) {
            console.error('Failed to save auto-backup:', error)
            // No mostramos toast para no interrumpir al usuario
        }
    }, [])

    // --- Data Fetching Logic ---
    const fetchData = useCallback(async () => {
        if (!isLoading) setIsLoading(true)
        try {
            const response = await fetch("/api/commands")
            if (!response.ok) {
                toast.error(`Error loading data: ${response.status}`)
                throw new Error(`API call failed with status: ${response.status}`)
            }

            const jsonData: AppData = await response.json()

            // Auto-add missing order properties
            let needsSave = false
            jsonData.categories.forEach((cat, index) => {
                if (cat.order === undefined) {
                    cat.order = index
                    needsSave = true
                }
            })

            for (const categoryId in jsonData.commands) {
                jsonData.commands[categoryId].forEach((cmd, index) => {
                    if (cmd.order === undefined) {
                        cmd.order = index
                        needsSave = true
                    }
                })
            }

            setData(jsonData)

            // Auto-save if we added order properties
            if (needsSave) {
                await saveData(jsonData, false)
            }
        } catch (error) {
            console.error("Error loading commands:", error)
            toast.error("Error cargando comandos")
        } finally {
            setIsLoading(false)
        }
    }, [isLoading])

    // --- Data Saving Logic ---
    const saveData = useCallback(async (newData: AppData, shouldUpdate = true) => {
        try {
            const response = await fetch("/api/commands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            })

            // 🔒 Check if validation failed (400) or server error (500)
            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.message || "Error al guardar los datos"

                // Show validation errors if available
                if (errorData.errors) {
                    console.error("Validation errors:", errorData.errors)
                    toast.error(`${errorMessage}. Revisa los datos.`)
                } else {
                    toast.error(errorMessage)
                }
                return
            }

            // ✅ Guardado exitoso en API/disco
            if (shouldUpdate) {
                setData(newData)
            }

            // 🔒 Auto-backup a localStorage
            saveAutoBackup(newData)
        } catch (error) {
            console.error("Error saving data:", error)
            toast.error("Error de conexión al guardar los datos.")
        }
    }, [saveAutoBackup])

    // --- Toggle Favorite Logic ---
    const toggleFavorite = useCallback(
        (commandId: string) => {
            const newData = JSON.parse(JSON.stringify(data)) as AppData // Deep clone
            for (const categoryId in newData.commands) {
                const cmd = newData.commands[categoryId].find((c) => c.id === commandId)
                if (cmd) {
                    cmd.isFavorite = !cmd.isFavorite
                    // Feedback visual
                    toast.success(cmd.isFavorite ? "Añadido a favoritos" : "Quitado de favoritos")
                    break
                }
            }
            saveData(newData)
        },
        [data, saveData]
    )

    // --- Import Data Logic ---
    const importData = useCallback(async (newData: AppData) => {
        try {
            await saveData(newData, true)
            toast.success("Backup restaurado correctamente")
        } catch (error) {
            console.error("Error importing data:", error)
            toast.error("Error al importar el backup")
        }
    }, [saveData])

    // --- Usage Analytics Logic ---
    const incrementUsage = useCallback(
        (commandId: string) => {
            const newData = JSON.parse(JSON.stringify(data)) as AppData // Deep clone
            for (const categoryId in newData.commands) {
                const cmd = newData.commands[categoryId].find((c) => c.id === commandId)
                if (cmd) {
                    cmd.copyCount = (cmd.copyCount || 0) + 1
                    break
                }
            }
            saveData(newData)
        },
        [data, saveData]
    )

    const resetUsage = useCallback(
        (commandId: string) => {
            const newData = JSON.parse(JSON.stringify(data)) as AppData // Deep clone
            for (const categoryId in newData.commands) {
                const cmd = newData.commands[categoryId].find((c) => c.id === commandId)
                if (cmd) {
                    cmd.copyCount = 0
                    break
                }
            }
            saveData(newData)
        },
        [data, saveData]
    )

    // --- Initial Load ---
    useEffect(() => {
        setHasMounted(true)
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        data,
        isLoading,
        hasMounted,
        fetchData,
        saveData,
        toggleFavorite,
        importData,
        incrementUsage,
        resetUsage,
        refreshCommands: fetchData,  // Expose for manual refresh (e.g., after import)
    }
}
