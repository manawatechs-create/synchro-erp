'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '', adresse: '',
    motDePasse: '', confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.motDePasse !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF5F0 0%, #F0F7F7 50%, #FAFAFA 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #E8E8E8',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'contain', marginBottom: '16px', boxShadow: '0 4px 15px rgba(204,85,0,0.2)' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>Inscription</h1>
          <p style={{ color: '#999', fontSize: '14px' }}>Rejoignez la coopérative</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FFD5D5', color: '#CC3333', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" required placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={inputStyle} />
            <input type="text" required placeholder="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} style={inputStyle} />
          </div>
          <input type="email" required placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ ...inputStyle, marginBottom: '12px' }} />
          <input type="tel" placeholder="Téléphone" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} style={{ ...inputStyle, marginBottom: '12px' }} />
          <input type="password" required placeholder="Mot de passe" value={formData.motDePasse} onChange={e => setFormData({...formData, motDePasse: e.target.value})} style={{ ...inputStyle, marginBottom: '12px' }} />
          <input type="password" required placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} style={{ ...inputStyle, marginBottom: '20px' }} />
          
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #CC5500, #A34400)',
            color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(204,85,0,0.3)'
          }}>
            {loading ? '⏳ Inscription...' : '✅ S\'inscrire'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#999' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#CC5500', textDecoration: 'none', fontWeight: '600' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px',
  fontSize: '14px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box'
}
