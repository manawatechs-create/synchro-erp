'use client'

import { useRouter } from 'next/navigation'

export default function Topbar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: '230px', right: 0, height: '56px',
      backgroundColor: 'white', borderBottom: '1px solid #E8E8E8',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', fontFamily: 'system-ui, sans-serif'
    }}>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Synchro ERP</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.push('/dashboard/notifications')} style={iconBtn}>🔔</button>
        <button onClick={handleLogout} style={{ ...iconBtn, color: '#ef4444' }}>🚪</button>
      </div>
    </header>
  )
}

const iconBtn: React.CSSProperties = {
  width: '34px', height: '34px', borderRadius: '8px',
  background: '#FAFAFA', border: '1px solid #E8E8E8',
  cursor: 'pointer', fontSize: '16px', display: 'flex',
  alignItems: 'center', justifyContent: 'center'
}
