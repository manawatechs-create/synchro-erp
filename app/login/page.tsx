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
      background: 'linear-gradient(135deg, #FFF5F0 0%, #F0F7F7 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Partie gauche - Illustrations */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: 'linear-gradient(180deg, #CC5500 0%, #A34400 50%, #004D4D 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '500px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '100px', height: '100px', borderRadius: '22px', marginBottom: '28px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', backgroundColor: 'white', padding: '14px' }} />
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>Synchro ERP</h1>
          <p style={{ fontSize: '18px', fontWeight: '600', opacity: 0.9, marginBottom: '6px', fontStyle: 'italic' }}>
            Plus qu&apos;un ERP, un Partenaire
          </p>
          <p style={{ fontSize: '15px', opacity: 0.75, lineHeight: '1.6', marginTop: '16px' }}>
            Gérez votre coopérative agricole avec une solution complète, 
            intuitive et accessible partout, même sans connexion internet.
          </p>
          
          {/* Points forts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '36px', textAlign: 'left' }}>
            {[
              { icon: '📊', text: '19 modules intégrés' },
              { icon: '📱', text: 'Fonctionne hors-ligne' },
              { icon: '🔐', text: 'Rôles et permissions' },
              { icon: '🖨️', text: 'Documents imprimables' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.85 }}>
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
        background: 'white'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
              👋 Bienvenue
            </h2>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Connectez-vous à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#FFF5F5', border: '1px solid #FFD5D5', color: '#CC3333',
                padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Adresse email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999' }}>📧</span>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{
                    width: '100%', padding: '14px 14px 14px 42px',
                    border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px',
                    backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#CC5500'; e.target.style.boxShadow = '0 0 0 3px rgba(204,85,0,0.06)'; e.target.style.backgroundColor = 'white' }}
                  onBlur={e => { e.target.style.borderColor = '#E8E8E8'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFAFA' }}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ color: '#666', fontSize: '13px', fontWeight: '600' }}>
                  Mot de passe
                </label>
                <a href="#" style={{ color: '#CC5500', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  Mot de passe oublié ?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999' }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 44px 14px 42px',
                    border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px',
                    backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#CC5500'; e.target.style.boxShadow = '0 0 0 3px rgba(204,85,0,0.06)'; e.target.style.backgroundColor = 'white' }}
                  onBlur={e => { e.target.style.borderColor = '#E8E8E8'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFAFA' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999',
                    padding: '4px'
                  }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, #CC5500, #A34400)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1, transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(204,85,0,0.3)',
                letterSpacing: '0.3px'
              }}>
              {loading ? '⏳ Connexion en cours...' : '🔐 Se connecter'}
            </button>
          </form>

          {/* Lien inscription */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#CC5500', fontWeight: '600', textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #F0F0F0' }}>
            <p style={{ fontSize: '10px', color: '#CCC', margin: '0 0 4px' }}>
              © 2026 Synchro ERP • Tous droits réservés
            </p>
            <p style={{ fontSize: '11px', color: '#CC5500', fontWeight: '600', margin: 0 }}>
              Construit par <strong>Manawa Techs</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
