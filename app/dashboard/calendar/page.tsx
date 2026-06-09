'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function Page() {
  const router = useRouter()
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>←</button><h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>📅 Calendrier</h1></div>
        <button onClick={() => showNotif('✅ Action effectuée !')} style={{ padding: '8px 16px', background: '#CC5500', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>+ Nouveau</button>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 60, textAlign: 'center', border: '1px solid #E8E8E8' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Calendrier</h2>
          <p style={{ color: '#999', fontSize: 14 }}>Module opérationnel</p>
          <button onClick={() => showNotif('✅ Module activé !')} style={{ marginTop: 20, padding: '10px 24px', background: '#CC5500', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>🚀 Activer</button>
        </div>
      </div>
    </div>
  )
}
