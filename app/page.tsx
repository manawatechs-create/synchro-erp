import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F0, #F0F7F7)', fontFamily: 'system-ui, sans-serif', padding: '20px', textAlign: 'center' }}>
      <img src="/logo.png" alt="Synchro ERP" style={{ width: '100px', height: '100px', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 30px rgba(204,85,0,0.2)' }} />
      <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>Synchro ERP</h1>
      <p style={{ fontSize: '16px', color: '#CC5500', fontWeight: '600', fontStyle: 'italic', marginBottom: '32px' }}>Plus qu un ERP, un Partenaire</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/login" style={{ background: '#CC5500', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Se connecter</Link>
        <Link href="/register" style={{ background: 'white', color: '#CC5500', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', border: '2px solid #CC5500' }}>S inscrire</Link>
      </div>
      <p style={{ color: '#CCC', fontSize: '11px', marginTop: '40px' }}>© 2026 Synchro ERP • Construit par Manawa Techs</p>
    </div>
  )
}
