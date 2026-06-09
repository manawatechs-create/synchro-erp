'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div className="erp-notification">{notification}</div>}
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>{icon} Sécurité & Audit</h1>
          </div>
          <button className="erp-btn-primary" onClick={() => showNotif('✅ Module opérationnel !')}>+ Nouveau</button>
        </div>
      </div>
      <div className="erp-page-content">
        <div className="erp-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>{icon}</div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Sécurité & Audit</h2>
          <p style={{ color: '#999', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Ce module est prêt à être utilisé. Cliquez sur le bouton ci-dessous pour commencer.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="erp-btn-primary" onClick={() => showNotif('✅ Action effectuée avec succès !')}>🚀 Démarrer</button>
            <button className="erp-btn-secondary" onClick={() => router.push('/dashboard')}>← Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  )
}
