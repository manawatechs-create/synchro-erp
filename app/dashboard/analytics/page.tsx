'use client'

import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '56px', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>←</button>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>📈 Analytics</h1>
        </div>
      </div>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Chiffre d\'Affaires', value: '2,450,000 FCFA', change: '+12%', color: '#CC5500', bg: '#FFF5F0' },
            { label: 'Panier Moyen', value: '45,000 FCFA', change: '+5%', color: '#004D4D', bg: '#F0F7F7' },
            { label: 'Satisfaction', value: '4.8/5', change: '+0.2', color: '#E8661A', bg: '#FFF8F5' },
            { label: 'Taux Conversion', value: '68%', change: '+3%', color: '#006666', bg: '#F5FAFA' },
          ].map((kpi, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #E8E8E8', borderTop: `3px solid ${kpi.color}` }}>
              <p style={{ color: '#999', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{kpi.label}</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: kpi.color, margin: '0 0 8px 0' }}>{kpi.value}</p>
              <span style={{ color: kpi.change.startsWith('+') ? '#CC5500' : '#666', fontSize: '13px', fontWeight: '600' }}>
                📈 {kpi.change}
              </span>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>📊 Ventes Mensuelles</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px' }}>
              {[65, 80, 45, 90, 75, 95, 85, 70, 88, 92, 78, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%', maxWidth: '40px',
                    height: `${h}%`,
                    background: `linear-gradient(180deg, #CC5500, #E8661A)`,
                    borderRadius: '6px 6px 0 0',
                    opacity: 0.85
                  }}></div>
                  <span style={{ fontSize: '10px', color: '#999' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>🏆 Top Produits</h3>
            {[
              { nom: 'Tomates', ventes: 450, pourcentage: 35, color: '#CC5500' },
              { nom: 'Oignons', ventes: 380, pourcentage: 28, color: '#E8661A' },
              { nom: 'Mil', ventes: 290, pourcentage: 20, color: '#004D4D' },
              { nom: 'Mangues', ventes: 220, pourcentage: 17, color: '#006666' },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>{p.nom}</span>
                  <span style={{ fontSize: '13px', color: '#999' }}>{p.ventes} ventes</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.pourcentage}%`, height: '100%', backgroundColor: p.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
