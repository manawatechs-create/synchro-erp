import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Connexion | Coopérative Villageoise',
}

export const viewport: Viewport = {
  themeColor: '#CC5500',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
