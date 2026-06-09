'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { canViewModule, getUserRole } from '../../lib/permissions'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userRole, setUserRole] = useState('MEMBRE')

  useEffect(() => { setUserRole(getUserRole()) }, [])

  const isActive = (path: string) => pathname?.startsWith(path)

  const allSections = [
    {
      title: 'Principal',
      items: [
        { icon: '📊', label: 'Dashboard', path: '/dashboard', module: 'dashboard' },
        { icon: '👨‍🌾', label: 'Producteurs', path: '/dashboard/planteurs', module: 'planteurs' },
        { icon: '📦', label: 'Produits', path: '/dashboard/produits', module: 'produits' },
      ]
    },
    {
      title: 'Commercial',
      items: [
        { icon: '💰', label: 'Ventes', path: '/dashboard/ventes', module: 'ventes' },
        { icon: '🛒', label: 'Achats', path: '/dashboard/achats', module: 'achats' },
        { icon: '🧾', label: 'Factures', path: '/dashboard/factures', module: 'factures' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { icon: '💵', label: 'Caisse', path: '/dashboard/caisse', module: 'caisse' },
        { icon: '💳', label: 'Comptabilité', path: '/dashboard/accounting', module: 'accounting' },
        { icon: '🏦', label: 'Crédits', path: '/dashboard/credits', module: 'credits' },
      ]
    },
    {
      title: 'Opérations',
      items: [
        { icon: '🌾', label: 'Campagnes', path: '/dashboard/campagnes', module: 'campagnes' },
        { icon: '🚚', label: 'Logistique', path: '/dashboard/logistique', module: 'logistique' },
        { icon: '📈', label: 'Analytics', path: '/dashboard/analytics', module: 'analytics' },
      ]
    },
    {
      title: 'Social & Qualité',
      items: [
        { icon: '📋', label: 'Réunions', path: '/dashboard/reunions', module: 'reunions' },
        { icon: '📜', label: 'Certifications', path: '/dashboard/certifications', module: 'certifications' },
        { icon: '🏥', label: 'Mutuelle', path: '/dashboard/mutuelle', module: 'mutuelle' },
        { icon: '🏆', label: 'Fidélité', path: '/dashboard/loyalty', module: 'loyalty' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { icon: '📝', label: 'Logs (Audit)', path: '/dashboard/logs', module: 'logs' },
        { icon: '🔑', label: 'Rôles', path: '/dashboard/roles', module: 'roles' },
        { icon: '⚙️', label: 'Paramètres', path: '/dashboard/parametres', module: 'parametres' },
        { icon: '🖨️', label: 'Exports', path: '/dashboard/exports', module: 'exports' },
        { icon: '🔔', label: 'Notifications', path: '/dashboard/notifications', module: 'notifications' },
      ]
    },
  ]

  return (
    <aside style={{
      width: collapsed ? '56px' : '230px', minHeight: '100vh',
      backgroundColor: 'white', borderRight: '1px solid #E8E8E8',
      transition: 'width 0.3s ease', position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer', minHeight: '52px' }}
        onClick={() => router.push('/dashboard')}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '34px', height: '34px', borderRadius: '8px' }} />
        {!collapsed && <div style={{ marginTop: '8px' }}><h1 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Synchro ERP</h1><p style={{ fontSize: '9px', color: '#CC5500', margin: 0, fontStyle: 'italic' }}>Plus qu'un ERP, un Partenaire</p></div>}
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {allSections.map((section, si) => {
          const visibleItems = section.items.filter(item => {
            // Le module logs est réservé à l'admin
            if (item.module === 'logs') return userRole === 'ADMIN'
            return canViewModule(item.module)
          })
          if (visibleItems.length === 0) return null

          return (
            <div key={si} style={{ marginBottom: '4px' }}>
              {!collapsed && <div style={{ padding: '4px 18px 2px', fontSize: '8px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{section.title}</div>}
              <div style={{ padding: '0 6px' }}>
                {visibleItems.map((item) => (
                  <button key={item.path} onClick={() => router.push(item.path)}
                    style={{
                      width: '100%', padding: collapsed ? '8px 0' : '10px 18px',
                      textAlign: collapsed ? 'center' : 'left',
                      backgroundColor: isActive(item.path) ? '#FFF5F0' : 'transparent',
                      border: 'none', borderRadius: '6px', cursor: 'pointer',
                      color: isActive(item.path) ? '#CC5500' : '#555',
                      fontSize: '13px', fontWeight: isActive(item.path) ? '600' : '400',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '1px', transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '10px', borderTop: '1px solid #F0F0F0', textAlign: 'center' }}>
        {!collapsed && <p style={{ fontSize: '8px', color: '#CCC', margin: '0 0 6px 0' }}>© 2026 • Manawa Techs • {userRole}</p>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '6px', background: '#FAFAFA', border: '1px solid #E8E8E8', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>☰</button>
      </div>
    </aside>
  )
}
