'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MembresPage() {
  const router = useRouter()
  const [membres] = useState([
    { id: 1, nom: 'Diallo', prenom: 'Amadou', email: 'amadou@email.com', tel: '+226 70 00 00 01', role: 'MEMBRE', date: '2023-06-15' },
    { id: 2, nom: 'Camara', prenom: 'Fatou', email: 'fatou@email.com', tel: '+226 70 00 00 02', role: 'MEMBRE', date: '2023-08-20' },
    { id: 3, nom: 'Koné', prenom: 'Ibrahim', email: 'ibrahim@email.com', tel: '+226 70 00 00 03', role: 'GESTIONNAIRE', date: '2023-04-10' },
  ])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>👥 Membres</h1>
          </div>
          <button style={{ padding: '10px 20px', backgroundColor: '#CC5500', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(204,85,0,0.2)' }}>
            + Ajouter
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {membres.map((m) => (
            <div key={m.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #CC5500, #A34400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: '700', color: 'white'
                }}>
                  {m.prenom[0]}{m.nom[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>{m.prenom} {m.nom}</h3>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                    backgroundColor: m.role === 'GESTIONNAIRE' ? '#FFF5F0' : '#F0F7F7',
                    color: m.role === 'GESTIONNAIRE' ? '#CC5500' : '#004D4D'
                  }}>{m.role}</span>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
                <p style={{ margin: '0 0 4px 0' }}>📧 {m.email}</p>
                <p style={{ margin: '0 0 4px 0' }}>📱 {m.tel}</p>
                <p style={{ margin: 0 }}>📅 Membre depuis {m.date}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
