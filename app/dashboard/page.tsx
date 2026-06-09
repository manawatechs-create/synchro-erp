'use client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #CC5500, #004D4D)', borderRadius: '16px', padding: '28px', color: 'white', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>📊 Synchro ERP</h1>
        <p style={{ opacity: 0.9, margin: 0 }}>Plus qu un ERP, un Partenaire</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {[
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
        ].map((item, i) => (
          <button key={i} onClick={() => router.push(item.path)} style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '12px',
            border: '1px solid #E8E8E8', cursor: 'pointer', textAlign: 'center',
            fontSize: '14px', fontWeight: '600', transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
