'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Sidebar() {
  const router = useRouter(); const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const isActive = (path: string) => pathname?.startsWith(path)

  const sections = [
    { title: 'Principal', items: [
      { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { icon: 'users', label: 'Producteurs', path: '/dashboard/planteurs' },
      { icon: 'box', label: 'Produits', path: '/dashboard/produits' },
    ]},
    { title: 'Commercial', items: [
      { icon: 'cart', label: 'Ventes', path: '/dashboard/ventes' },
      { icon: 'truck', label: 'Achats', path: '/dashboard/achats' },
      { icon: 'file', label: 'Factures', path: '/dashboard/factures' },
    ]},
    { title: 'Finance', items: [
      { icon: 'wallet', label: 'Caisse', path: '/dashboard/caisse' },
      { icon: 'calculator', label: 'Comptabilité', path: '/dashboard/accounting' },
      { icon: 'coins', label: 'Crédits', path: '/dashboard/credits' },
    ]},
    { title: 'Opérations', items: [
      { icon: 'leaf', label: 'Campagnes', path: '/dashboard/campagnes' },
      { icon: 'map-pin', label: 'Logistique', path: '/dashboard/logistique' },
      { icon: 'chart', label: 'Analytics', path: '/dashboard/analytics' },
    ]},
    { title: 'Social & Qualité', items: [
      { icon: 'calendar', label: 'Réunions', path: '/dashboard/reunions' },
      { icon: 'award', label: 'Certifications', path: '/dashboard/certifications' },
      { icon: 'heart', label: 'Mutuelle', path: '/dashboard/mutuelle' },
      { icon: 'star', label: 'Fidélité', path: '/dashboard/loyalty' },
    ]},
    { title: 'Administration', items: [
      { icon: 'shield', label: 'Rôles', path: '/dashboard/roles' },
      { icon: 'settings', label: 'Paramètres', path: '/dashboard/parametres' },
      { icon: 'download', label: 'Exports', path: '/dashboard/exports' },
      { icon: 'bell', label: 'Notifications', path: '/dashboard/notifications' },
    ]},
  ]

  return (
    <aside style={{ width: collapsed ? 56 : 230, minHeight: '100vh', backgroundColor: 'white', borderRight: '1px solid #E8E8E8', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 200, display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', transition: 'width 0.3s' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: 34, height: 34, borderRadius: 8 }} />
        {!collapsed && <div style={{ marginTop: 8 }}><h1 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Synchro ERP</h1><p style={{ fontSize: 9, color: '#CC5500', margin: 0, fontStyle: 'italic' }}>Plus qu&apos;un ERP, un Partenaire</p></div>}
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: 4 }}>
            {!collapsed && <div style={{ padding: '4px 18px 2px', fontSize: 8, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>{section.title}</div>}
            {section.items.map((item) => (
              <button key={item.path} onClick={() => router.push(item.path)} style={{ width: '100%', padding: collapsed ? '8px 0' : '10px 18px', textAlign: collapsed ? 'center' : 'left', backgroundColor: isActive(item.path) ? '#FFF5F0' : 'transparent', border: 'none', cursor: 'pointer', color: isActive(item.path) ? '#CC5500' : '#555', fontSize: 13, fontWeight: isActive(item.path) ? 600 : 400, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}>
                <Image src={`/icons/${item.icon}.svg`} alt="" width={18} height={18} style={{ opacity: isActive(item.path) ? 1 : 0.5 }} />
                {!collapsed && item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: 10, borderTop: '1px solid #F0F0F0', textAlign: 'center' }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: 6, background: '#FAFAFA', border: '1px solid #E8E8E8', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>☰</button>
        {!collapsed && <p style={{ fontSize: 8, color: '#CCC', margin: '6px 0 0' }}>© 2026 • Manawa Techs</p>}
      </div>
    </aside>
  )
}
