import type { Metadata, Viewport } from 'next'
import { AppProvider } from './context/AppContext'
import PWAInstall from './components/ui/PWAInstall'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synchro ERP | Solution de Gestion pour Coopératives Agricoles',
  description: 'Synchro ERP - Plateforme SaaS de gestion intégrée pour coopératives agricoles. Construit par Manawa Techs © 2026.',
  icons: { icon: '/logo.png' },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Synchro ERP' },
}

export const viewport: Viewport = { themeColor: '#CC5500', width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#CC5500" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <AppProvider>
          {children}
          <PWAInstall />
        </AppProvider>
      </body>
    </html>
  )
}
