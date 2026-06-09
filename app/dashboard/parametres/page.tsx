'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../context/AppContext'

export default function ParametresPage() {
  const router = useRouter()
  const { 
    theme, setTheme, couleurPrincipale, setCouleurPrincipale,
    couleurSecondaire, setCouleurSecondaire, police, setPolice,
    animations, setAnimations, addNotification 
  } = useApp()
  
  const [activeTab, setActiveTab] = useState('apparence')
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })

  // Configuration système
  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    notificationsEmail: true,
    notificationsSms: false,
    modeMaintenance: false,
    sauvegardeAuto: true,
    sauvegardeFrequence: 'quotidien',
    logsActivite: true,
    doubleAuth: false,
    sessionTimeout: '30',
    itemsParPage: '25',
    langue: 'fr',
    devise: 'FCFA',
    fuseauHoraire: 'Africa/Ouagadougou',
    formatDate: 'DD/MM/YYYY',
    formatHeure: '24h',
    apiKey: '••••••••••••••••',
    modeDebug: false,
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const u = JSON.parse(userData)
      setUser(u)
      setFormData({ nom: u.nom || '', prenom: u.prenom || '', email: u.email || '', telephone: u.telephone || '', adresse: u.adresse || '' })
    }
    // Charger les paramètres sauvegardés
    const saved = localStorage.getItem('systemSettings')
    if (saved) setSystemSettings(JSON.parse(saved))
  }, [])

  const notif = (msg: string) => addNotification({ type: 'success', message: msg })

  const toggleSetting = (key: string) => {
    const newSettings = { ...systemSettings, [key]: !(systemSettings as any)[key] }
    setSystemSettings(newSettings)
    localStorage.setItem('systemSettings', JSON.stringify(newSettings))
    notif(`✅ Paramètre mis à jour !`)
  }

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...systemSettings, [key]: value }
    setSystemSettings(newSettings)
    localStorage.setItem('systemSettings', JSON.stringify(newSettings))
    notif(`✅ Paramètre mis à jour !`)
  }

  const saveAllSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
    notif('✅ Tous les paramètres système ont été sauvegardés !')
  }

  const resetSettings = () => {
    const defaults = {
      notifications: true, notificationsEmail: true, notificationsSms: false,
      modeMaintenance: false, sauvegardeAuto: true, sauvegardeFrequence: 'quotidien',
      logsActivite: true, doubleAuth: false, sessionTimeout: '30',
      itemsParPage: '25', langue: 'fr', devise: 'FCFA',
      fuseauHoraire: 'Africa/Ouagadougou', formatDate: 'DD/MM/YYYY',
      formatHeure: '24h', apiKey: '••••••••••••••••', modeDebug: false,
    }
    setSystemSettings(defaults)
    localStorage.setItem('systemSettings', JSON.stringify(defaults))
    notif('🔄 Paramètres système réinitialisés par défaut !')
  }

  const couleurs = [
    '#CC5500', '#E8661A', '#A34400', '#004D4D', '#006666', '#003333',
    '#3b82f6', '#2563eb', '#10b981', '#059669', '#8b5cf6', '#7c3aed',
    '#ef4444', '#dc2626', '#f59e0b', '#d97706', '#ec4899', '#db2777',
    '#6366f1', '#4f46e5', '#14b8a6', '#0d9488', '#84cc16', '#65a30d'
  ]

  const policesList = ['Inter', 'Roboto', 'Poppins', 'Open Sans', 'Montserrat', 'Lato', 'Nunito', 'Raleway']

  const tabs = [
    { id: 'apparence', label: '🎨 Apparence', icon: '🎨' },
    { id: 'profil', label: '👤 Profil', icon: '👤' },
    { id: 'securite', label: '🔒 Sécurité', icon: '🔒' },
    { id: 'cooperative', label: '🏢 Coopérative', icon: '🏢' },
    { id: 'systeme', label: '⚙️ Système', icon: '⚙️' },
    { id: 'sauvegarde', label: '💾 Sauvegarde', icon: '💾' },
  ]

  // Style pour les interrupteurs
  const toggleStyle = (active: boolean) => ({
    width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    backgroundColor: active ? couleurPrincipale : '#ccc', position: 'relative' as const, transition: 'all 0.2s'
  })

  const toggleCircle = (active: boolean) => ({
    width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
    position: 'absolute' as const, top: '2px', left: active ? '22px' : '2px', transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>⚙️ Paramètres</h1>
          </div>
        </div>
      </div>

      <div className="erp-page-content">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Navigation */}
          <div style={{ width: '200px', flexShrink: 0, backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '8px', height: 'fit-content' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', padding: '10px 14px', textAlign: 'left',
                backgroundColor: activeTab === tab.id ? couleurPrincipale + '15' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                color: activeTab === tab.id ? couleurPrincipale : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: activeTab === tab.id ? '600' : '400',
                marginBottom: '2px', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px'
              }}>{tab.icon} {tab.label}</button>
            ))}
          </div>

          {/* Contenu */}
          <div style={{ flex: 1, minWidth: '400px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '28px' }}>
              
              {/* ========== APPARENCE ========== */}
              {activeTab === 'apparence' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>🎨 Apparence</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Modifications appliquées instantanément</p>

                  {/* Aperçu */}
                  <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: couleurPrincipale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>S</div>
                      <div>
                        <p style={{ fontWeight: '700', color: 'var(--text)', margin: 0, fontSize: '14px' }}>Synchro ERP</p>
                        <p style={{ fontSize: '10px', color: couleurPrincipale, margin: 0 }}>Plus qu'un ERP, un Partenaire</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ flex: 1, padding: '8px', backgroundColor: couleurPrincipale + '15', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: couleurPrincipale, fontWeight: '600' }}>👨‍🌾 Planteurs</div>
                      <div style={{ flex: 1, padding: '8px', backgroundColor: couleurSecondaire + '15', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: couleurSecondaire, fontWeight: '600' }}>📦 Produits</div>
                      <div style={{ flex: 1, padding: '8px', backgroundColor: '#10b98115', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>💰 Ventes</div>
                    </div>
                  </div>

                  {/* Thème */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Thème</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'clair', label: '☀️ Clair' },
                        { id: 'sombre', label: '🌙 Sombre' },
                        { id: 'systeme', label: '💻 Auto' },
                      ].map(t => (
                        <button key={t.id} onClick={() => { setTheme(t.id); notif(`Thème ${t.label} appliqué !`) }} style={{
                          flex: 1, padding: '12px', borderRadius: '8px', textAlign: 'center',
                          backgroundColor: theme === t.id ? couleurPrincipale : 'var(--bg-input)',
                          color: theme === t.id ? 'white' : 'var(--text)',
                          border: theme === t.id ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                          cursor: 'pointer', fontWeight: theme === t.id ? '700' : '400', fontSize: '13px'
                        }}>{t.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Couleur principale */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Couleur principale <span style={{ color: couleurPrincipale }}>({couleurPrincipale})</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {couleurs.map(c => (
                        <button key={c} onClick={() => { setCouleurPrincipale(c); notif(`Couleur ${c} appliquée !`) }} style={{
                          width: '32px', height: '32px', borderRadius: '6px', backgroundColor: c, cursor: 'pointer',
                          border: couleurPrincipale === c ? '3px solid var(--text)' : '3px solid transparent',
                          transform: couleurPrincipale === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.15s'
                        }} title={c} />
                      ))}
                      <input type="color" value={couleurPrincipale} onChange={e => { setCouleurPrincipale(e.target.value); notif('Couleur personnalisée !') }}
                        style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </div>

                  {/* Police */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Police</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {policesList.map(p => (
                        <button key={p} onClick={() => { setPolice(p); notif(`Police ${p} appliquée !`) }} style={{
                          padding: '8px 14px', borderRadius: '6px', fontFamily: p, fontSize: '13px',
                          backgroundColor: police === p ? couleurPrincipale : 'var(--bg-input)',
                          color: police === p ? 'white' : 'var(--text)',
                          border: police === p ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                          cursor: 'pointer', fontWeight: '500'
                        }}>{p}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Animations</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Transitions fluides</p>
                    </div>
                    <button onClick={() => { setAnimations(!animations); notif(`Animations ${!animations ? 'activées' : 'désactivées'} !`) }} style={toggleStyle(animations)}>
                      <div style={toggleCircle(animations)}></div>
                    </button>
                  </div>

                  <button className="erp-btn-secondary" style={{ marginTop: '20px' }} onClick={() => { setTheme('clair'); setCouleurPrincipale('#CC5500'); setCouleurSecondaire('#004D4D'); setPolice('Inter'); setAnimations(true); notif('🔄 Apparence réinitialisée !') }}>
                    🔄 Réinitialiser par défaut
                  </button>
                </div>
              )}

              {/* ========== PROFIL ========== */}
              {activeTab === 'profil' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>👤 Profil Utilisateur</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: '10px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `linear-gradient(135deg, ${couleurPrincipale}, ${couleurSecondaire})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700' }}>
                      {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: 'var(--text)', margin: 0 }}>{user?.prenom} {user?.nom}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{user?.email}</p>
                      <span className="erp-badge erp-badge-primary" style={{ marginTop: '4px' }}>{user?.role}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {['nom', 'prenom', 'email', 'telephone'].map(f => (
                      <div key={f} style={f === 'email' ? { gridColumn: '1/-1' } : {}}>
                        <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>{f}</label>
                        <input className="erp-input" value={(formData as any)[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <button className="erp-btn-primary" style={{ marginTop: '16px' }} onClick={() => notif('✅ Profil mis à jour !')}>💾 Enregistrer</button>
                </div>
              )}

              {/* ========== SÉCURITÉ ========== */}
              {activeTab === 'securite' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>🔒 Sécurité</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginBottom: '24px' }}>
                    <input className="erp-input" type="password" placeholder="Mot de passe actuel" />
                    <input className="erp-input" type="password" placeholder="Nouveau mot de passe" />
                    <input className="erp-input" type="password" placeholder="Confirmer le mot de passe" />
                  </div>
                  <button className="erp-btn-primary" onClick={() => notif('✅ Mot de passe changé !')}>🔒 Changer le mot de passe</button>
                  
                  <div className="erp-divider" />
                  
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>Double authentification (2FA)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Authentification à deux facteurs</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Code SMS ou application</p>
                    </div>
                    <button onClick={() => { updateSetting('doubleAuth', !systemSettings.doubleAuth) }} style={toggleStyle(systemSettings.doubleAuth)}>
                      <div style={toggleCircle(systemSettings.doubleAuth)}></div>
                    </button>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>Sessions</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Timeout de session (minutes)</p>
                    </div>
                    <select className="erp-select" style={{ width: '120px' }} value={systemSettings.sessionTimeout} onChange={e => updateSetting('sessionTimeout', e.target.value)}>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">60 min</option>
                      <option value="120">120 min</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ========== COOPÉRATIVE ========== */}
              {activeTab === 'cooperative' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>🏢 Coopérative</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Nom de la coopérative</label>
                      <input className="erp-input" defaultValue="Coopérative Villageoise de Koudougou" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Code</label>
                      <input className="erp-input" defaultValue="COOP-KDG-001" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Téléphone</label>
                      <input className="erp-input" defaultValue="+226 70 00 00 00" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
                      <input className="erp-input" defaultValue="contact@coop-villageoise.bf" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Devise</label>
                      <select className="erp-select" value={systemSettings.devise} onChange={e => updateSetting('devise', e.target.value)}>
                        <option>FCFA (XOF)</option><option>EUR (€)</option><option>USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Langue</label>
                      <select className="erp-select" value={systemSettings.langue} onChange={e => updateSetting('langue', e.target.value)}>
                        <option value="fr">Français</option><option value="en">English</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Adresse</label>
                      <input className="erp-input" defaultValue="Marché Central, Koudougou, Burkina Faso" />
                    </div>
                  </div>
                  <button className="erp-btn-primary" style={{ marginTop: '16px' }} onClick={() => notif('✅ Informations mises à jour !')}>💾 Enregistrer</button>
                </div>
              )}

              {/* ========== SYSTÈME ========== */}
              {activeTab === 'systeme' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>⚙️ Configuration Système</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Gérez les paramètres généraux du système</p>

                  {/* Notifications */}
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>🔔 Notifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    {[
                      { key: 'notifications', label: 'Notifications in-app', desc: 'Afficher les notifications dans l\'application' },
                      { key: 'notificationsEmail', label: 'Notifications par email', desc: 'Recevoir les alertes par email' },
                      { key: 'notificationsSms', label: 'Notifications par SMS', desc: 'Recevoir les alertes par SMS (Orange Money)' },
                    ].map(item => (
                      <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>{item.label}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{item.desc}</p>
                        </div>
                        <button onClick={() => toggleSetting(item.key)} style={toggleStyle((systemSettings as any)[item.key])}>
                          <div style={toggleCircle((systemSettings as any)[item.key])}></div>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Maintenance */}
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>🔧 Maintenance</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: systemSettings.modeMaintenance ? '#FEF2F2' : 'var(--bg-input)', borderRadius: '8px', border: systemSettings.modeMaintenance ? '1px solid rgba(239,68,68,0.3)' : 'none' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: systemSettings.modeMaintenance ? '#ef4444' : 'var(--text)', margin: 0 }}>Mode maintenance</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Désactive l'accès aux utilisateurs non-admin</p>
                      </div>
                      <button onClick={() => toggleSetting('modeMaintenance')} style={toggleStyle(systemSettings.modeMaintenance)}>
                        <div style={toggleCircle(systemSettings.modeMaintenance)}></div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Logs d'activité</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Enregistrer les actions des utilisateurs</p>
                      </div>
                      <button onClick={() => toggleSetting('logsActivite')} style={toggleStyle(systemSettings.logsActivite)}>
                        <div style={toggleCircle(systemSettings.logsActivite)}></div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Mode debug</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Afficher les informations de débogage</p>
                      </div>
                      <button onClick={() => toggleSetting('modeDebug')} style={toggleStyle(systemSettings.modeDebug)}>
                        <div style={toggleCircle(systemSettings.modeDebug)}></div>
                      </button>
                    </div>
                  </div>

                  {/* Préférences */}
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>📋 Préférences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Fuseau horaire</p>
                      </div>
                      <select className="erp-select" style={{ width: '200px' }} value={systemSettings.fuseauHoraire} onChange={e => updateSetting('fuseauHoraire', e.target.value)}>
                        <option>Africa/Ouagadougou</option><option>Africa/Abidjan</option><option>Africa/Bamako</option><option>Europe/Paris</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Format de date</p>
                      </div>
                      <select className="erp-select" style={{ width: '200px' }} value={systemSettings.formatDate} onChange={e => updateSetting('formatDate', e.target.value)}>
                        <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Format d'heure</p>
                      </div>
                      <select className="erp-select" style={{ width: '200px' }} value={systemSettings.formatHeure} onChange={e => updateSetting('formatHeure', e.target.value)}>
                        <option value="24h">24 heures</option><option value="12h">12 heures (AM/PM)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Éléments par page</p>
                      </div>
                      <select className="erp-select" style={{ width: '200px' }} value={systemSettings.itemsParPage} onChange={e => updateSetting('itemsParPage', e.target.value)}>
                        <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
                      </select>
                    </div>
                  </div>

                  {/* API */}
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>🔑 API</h3>
                  <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px 0' }}>Clé API</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="erp-input" value={systemSettings.apiKey} readOnly style={{ fontFamily: 'monospace' }} />
                      <button className="erp-btn-secondary" onClick={() => notif('🔑 Nouvelle clé API générée !')} style={{ whiteSpace: 'nowrap' }}>🔄 Régénérer</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <button className="erp-btn-primary" onClick={saveAllSettings}>💾 Sauvegarder tous les paramètres</button>
                    <button className="erp-btn-secondary" onClick={resetSettings}>🔄 Réinitialiser par défaut</button>
                  </div>
                </div>
              )}

              {/* ========== SAUVEGARDE ========== */}
              {activeTab === 'sauvegarde' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>💾 Sauvegarde & Données</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Gérez les sauvegardes et exportez vos données</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Sauvegarde auto */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: '10px' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>Sauvegarde automatique</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Planifier des sauvegardes régulières</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select className="erp-select" style={{ width: '140px' }} value={systemSettings.sauvegardeFrequence} onChange={e => updateSetting('sauvegardeFrequence', e.target.value)}>
                          <option value="quotidien">Quotidien</option><option value="hebdomadaire">Hebdomadaire</option><option value="mensuel">Mensuel</option>
                        </select>
                        <button onClick={() => toggleSetting('sauvegardeAuto')} style={toggleStyle(systemSettings.sauvegardeAuto)}>
                          <div style={toggleCircle(systemSettings.sauvegardeAuto)}></div>
                        </button>
                      </div>
                    </div>

                    {/* Sauvegarde manuelle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: '10px' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>Sauvegarde complète</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Dernière sauvegarde : 15/06/2024 à 08:30</p>
                      </div>
                      <button className="erp-btn-primary" onClick={() => notif('✅ Sauvegarde effectuée avec succès !')}>💾 Sauvegarder maintenant</button>
                    </div>

                    {/* Export */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: '10px' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>Export des données</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Exportez toutes les données au format Excel ou CSV</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="erp-btn-secondary" onClick={() => notif('📥 Export Excel lancé !')}>📥 Excel</button>
                        <button className="erp-btn-secondary" onClick={() => notif('📥 Export CSV lancé !')}>📥 CSV</button>
                      </div>
                    </div>

                    {/* Zone dangereuse */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#DC2626', margin: 0 }}>Zone dangereuse</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>Réinitialiser toutes les données. Cette action est irréversible.</p>
                      </div>
                      <button className="erp-btn-danger" onClick={() => { if (confirm('⚠️ Réinitialiser toutes les données ? Cette action est irréversible.')) notif('⚠️ Données réinitialisées !') }}>⚠️ Réinitialiser</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
