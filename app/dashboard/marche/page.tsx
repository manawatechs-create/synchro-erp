'use client'

import { useRouter } from 'next/navigation'

export default function MarchePage() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>📈 Analyse de Marché</h1>
          </div>
        </div>
      </div>
      <div className="erp-page-content">
        <div className="erp-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>📈</div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>Analyse de Marché</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Suivi des prix, tendances et opportunités commerciales.
          </p>
        </div>
      </div>
    </div>
  )
}
