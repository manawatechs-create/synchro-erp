import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synchro ERP | Solution de Gestion pour Coopératives Agricoles',
  description: 'Synchro ERP - Plateforme SaaS de gestion intégrée pour coopératives agricoles. Construit par Manawa Techs © 2026.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'Manawa Techs' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Synchro ERP',
  },
}

export const viewport: Viewport = {
  themeColor: '#CC5500',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#CC5500" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F8F9FA' }}>
        {children}
      </body>
    </html>
  )
}
