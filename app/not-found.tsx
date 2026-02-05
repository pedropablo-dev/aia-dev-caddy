import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
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
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-yellow-500 to-orange-300 bg-clip-text text-transparent">
                        404
                    </h1>

                    <h2 className="text-2xl font-semibold text-white">
                        Página no encontrada
                    </h2>

                    <p className="text-gray-400 text-lg">
                        La página que buscas no existe o ha sido movida.
                    </p>
                </div>

                <Link href="/">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 gap-2"
                        size="lg"
                    >
                        <Home className="w-5 h-5" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>
        </div>
    )
}
