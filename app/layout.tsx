import type { Metadata, Viewport } from 'next'
import { AppProvider } from '@/context/AppContext'
import InitData from '@/services/initData'
import PWAInstall from '@/components/ui/PWAInstall'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synchro ERP | Solution de Gestion pour Coopératives Agricoles',
  description: 'Synchro ERP - Plateforme SaaS de gestion intégrée pour coopératives agricoles. Digitalisez vos opérations : producteurs, ventes, finances, logistique. Fonctionne hors-ligne. Construit par Manawa Techs © 2026.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'Manawa Techs', url: 'https://manawatechs.com' }],
  keywords: [
    'ERP agricole', 'gestion coopérative', 'coopérative agricole', 
    'gestion planteurs', 'logiciel agricole', 'PWA agricole',
    'gestion coopérative villageoise', 'Synchro ERP', 'Manawa Techs',
    'solution coopérative', 'digitalisation agricole', 'Burkina Faso'
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Synchro ERP',
  },
  openGraph: {
    title: 'Synchro ERP - Solution de Gestion pour Coopératives Agricoles',
    description: 'Plateforme SaaS complète pour digitaliser votre coopérative agricole. Producteurs, ventes, finances, logistique.',
    type: 'website',
    locale: 'fr_FR',
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
        <meta name="msapplication-TileImage" content="/favicon.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <AppProvider>
          <InitData />
          {children}
          <PWAInstall />
        </AppProvider>
      </body>
    </html>
  )
}
