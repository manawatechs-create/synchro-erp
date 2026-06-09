import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synchro ERP | Gestion Coopérative',
  description: 'Synchro ERP - Solution de gestion pour coopératives agricoles. Construit par Manawa Techs © 2026.',
  icons: { icon: '/favicon.png' },
}

export const viewport: Viewport = {
  themeColor: '#CC5500',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
