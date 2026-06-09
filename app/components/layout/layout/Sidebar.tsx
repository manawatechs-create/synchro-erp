'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useApp } from '@/context/AppContext'
import { getUserPermissions, hasPermission } from '@/lib/permissions'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { couleurPrincipale } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => { setPermissions(getUserPermissions()) }, [])
  const isActive = (path: string) => pathname?.startsWith(path)

  const menuSections: Record<string, any> = {
    principal: {
      title: 'Principal',
      items: [
        { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'users', label: 'Producteurs', path: '/dashboard/planteurs' },
        { icon: 'box', label: 'Produits', path: '/dashboard/produits' },
      ]
    },
    commercial: {
      title: 'Commercial',
      items: [
        { icon: 'cart', label: 'Ventes', path: '/dashboard/ventes' },
        { icon: 'truck', label: 'Achats', path: '/dashboard/achats' },
        { icon: 'file', label: 'Factures', path: '/dashboard/factures' },
      ]
    },
    finance: {
      title: 'Finance',
      items: [
        { icon: 'wallet', label: 'Caisse', path: '/dashboard/caisse' },
        { icon: 'calculator', label: 'Comptabilité', path: '/dashboard/accounting' },
        { icon: 'coins', label: 'Crédits', path: '/dashboard/credits' },
      ]
    },
    operations: {
      title: 'Opérations',
      items: [
        { icon: 'leaf', label: 'Campagnes', path: '/dashboard/campagnes' },
        { icon: 'map-pin', label: 'Logistique', path: '/dashboard/logistique' },
        { icon: 'chart', label: 'Analytics', path: '/dashboard/analytics' },
      ]
    },
    social: {
      title: 'Social & Qualité',
      items: [
        { icon: 'calendar', label: 'Réunions', path: '/dashboard/reunions' },
        { icon: 'award', label: 'Certifications', path: '/dashboard/certifications' },
        { icon: 'heart', label: 'Mutuelle', path: '/dashboard/mutuelle' },
        { icon: 'star', label: 'Fidélité', path: '/dashboard/loyalty' },
      ]
    },
    admin: {
      title: 'Administration',
      items: [
        { icon: 'shield', label: 'Rôles', path: '/dashboard/roles' },
        { icon: 'settings', label: 'Paramètres', path: '/dashboard/parametres' },
        { icon: 'download', label: 'Exports', path: '/dashboard/exports' },
      ]
    },
  }

  return (
    <aside style={{
      width: collapsed ? '56px' : '230px', minHeight: '100vh',
      backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border)',
      transition: 'width 0.3s ease', position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ padding: collapsed ? '10px' : '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minHeight: '52px' }}
        onClick={() => router.push('/dashboard')}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: '#FFF5F0', padding: '3px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap' }}>Synchro ERP</h1>
            <p style={{ fontSize: '8px', color: couleurPrincipale, margin: 0, fontWeight: '500', fontStyle: 'italic' }}>Plus qu&apos;un ERP, un Partenaire</p>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {Object.entries(menuSections).map(([key, section]) => (
          <div key={key} style={{ marginBottom: '4px' }}>
            {!collapsed && <div style={{ padding: '4px 18px 2px', fontSize: '8px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{section.title}</div>}
            <div style={{ padding: '0 6px' }}>
              {section.items.map((item: any) => (
                <button key={item.path} onClick={() => router.push(item.path)} title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%', padding: collapsed ? '8px 0' : '8px 12px',
                    textAlign: collapsed ? 'center' : 'left',
                    backgroundColor: isActive(item.path) ? couleurPrincipale + '15' : 'transparent',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    color: isActive(item.path) ? couleurPrincipale : 'var(--text-secondary)',
                    fontSize: '12px', fontWeight: isActive(item.path) ? '600' : '400',
                    display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '8px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    marginBottom: '1px', transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}>
                  <Image src={`/icons/${item.icon}.svg`} alt="" width={16} height={16} style={{ flexShrink: 0, opacity: isActive(item.path) ? 1 : 0.5 }} />
                  {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ padding: '10px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        {!collapsed && (
          <p style={{ fontSize: '8px', color: '#CCC', margin: '0 0 6px 0' }}>
            © 2026 • <span style={{ color: '#CC5500', fontWeight: '600' }}>Manawa Techs</span>
          </p>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '5px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '11px' }}>☰</button>
      </div>
    </aside>
  )
}
