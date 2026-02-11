"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import type { AppData } from "@/types"
import { useHistory } from "./use-history"

export function useCommands() {
    // 1. Integración de useHistory
    const {
        state: data,
        set: updateHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        clear
    } = useHistory<AppData>({ categories: [], commands: {} })

    const [isLoading, setIsLoading] = useState(true)
    const [isInitialized, setIsInitialized] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)
    const ignoreNextSave = useRef(false)

    // --- Auto-Backup Logic (Local) ---
    const saveAutoBackup = useCallback((data: AppData) => {
        try {
            localStorage.setItem('dev-caddy-backup-auto', JSON.stringify(data))
            // console.log('🔒 Auto-backup saved to localStorage') // Verbose
        } catch (error) {
            console.error('Failed to save auto-backup:', error)
        }
    }, [])

    // --- API Save Logic (Internal) ---
    const persistToApi = useCallback(async (dataToSave: AppData) => {
        try {
            const response = await fetch("/api/commands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.message || "Error al guardar los datos"
                if (errorData.errors) {
                    console.error("Validation errors:", errorData.errors)
                    toast.error(`${errorMessage}. Revisa los datos.`)
                } else {
                    toast.error(errorMessage)
                }
            } else {
                // Silent success to avoid toast spam on debounce
            }
        } catch (error) {
            console.error("Error saving data:", error)
            toast.error("Error de conexión al guardar los datos.")
        }
    }, [])

    // --- Debounced Save Effect ---
    useEffect(() => {
        if (!hasMounted || !isInitialized) return

        if (ignoreNextSave.current) {
            ignoreNextSave.current = false
            return
        }

        // 1. Backup local inmediato (Safety net)
        saveAutoBackup(data)

        // 2. Persistencia en servidor con Debounce
        const timer = setTimeout(() => {
            persistToApi(data)
        }, 1000)

        return () => clearTimeout(timer)
    }, [data, hasMounted, isInitialized, persistToApi, saveAutoBackup])

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

            // Si no hay cambios estructurales, evitar que el efecto guarde de nuevo
            if (!needsSave) {
                ignoreNextSave.current = true
            }

            // Inicializamos el historial (borra el stack anterior)
            clear(jsonData)
            setIsInitialized(true)

        } catch (error) {
            console.error("Error loading commands:", error)
            toast.error("Error cargando comandos")
            setIsInitialized(false)
        } finally {
            setIsLoading(false)
        }
    }, [isLoading, clear])

    // --- Data Saving Logic (Adapter) ---
    // Mantiene compatibilidad con la firma anterior pero delega en useHistory
    const saveData = useCallback(async (newData: AppData) => {
        updateHistory(newData)
    }, [updateHistory])

    // --- Toggle Favorite Logic ---
    const toggleFavorite = useCallback(
        (commandId: string) => {
            const newData = JSON.parse(JSON.stringify(data)) as AppData // Deep clone
            for (const categoryId in newData.commands) {
                const cmd = newData.commands[categoryId].find((c) => c.id === commandId)
                if (cmd) {
                    cmd.isFavorite = !cmd.isFavorite
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
            // Al importar, queremos que se guarde, así que usamos saveData normal
            await saveData(newData)
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
        refreshCommands: fetchData,
        // New History API
        undo,
        redo,
        canUndo,
        canRedo
    }
}
