"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { ToastType } from "@/components/ui/Toast"

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toasts: Toast[]
    notify: (message: string, type: ToastType) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const notify = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { id, message, type }

        setToasts((prev) => [...prev, newToast])

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            removeToast(id)
        }, 3000)
    }, [removeToast])

    return (
        <ToastContext.Provider value={{ toasts, notify, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
