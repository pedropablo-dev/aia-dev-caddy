"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to console for debugging
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="Dev-Caddy Logo"
                        width={64}
                        height={64}
                        className="opacity-50"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-center">
                        <AlertTriangle className="w-16 h-16 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Algo ha salido mal
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Lo sentimos, ha ocurrido un error inesperado. Intenta recargar la página.
                    </p>

                    {process.env.NODE_ENV === "development" && error.message && (
                        <div className="mt-4 p-4 bg-gray-900 border border-red-900 rounded-lg text-left">
                            <p className="text-sm text-red-400 font-mono break-words">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={reset}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                        size="lg"
                    >
                        Intentar de nuevo
                    </Button>

                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </div>
    )
}
