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
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Email ou mot de passe incorrect')
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
      background: '#F8F9FA',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Partie gauche - Marque */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: '#FFFFFF',
        borderRight: '1px solid #E8E8E8'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(204,85,0,0.15)', padding: '10px', backgroundColor: '#FFF5F0' }} />
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', marginBottom: '4px' }}>Synchro ERP</h1>
          <p style={{ fontSize: '14px', color: '#CC5500', fontWeight: '600', fontStyle: 'italic', marginBottom: '24px' }}>
            Plus qu&apos;un ERP, un Partenaire
          </p>
          <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
            Solution complète de gestion pour coopératives agricoles.
            Digitalisez, automatisez et optimisez vos opérations.
          </p>
          
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
            {[
              { icon: '📊', text: '19 modules intégrés' },
              { icon: '📱', text: 'Fonctionne hors-ligne' },
              { icon: '🔐', text: 'Rôles et permissions' },
              { icon: '🖨️', text: 'Documents pro' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#F8F9FA'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              👋 Connexion
            </h2>
            <p style={{ color: '#999', fontSize: '13px' }}>
              Accédez à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#FFF5F5', border: '1px solid #FFD5D5', color: '#CC3333',
                padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                Adresse email
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px',
                  backgroundColor: 'white', outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#CC5500'; e.target.style.boxShadow = '0 0 0 3px rgba(204,85,0,0.06)' }}
                onBlur={e => { e.target.style.borderColor = '#E8E8E8'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ color: '#666', fontSize: '12px', fontWeight: '600' }}>
                  Mot de passe
                </label>
                <a href="#" style={{ color: '#CC5500', fontSize: '11px', textDecoration: 'none', fontWeight: '500' }}>
                  Mot de passe oublié ?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 40px 12px 14px',
                    border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px',
                    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#CC5500'; e.target.style.boxShadow = '0 0 0 3px rgba(204,85,0,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = '#E8E8E8'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: '#CC5500', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1, transition: 'all 0.2s'
              }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#999' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#CC5500', fontWeight: '600', textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
            <p style={{ fontSize: '10px', color: '#CCC' }}>
              © 2026 Synchro ERP • <span style={{ color: '#CC5500', fontWeight: '600' }}>Manawa Techs</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
