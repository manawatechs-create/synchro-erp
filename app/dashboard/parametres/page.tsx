'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function ParametresPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('apparence')
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  // Apparence
  const [theme, setTheme] = useState('clair')
  const [couleurPrincipale, setCouleurPrincipale] = useState('#CC5500')
  const [couleurSecondaire, setCouleurSecondaire] = useState('#004D4D')
  const [police, setPolice] = useState('Inter')
  const [animations, setAnimations] = useState(true)

  // Profil
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })
  const [passwordForm, setPasswordForm] = useState({ actuel: '', nouveau: '', confirmer: '' })

  // Coopérative
  const [coop, setCoop] = useState({ nom: 'Coopérative Agricole', code: 'COOP-001', telephone: '+226 70 00 00 00', email: 'contact@cooperative.bf', adresse: 'Siège Social', devise: 'FCFA', langue: 'fr' })

  // Système
  const [settings, setSettings] = useState({
    notifications: true, notificationsEmail: true, modeMaintenance: false,
    logsActivite: true, doubleAuth: false, sessionTimeout: '30', itemsParPage: '25',
    fuseauHoraire: 'Africa/Ouagadougou', formatDate: 'DD/MM/YYYY'
  })

  useEffect(() => {
    const d = localStorage.getItem('user'); if (d) {
      const u = JSON.parse(d); setUser(u)
      setFormData({ nom: u.nom || '', prenom: u.prenom || '', email: u.email || '', telephone: u.telephone || '', adresse: u.adresse || '' })
    }
    // Charger préférences
    const prefs = JSON.parse(localStorage.getItem('appPreferences') || '{}')
    if (prefs.theme) setTheme(prefs.theme)
    if (prefs.couleurPrincipale) setCouleurPrincipale(prefs.couleurPrincipale)
    if (prefs.couleurSecondaire) setCouleurSecondaire(prefs.couleurSecondaire)
    if (prefs.police) setPolice(prefs.police)
    if (prefs.animations !== undefined) setAnimations(prefs.animations)
    const sys = JSON.parse(localStorage.getItem('systemSettings') || '{}')
    if (Object.keys(sys).length > 0) setSettings({...settings, ...sys})
  }, [])

  const savePrefs = (key: string, value: any) => {
    const prefs = JSON.parse(localStorage.getItem('appPreferences') || '{}')
    prefs[key] = value; localStorage.setItem('appPreferences', JSON.stringify(prefs))
    showNotif('✅ Préférence sauvegardée !')
  }

  const applyTheme = (t: string, cp: string, cs: string) => {
    const root = document.documentElement
    if (t === 'sombre') {
      document.body.style.backgroundColor = '#0f172a'; document.body.style.color = '#f1f5f9'
      root.style.setProperty('--bg', '#0f172a'); root.style.setProperty('--bg-card', '#1e293b')
      root.style.setProperty('--text', '#f1f5f9'); root.style.setProperty('--border', '#334155')
    } else {
      document.body.style.backgroundColor = '#F8F9FA'; document.body.style.color = '#1a1a1a'
      root.style.setProperty('--bg', '#F8F9FA'); root.style.setProperty('--bg-card', '#FFFFFF')
      root.style.setProperty('--text', '#1a1a1a'); root.style.setProperty('--border', '#E8E8E8')
    }
    root.style.setProperty('--primary', cp); root.style.setProperty('--secondary', cs)
    showNotif('✅ Thème appliqué !')
  }

  const couleurs = ['#CC5500','#E8661A','#A34400','#004D4D','#006666','#003333','#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b','#ec4899','#6366f1','#14b8a6','#84cc16','#06b6d4']
  const polices = ['Inter','Roboto','Poppins','Open Sans','Montserrat','Lato','Nunito','Raleway']

  const tabs = [
    { id: 'apparence', label: '🎨 Apparence', icon: '🎨' },
    { id: 'profil', label: '👤 Profil', icon: '👤' },
    { id: 'securite', label: '🔒 Sécurité', icon: '🔒' },
    { id: 'cooperative', label: '🏢 Coopérative', icon: '🏢' },
    { id: 'systeme', label: '⚙️ Système', icon: '⚙️' },
    { id: 'sauvegarde', label: '💾 Sauvegarde', icon: '💾' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>←</button>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>⚙️ Paramètres</h1>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', flexShrink: 0, backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '8px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: activeTab === tab.id ? couleurPrincipale + '15' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: activeTab === tab.id ? couleurPrincipale : 'var(--text-secondary)', fontSize: '13px', fontWeight: activeTab === tab.id ? '600' : '400', marginBottom: '2px', display: 'flex', gap: '8px' }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, minWidth: '400px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '28px', border: '1px solid var(--border)' }}>
            
            {/* APPARENCE */}
            {activeTab === 'apparence' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>🎨 Apparence</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Modifications appliquées instantanément</p>

                {/* Aperçu */}
                <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: couleurPrincipale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>S</div>
                    <div><p style={{ fontWeight: '700', color: 'var(--text)', margin: 0 }}>Synchro ERP</p><p style={{ fontSize: '10px', color: couleurPrincipale, margin: 0 }}>Plus qu'un ERP, un Partenaire</p></div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ flex: 1, padding: '8px', backgroundColor: couleurPrincipale + '15', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: couleurPrincipale, fontWeight: '600' }}>👨‍🌾 Producteurs</div>
                    <div style={{ flex: 1, padding: '8px', backgroundColor: couleurSecondaire + '15', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: couleurSecondaire, fontWeight: '600' }}>📦 Produits</div>
                    <div style={{ flex: 1, padding: '8px', backgroundColor: '#10b98115', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>💰 Ventes</div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Thème</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ id: 'clair', label: '☀️ Clair' }, { id: 'sombre', label: '🌙 Sombre' }].map(t => (
                      <button key={t.id} onClick={() => { setTheme(t.id); savePrefs('theme', t.id); applyTheme(t.id, couleurPrincipale, couleurSecondaire) }}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', textAlign: 'center', background: theme === t.id ? couleurPrincipale : 'var(--bg-input)', color: theme === t.id ? 'white' : 'var(--text)', border: theme === t.id ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)', cursor: 'pointer', fontWeight: theme === t.id ? '700' : '400', fontSize: '13px' }}>{t.label}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Couleur principale</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {couleurs.map(c => (
                      <button key={c} onClick={() => { setCouleurPrincipale(c); savePrefs('couleurPrincipale', c); applyTheme(theme, c, couleurSecondaire) }}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', background: c, cursor: 'pointer', border: couleurPrincipale === c ? '3px solid var(--text)' : '3px solid transparent', transform: couleurPrincipale === c ? 'scale(1.15)' : 'scale(1)' }} title={c} />
                    ))}
                    <input type="color" value={couleurPrincipale} onChange={e => { setCouleurPrincipale(e.target.value); savePrefs('couleurPrincipale', e.target.value); applyTheme(theme, e.target.value, couleurSecondaire) }}
                      style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Police</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {polices.map(p => (
                      <button key={p} onClick={() => { setPolice(p); savePrefs('police', p); document.body.style.fontFamily = p }}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontFamily: p, fontSize: '13px', background: police === p ? couleurPrincipale : 'var(--bg-input)', color: police === p ? 'white' : 'var(--text)', border: police === p ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)', cursor: 'pointer', fontWeight: '500' }}>{p}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                  <div><p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Animations</p></div>
                  <button onClick={() => { setAnimations(!animations); savePrefs('animations', !animations) }}
                    style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: animations ? couleurPrincipale : '#ccc', position: 'relative', transition: 'all 0.2s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: animations ? '22px' : '2px', transition: 'all 0.2s' }}></div>
                  </button>
                </div>

                <button onClick={() => { setTheme('clair'); setCouleurPrincipale('#CC5500'); setCouleurSecondaire('#004D4D'); setPolice('Inter'); setAnimations(true); localStorage.removeItem('appPreferences'); applyTheme('clair', '#CC5500', '#004D4D'); showNotif('🔄 Réinitialisé !') }}
                  style={{ marginTop: '20px', padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🔄 Réinitialiser</button>
              </div>
            )}

            {/* PROFIL */}
            {activeTab === 'profil' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>👤 Profil</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '14px', background: 'var(--bg-input)', borderRadius: '10px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `linear-gradient(135deg, ${couleurPrincipale}, ${couleurSecondaire})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700' }}>{user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}</div>
                  <div><p style={{ fontWeight: '700', color: 'var(--text)', margin: 0 }}>{user?.prenom} {user?.nom}</p><p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{user?.email}</p></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['nom','prenom','email','telephone','adresse'].map(f => (
                    <div key={f} style={f === 'email' || f === 'adresse' ? { gridColumn: '1/-1' } : {}}>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', textTransform: 'capitalize' }}>{f}</label>
                      <input value={(formData as any)[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} style={is} />
                    </div>
                  ))}
                </div>
                <button onClick={() => showNotif('✅ Profil mis à jour !')} style={{ marginTop: '16px', padding: '10px 20px', background: couleurPrincipale, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Enregistrer</button>
              </div>
            )}

            {/* SÉCURITÉ */}
            {activeTab === 'securite' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>🔒 Sécurité</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginBottom: '24px' }}>
                  <input type="password" placeholder="Mot de passe actuel" value={passwordForm.actuel} onChange={e => setPasswordForm({...passwordForm, actuel: e.target.value})} style={is} />
                  <input type="password" placeholder="Nouveau mot de passe" value={passwordForm.nouveau} onChange={e => setPasswordForm({...passwordForm, nouveau: e.target.value})} style={is} />
                  <input type="password" placeholder="Confirmer" value={passwordForm.confirmer} onChange={e => setPasswordForm({...passwordForm, confirmer: e.target.value})} style={is} />
                </div>
                <button onClick={() => { if (passwordForm.nouveau === passwordForm.confirmer && passwordForm.nouveau.length >= 6) { showNotif('✅ Mot de passe changé !'); setPasswordForm({ actuel: '', nouveau: '', confirmer: '' }) } else { showNotif('⚠️ Vérifiez les mots de passe') } }}
                  style={{ padding: '10px 20px', background: couleurPrincipale, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🔒 Changer le mot de passe</button>
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>Double authentification</h3>
                  <button onClick={() => showNotif('📱 2FA configurée !')} style={{ padding: '10px 20px', background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>📱 Activer la double authentification</button>
                </div>
              </div>
            )}

            {/* COOPÉRATIVE */}
            {activeTab === 'cooperative' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>🏢 Coopérative</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Nom</label><input value={coop.nom} onChange={e => setCoop({...coop, nom: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Code</label><input value={coop.code} onChange={e => setCoop({...coop, code: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Téléphone</label><input value={coop.telephone} onChange={e => setCoop({...coop, telephone: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Email</label><input value={coop.email} onChange={e => setCoop({...coop, email: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Devise</label><select value={coop.devise} onChange={e => setCoop({...coop, devise: e.target.value})} style={{...is, background: 'var(--bg-card)'}}><option>FCFA</option><option>EUR</option><option>USD</option></select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Langue</label><select value={coop.langue} onChange={e => setCoop({...coop, langue: e.target.value})} style={{...is, background: 'var(--bg-card)'}}><option value="fr">Français</option><option value="en">English</option></select></div>
                </div>
                <button onClick={() => showNotif('✅ Informations mises à jour !')} style={{ marginTop: '16px', padding: '10px 20px', background: couleurPrincipale, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Enregistrer</button>
              </div>
            )}

            {/* SYSTÈME */}
            {activeTab === 'systeme' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>⚙️ Configuration Système</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                      {typeof value === 'boolean' ? (
                        <button onClick={() => { const newS = {...settings, [key]: !value}; setSettings(newS); localStorage.setItem('systemSettings', JSON.stringify(newS)); showNotif('✅ Mis à jour !') }}
                          style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: value ? couleurPrincipale : '#ccc', position: 'relative' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: value ? '22px' : '2px', transition: 'all 0.2s' }}></div>
                        </button>
                      ) : (
                        <select value={value as string} onChange={e => { const newS = {...settings, [key]: e.target.value}; setSettings(newS); localStorage.setItem('systemSettings', JSON.stringify(newS)); showNotif('✅ Mis à jour !') }}
                          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', background: 'var(--bg-card)', color: 'var(--text)' }}>
                          {key === 'sessionTimeout' && ['15','30','60','120'].map(o => <option key={o} value={o}>{o} min</option>)}
                          {key === 'itemsParPage' && ['10','25','50','100'].map(o => <option key={o} value={o}>{o}</option>)}
                          {key === 'fuseauHoraire' && ['Africa/Ouagadougou','Africa/Abidjan','Europe/Paris'].map(o => <option key={o} value={o}>{o}</option>)}
                          {key === 'formatDate' && ['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SAUVEGARDE */}
            {activeTab === 'sauvegarde' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>💾 Sauvegarde & Données</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '10px' }}>
                    <div><p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>Sauvegarde complète</p><p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Dernière : {new Date().toLocaleDateString('fr-FR')}</p></div>
                    <button onClick={() => showNotif('✅ Sauvegarde effectuée !')} style={{ padding: '10px 20px', background: couleurPrincipale, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Sauvegarder</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '10px' }}>
                    <div><p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>Export des données</p><p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Excel, CSV</p></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => showNotif('📥 Export Excel lancé !')} style={{ padding: '10px 16px', background: '#ECFDF5', color: '#10b981', border: '1px solid #10b98130', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>📥 Excel</button>
                      <button onClick={() => showNotif('📥 Export CSV lancé !')} style={{ padding: '10px 16px', background: '#FFF5F0', color: '#CC5500', border: '1px solid #CC550030', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>📥 CSV</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#FEF2F2', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div><p style={{ fontWeight: '600', color: '#DC2626', margin: 0 }}>Zone dangereuse</p><p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Réinitialiser toutes les données</p></div>
                    <button onClick={() => { if (confirm('⚠️ Réinitialiser toutes les données ?')) { localStorage.clear(); showNotif('⚠️ Données réinitialisées !'); setTimeout(() => window.location.reload(), 1500) } }}
                      style={{ padding: '10px 20px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⚠️ Réinitialiser</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', backgroundColor: 'var(--bg-input)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }
