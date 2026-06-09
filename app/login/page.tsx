'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.membre))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F0, #F0F7F7)', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '64px', height: '64px', borderRadius: '12px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Connexion</h1>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>Synchro ERP</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ backgroundColor: '#FFF5F5', color: '#CC3333', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" style={{ width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
