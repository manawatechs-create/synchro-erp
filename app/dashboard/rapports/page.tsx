'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '56px', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>←</button>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>📋 Rapports</h1>
        </div>
      </div>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '60px 40px', 
          border: '1px solid #E8E8E8',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
            Rapports
          </h2>
          <p style={{ color: '#999', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            Cette page est prête à être personnalisée selon vos besoins.
          </p>
          <div style={{ 
            marginTop: '30px',
            padding: '16px 24px',
            backgroundColor: '#FFF5F0',
            borderRadius: '10px',
            display: 'inline-block',
            border: '1px solid rgba(204,85,0,0.15)'
          }}>
            <p style={{ color: '#CC5500', fontSize: '13px', fontWeight: '500', margin: 0 }}>
              🚀 Fonctionnalité disponible
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
