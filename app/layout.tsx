import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dev-Caddy',
  description: 'Tu arsenal de comandos personal para un acceso ultrarrápido.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased" style={{ backgroundColor: '#0a0a0a', color: '#fafafa' }}>{children}</body>
    </html>
  )
}