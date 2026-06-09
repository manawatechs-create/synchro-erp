'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dataService from '../services/dataService'

export default function RegisterPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', role: 'MEMBRE',
    motDePasse: '', confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setIsLoggedIn(true)
      setIsAdmin(user.role === 'ADMIN')
    }
  }, [])

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.motDePasse !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.motDePasse.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return }
    
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      
      // Sauvegarder dans les données locales
      dataService.create('data_membres', {
        nom: form.nom, prenom: form.prenom, email: form.email,
        telephone: form.telephone, role: form.role
      })
      
      if (!isLoggedIn) {
        // Nouvel utilisateur qui s'inscrit
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.membre))
        router.push('/dashboard')
      } else {
        // Admin qui crée un compte
        showNotif('✅ Utilisateur créé avec succès !')
        setForm({ nom: '', prenom: '', email: '', telephone: '', role: 'MEMBRE', motDePasse: '', confirmPassword: '' })
      }
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>Synchro ERP</span>
        </div>
        {isLoggedIn && <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>← Dashboard</button>}
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          
          {!isLoggedIn && !isAdmin && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                Création de compte restreinte
              </h2>
              <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                Seul l&apos;administrateur peut créer des comptes utilisateurs.
                Veuillez contacter le responsable de votre coopérative.
              </p>
              <Link href="/login" style={{
                display: 'inline-block', padding: '10px 24px',
                backgroundColor: '#CC5500', color: 'white',
                borderRadius: '8px', textDecoration: 'none',
                fontWeight: '600', fontSize: '14px'
              }}>
                ← Retour à la connexion
              </Link>
            </div>
          )}

          {(isLoggedIn || isAdmin) && (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                {isAdmin ? '➕ Créer un utilisateur' : '👤 Créer un compte'}
              </h2>
              <p style={{ color: '#999', fontSize: '13px', marginBottom: '24px' }}>
                {isAdmin ? 'Créez un compte pour un nouveau membre' : 'Complétez vos informations'}
              </p>

              <form onSubmit={handleSubmit}>
                {error && <div style={{ backgroundColor: '#FFF5F5', color: '#CC3333', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" required placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} style={inputStyle} />
                  <input type="text" required placeholder="Prénom" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} style={inputStyle} />
                </div>
                <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{...inputStyle, marginBottom: '10px'}} />
                <input type="tel" placeholder="Téléphone" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} style={{...inputStyle, marginBottom: '10px'}} />
                
                {isAdmin && (
                  <div style={{ marginBottom: '10px' }}>
                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{...inputStyle, background: 'white', cursor: 'pointer'}}>
                      <option value="MEMBRE">👨‍🌾 Membre</option>
                      <option value="GESTIONNAIRE">📊 Gestionnaire</option>
                      <option value="COMPTABLE">💳 Comptable</option>
                      <option value="ADMIN">👨‍💼 Administrateur</option>
                    </select>
                  </div>
                )}

                <input type="password" required placeholder="Mot de passe (min 6 caractères)" value={form.motDePasse} onChange={e => setForm({...form, motDePasse: e.target.value})} style={{...inputStyle, marginBottom: '10px'}} />
                <input type="password" required placeholder="Confirmer le mot de passe" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} style={{...inputStyle, marginBottom: '20px'}} />

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '13px', backgroundColor: '#CC5500', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                }}>
                  {loading ? 'Création...' : isAdmin ? '✅ Créer l\'utilisateur' : '✅ S\'inscrire'}
                </button>
              </form>

              {!isAdmin && (
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#999' }}>
                  Déjà un compte ? <Link href="/login" style={{ color: '#CC5500', fontWeight: '600' }}>Se connecter</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px',
  fontSize: '14px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box'
}
