'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'

export default function ParametresPage() {
  const router = useRouter()
  const { theme, setTheme, couleurPrincipale, setCouleurPrincipale, couleurSecondaire, setCouleurSecondaire, police, setPolice, animations, setAnimations } = useApp()
  const [activeTab, setActiveTab] = useState('apparence')
  const [user, setUser] = useState<any>(null)
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { const d = localStorage.getItem('user'); if (d) setUser(JSON.parse(d)) }, [])

  const couleurs = ['#CC5500','#E8661A','#A34400','#004D4D','#006666','#003333','#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b','#ec4899','#6366f1','#14b8a6','#84cc16','#06b6d4']
  const polices = ['Inter','Roboto','Poppins','Open Sans','Montserrat','Lato','Nunito','Raleway']

  const tabs = [
    { id: 'apparence', label: '🎨 Apparence', icon: '🎨' },
    { id: 'profil', label: '👤 Profil', icon: '👤' },
    { id: 'securite', label: '🔒 Sécurité', icon: '🔒' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: 'var(--secondary)', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>←</button>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>⚙️ Paramètres</h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '180px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)', padding: '8px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: activeTab === tab.id ? '600' : '400', marginBottom: '2px' }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: '400px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)' }}>
            
            {activeTab === 'apparence' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>🎨 Apparence</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>Modifications appliquées en temps réel sur tout le système</p>

                {/* Thème */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Thème</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ id: 'clair', label: '☀️ Clair' }, { id: 'sombre', label: '🌙 Sombre' }].map(t => (
                      <button key={t.id} onClick={() => { setTheme(t.id); showNotif('✅ Thème appliqué !') }}
                        style={{ flex: 1, padding: '14px', borderRadius: '8px', textAlign: 'center', background: theme === t.id ? 'var(--primary)' : 'var(--bg-input)', color: theme === t.id ? 'white' : 'var(--text)', border: theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', fontWeight: theme === t.id ? '700' : '400', fontSize: '14px' }}>{t.label}</button>
                    ))}
                  </div>
                </div>

                {/* Couleur principale */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Couleur principale</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {couleurs.map(c => (
                      <button key={c} onClick={() => { setCouleurPrincipale(c); showNotif('✅ Couleur appliquée !') }}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', background: c, cursor: 'pointer', border: couleurPrincipale === c ? '3px solid var(--text)' : '3px solid transparent', transform: couleurPrincipale === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.15s' }} title={c} />
                    ))}
                    <input type="color" value={couleurPrincipale} onChange={e => { setCouleurPrincipale(e.target.value); showNotif('✅ Couleur personnalisée !') }}
                      style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Police */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Police</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {polices.map(p => (
                      <button key={p} onClick={() => { setPolice(p); showNotif('✅ Police appliquée !') }}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontFamily: p, fontSize: '13px', background: police === p ? 'var(--primary)' : 'var(--bg-input)', color: police === p ? 'white' : 'var(--text)', border: police === p ? '2px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', fontWeight: '500' }}>{p}</button>
                    ))}
                  </div>
                </div>

                {/* Animations */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '20px' }}>
                  <div><p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Animations</p></div>
                  <button onClick={() => { setAnimations(!animations); showNotif('✅ Animations ' + (!animations ? 'activées' : 'désactivées') + ' !') }}
                    style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: animations ? 'var(--primary)' : '#ccc', position: 'relative' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: animations ? '22px' : '2px', transition: 'all 0.2s' }}></div>
                  </button>
                </div>

                <button onClick={() => { setTheme('clair'); setCouleurPrincipale('#CC5500'); setCouleurSecondaire('#004D4D'); setPolice('Inter'); setAnimations(true); localStorage.removeItem('appPreferences'); showNotif('🔄 Réinitialisé !') }}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🔄 Réinitialiser par défaut</button>
              </div>
            )}

            {activeTab === 'profil' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>👤 Profil</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '14px', background: 'var(--bg-input)', borderRadius: '10px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700' }}>{user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}</div>
                  <div><p style={{ fontWeight: '700', color: 'var(--text)', margin: 0 }}>{user?.prenom} {user?.nom}</p><p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{user?.email}</p></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['nom','prenom','email','telephone'].map(f => (
                    <input key={f} placeholder={f} defaultValue={(user as any)?.[f] || ''} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', background: 'var(--bg-input)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', width: '100%' }} />
                  ))}
                </div>
                <button onClick={() => showNotif('✅ Profil mis à jour !')} style={{ marginTop: '16px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Enregistrer</button>
              </div>
            )}

            {activeTab === 'securite' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>🔒 Sécurité</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                  <input type="password" placeholder="Mot de passe actuel" style={inputStyle} />
                  <input type="password" placeholder="Nouveau mot de passe" style={inputStyle} />
                  <input type="password" placeholder="Confirmer" style={inputStyle} />
                </div>
                <button onClick={() => showNotif('✅ Mot de passe changé !')} style={{ marginTop: '16px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🔒 Changer le mot de passe</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px',
  background: 'var(--bg-input)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', width: '100%'
}
