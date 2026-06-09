'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const isActive = (path: string) => pathname?.startsWith(path)

  const mainNav = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/planteurs', label: 'Planteurs', icon: '👨‍🌾' },
    { path: '/dashboard/produits', label: 'Produits', icon: '📦' },
    { path: '/dashboard/ventes', label: 'Ventes', icon: '💰' },
    { path: '/dashboard/achats', label: 'Achats', icon: '🛒' },
  ]

  const secondaryNav = [
    { path: '/dashboard/factures', label: 'Factures', icon: '🧾' },
    { path: '/dashboard/accounting', label: 'Comptabilité', icon: '💳' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  ]

  const tertiaryNav = [
    { path: '/dashboard/ai-assistant', label: 'IA', icon: '🤖' },
    { path: '/dashboard/calendar', label: 'Calendrier', icon: '📅' },
    { path: '/dashboard/documents', label: 'Docs', icon: '📸' },
    { path: '/dashboard/loyalty', label: 'Fidélité', icon: '🏆' },
  ]

  const NavButton = ({ path, label, icon }: { path: string; label: string; icon: string }) => (
    <button onClick={() => router.push(path)} style={{
      display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', height: '38px',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
      fontWeight: isActive(path) ? '600' : '400', whiteSpace: 'nowrap',
      backgroundColor: isActive(path) ? '#FFF5F0' : 'transparent',
      color: isActive(path) ? '#CC5500' : '#666666',
      transition: 'all 0.15s ease', fontFamily: 'system-ui, sans-serif',
      borderBottom: isActive(path) ? '2px solid #CC5500' : '2px solid transparent',
      borderRadius: '8px 8px 0 0',
    }}
    onMouseEnter={(e) => { if (!isActive(path)) { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#333' } }}
    onMouseLeave={(e) => { if (!isActive(path)) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666' } }}
    >
      <span style={{ fontSize: '15px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : '#FFFFFF',
      backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E8E8',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.3s ease', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #CC5500, #A34400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(204,85,0,0.25)' }}>🌱</div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Coopérative Villageoise</h1>
            <p style={{ fontSize: '10px', color: '#CC5500', margin: 0, fontWeight: '600', letterSpacing: '1px' }}>GESTION DES PLANTEURS</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#666' }}>{user?.prenom} {user?.nom}</span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#FAFAFA', border: '1px solid #E8E8E8', cursor: 'pointer', color: '#999', fontSize: '12px', fontWeight: '500' }}>🚪</button>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #F0F0F0', maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '44px', display: 'flex', alignItems: 'center', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {mainNav.map((item) => <NavButton key={item.path} {...item} />)}
        <div style={{ width: '1px', height: '20px', backgroundColor: '#E8E8E8', margin: '0 8px', flexShrink: 0 }} />
        {secondaryNav.map((item) => <NavButton key={item.path} {...item} />)}
        <div style={{ width: '1px', height: '20px', backgroundColor: '#E8E8E8', margin: '0 8px', flexShrink: 0 }} />
        {tertiaryNav.map((item) => <NavButton key={item.path} {...item} />)}
        <div style={{ flex: 1 }} />
        <NavButton path="/dashboard/notifications" label="Notifs" icon="🔔" />
      </div>
    </nav>
  )
}
