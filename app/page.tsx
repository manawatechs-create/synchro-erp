'use client'

import Link from 'next/link'
import { SYSTEM_INFO } from './services/systemInfo'

export default function Home() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8F9FA' }}>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #CC5500 0%, #A34400 50%, #004D4D 100%)',
        padding: '80px 20px 60px', textAlign: 'center', color: 'white'
      }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '100px', height: '100px', borderRadius: '22px', marginBottom: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', backgroundColor: 'white', padding: '12px' }} />
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>{SYSTEM_INFO.name}</h1>
        <p style={{ fontSize: '20px', fontWeight: '600', opacity: 0.95, marginBottom: '4px', fontStyle: 'italic' }}>{SYSTEM_INFO.slogan}</p>
        <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '600px', margin: '0 auto 32px' }}>{SYSTEM_INFO.description.courte}</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: 'white', color: '#CC5500', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>🔐 Se connecter</Link>
          <Link href="/register" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)' }}>✅ S&apos;inscrire</Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ maxWidth: '1000px', margin: '-30px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {[
          { value: '19', label: 'Modules', icon: '📦' },
          { value: '8', label: 'Documents Pro', icon: '📄' },
          { value: 'PWA', label: 'Hors-ligne', icon: '📱' },
          { value: '100%', label: 'Fonctionnel', icon: '✅' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #E8E8E8' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#CC5500', margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>🚀 Modules du Système</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '36px', fontSize: '14px' }}>8 modules intégrés pour gérer l&apos;ensemble de votre coopérative</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {SYSTEM_INFO.description.modules.map((m, i) => (
            <div key={i} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
              style={{ backgroundColor: 'white', borderRadius: '14px', padding: '22px', border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', gap: '14px', alignItems: 'flex-start', transition: 'all 0.2s', cursor: 'default' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{['👨‍🌾','📦','💰','🌾','🚚','🤝','📜','📊'][i]}</div>
              <div><h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>{m.nom}</h3><p style={{ fontSize: '12px', color: '#999', margin: 0, lineHeight: '1.5' }}>{m.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* POINTS FORTS */}
      <div style={{ backgroundColor: 'white', padding: '60px 20px', borderTop: '1px solid #E8E8E8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '36px' }}>⚡ Pourquoi choisir {SYSTEM_INFO.name} ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {SYSTEM_INFO.description.pointsForts.map((pf, i) => (
              <div key={i} style={{ padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{['📱','🏢','🔐','📊','🔄','🌍','💾'][i] || '✅'}</div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 6px' }}>{pf}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '36px 20px', borderTop: '1px solid #E8E8E8', backgroundColor: 'white' }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '48px', height: '48px', borderRadius: '10px', marginBottom: '12px' }} />
        <p style={{ color: '#CCC', fontSize: '12px', margin: '0 0 6px' }}>© 2026 {SYSTEM_INFO.name} • Tous droits réservés</p>
        <p style={{ color: '#CC5500', fontSize: '13px', fontWeight: '600', margin: 0 }}>Construit par <strong>{SYSTEM_INFO.constructeur}</strong></p>
      </div>
    </div>
  )
}
