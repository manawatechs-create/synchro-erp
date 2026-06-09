'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.membre))
      router.push('/dashboard')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F0 0%, #F0F7F7 50%, #FAFAFA 100%)', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #E8E8E8', borderRadius: '20px', padding: '44px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', marginBottom: '18px', boxShadow: '0 8px 25px rgba(204,85,0,0.2)', padding: '10px', backgroundColor: '#FFF5F0' }} />
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>Synchro ERP</h1>
          <p style={{ color: '#CC5500', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', fontStyle: 'italic' }}>Plus qu'un ERP, un Partenaire</p>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '6px' }}>Connectez-vous à votre espace</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FFD5D5', color: '#CC3333', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>⚠️ {error}</div>}
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ width: '100%', padding: '14px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: '#FAFAFA', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" style={{ width: '100%', padding: '14px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: '#FAFAFA', marginBottom: '24px', outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #CC5500, #A34400)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(204,85,0,0.3)' }}>
            {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#999' }}>
          <Link href="/register" style={{ color: '#CC5500', fontWeight: '600', textDecoration: 'none' }}>Créer un compte</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#CCC' }}>
          © 2026 • Construit par <span style={{ color: '#CC5500', fontWeight: '600' }}>Manawa Techs</span>
        </p>
      </div>
    </div>
  )
}
