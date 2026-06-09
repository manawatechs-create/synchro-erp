'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  const menu = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '👨‍🌾', label: 'Producteurs', path: '/dashboard/planteurs' },
    { icon: '📦', label: 'Produits', path: '/dashboard/produits' },
    { icon: '💰', label: 'Ventes', path: '/dashboard/ventes' },
    { icon: '🛒', label: 'Achats', path: '/dashboard/achats' },
    { icon: '💵', label: 'Caisse', path: '/dashboard/caisse' },
    { icon: '🧾', label: 'Factures', path: '/dashboard/factures' },
    { icon: '💳', label: 'Comptabilité', path: '/dashboard/accounting' },
    { icon: '🏦', label: 'Crédits', path: '/dashboard/credits' },
    { icon: '🌾', label: 'Campagnes', path: '/dashboard/campagnes' },
    { icon: '📋', label: 'Réunions', path: '/dashboard/reunions' },
    { icon: '⚙️', label: 'Paramètres', path: '/dashboard/parametres' },
  ]

  return (
    <aside style={{
      width: '230px', minHeight: '100vh', backgroundColor: 'white',
      borderRight: '1px solid #E8E8E8', position: 'fixed', left: 0, top: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }}
        onClick={() => router.push('/dashboard')}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {menu.map((item) => (
          <button key={item.path} onClick={() => router.push(item.path)} style={{
            width: '100%', padding: '10px 20px', textAlign: 'left',
            background: isActive(item.path) ? '#FFF5F0' : 'transparent',
            border: 'none', cursor: 'pointer',
            color: isActive(item.path) ? '#CC5500' : '#555',
            fontSize: '13px', fontWeight: isActive(item.path) ? '600' : '400',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '12px', borderTop: '1px solid #F0F0F0', textAlign: 'center', fontSize: '9px', color: '#CCC' }}>
        © 2026 Manawa Techs
      </div>
    </aside>
  )
}
