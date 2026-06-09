'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
        <h1 style={{ fontSize: '18px', fontWeight: '700' }}>{icon} Rôles</h1>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #E8E8E8' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{icon}</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Rôles</h2>
          <p style={{ color: '#999', fontSize: '14px' }}>Module opérationnel</p>
        </div>
      </div>
    </div>
  )
}
