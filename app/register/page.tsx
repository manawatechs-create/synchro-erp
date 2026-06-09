'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [f, setF] = useState({ nom: '', prenom: '', email: '', telephone: '', motDePasse: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (f.motDePasse !== f.confirmPassword) { setError('Mots de passe différents'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.membre))
      router.push('/dashboard')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F0, #F0F7F7)', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #E8E8E8' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 14 }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Inscription</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ background: '#FFF5F5', color: '#CC3333', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input type="text" required placeholder="Nom" value={f.nom} onChange={e => setF({...f, nom: e.target.value})} style={is} />
            <input type="text" required placeholder="Prénom" value={f.prenom} onChange={e => setF({...f, prenom: e.target.value})} style={is} />
          </div>
          <input type="email" required placeholder="Email" value={f.email} onChange={e => setF({...f, email: e.target.value})} style={{...is, marginBottom: 10}} />
          <input type="tel" placeholder="Téléphone" value={f.telephone} onChange={e => setF({...f, telephone: e.target.value})} style={{...is, marginBottom: 10}} />
          <input type="password" required placeholder="Mot de passe" value={f.motDePasse} onChange={e => setF({...f, motDePasse: e.target.value})} style={{...is, marginBottom: 10}} />
          <input type="password" required placeholder="Confirmer" value={f.confirmPassword} onChange={e => setF({...f, confirmPassword: e.target.value})} style={{...is, marginBottom: 20}} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #CC5500, #A34400)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(204,85,0,0.3)' }}>{loading ? 'Inscription...' : '✅ S\'inscrire'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#999' }}>Déjà un compte ? <Link href="/login" style={{ color: '#CC5500', fontWeight: 600 }}>Se connecter</Link></p>
      </div>
    </div>
  )
}
const is: React.CSSProperties = { width: '100%', padding: 12, border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 14, backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
