'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CertificationsPage() {
  const router = useRouter()
  const [notification, setNotification] = useState('')
  const [activeTab, setActiveTab] = useState('liste')
  const [showForm, setShowForm] = useState(false)

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const [certifications] = useState([
    { id: 1, planteur: 'Amadou Diallo', type: 'Bio', organisme: 'ECOCERT', dateObtention: '2024-03-15', dateExpiration: '2025-03-15', statut: 'Valide', document: 'certif-bio-001.pdf' },
    { id: 2, planteur: 'Fatou Camara', type: 'Commerce Équitable', organisme: 'Fairtrade', dateObtention: '2024-01-20', dateExpiration: '2025-01-20', statut: 'Valide', document: 'fairtrade-002.pdf' },
    { id: 3, planteur: 'Ibrahim Koné', type: 'GlobalGAP', organisme: 'SGS', dateObtention: '2024-05-10', dateExpiration: '2025-05-10', statut: 'Valide', document: 'globalgap-003.pdf' },
    { id: 4, planteur: 'Aïcha Ouédraogo', type: 'Bio', organisme: 'ECOCERT', dateObtention: '2023-11-01', dateExpiration: '2024-11-01', statut: 'Expire bientôt', document: 'certif-bio-004.pdf' },
    { id: 5, planteur: 'Moussa Traoré', type: 'Rainforest Alliance', organisme: 'UTZ', dateObtention: '2023-06-15', dateExpiration: '2024-06-15', statut: 'Expirée', document: 'rainforest-005.pdf' },
  ])

  const [formData, setFormData] = useState({
    planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: ''
  })

  const types = [
    { nom: 'Bio', icon: '🌿', couleur: '#10b981', description: 'Agriculture Biologique certifiée' },
    { nom: 'Commerce Équitable', icon: '🤝', couleur: '#f59e0b', description: 'Fairtrade / Commerce Équitable' },
    { nom: 'GlobalGAP', icon: '🌍', couleur: '#3b82f6', description: 'Bonnes pratiques agricoles' },
    { nom: 'Rainforest Alliance', icon: '🌳', couleur: '#06b6d4', description: 'Protection de la biodiversité' },
    { nom: 'Label Rouge', icon: '🔴', couleur: '#ef4444', description: 'Qualité supérieure' },
    { nom: 'AOP/IGP', icon: '🏅', couleur: '#8b5cf6', description: 'Appellation d\'origine protégée' },
  ]

  const stats = {
    total: certifications.length,
    valides: certifications.filter(c => c.statut === 'Valide').length,
    expireBientot: certifications.filter(c => c.statut === 'Expire bientôt').length,
    expirees: certifications.filter(c => c.statut === 'Expirée').length,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showNotif('✅ Certification enregistrée avec succès !')
    setShowForm(false)
    setFormData({ planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: '' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div className="erp-notification">{notification}</div>}
      
      {/* Header */}
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>📜 Certifications & Labels</h1>
            <span style={{ color: '#999', fontSize: '13px' }}>({certifications.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setFormData({ planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: '' }) }}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Certification'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'liste', label: '📋 Liste' },
            { id: 'types', label: '🏷️ Types de Labels' },
            { id: 'suivi', label: '📊 Suivi' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400',
              color: activeTab === tab.id ? '#CC5500' : '#666',
              borderBottom: activeTab === tab.id ? '3px solid #CC5500' : '3px solid transparent',
              transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="erp-page-content">
        {/* KPIs */}
        <div className="erp-grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Certifications', value: stats.total, icon: '📜', color: '#CC5500', bg: '#FFF5F0' },
            { label: 'Valides', value: stats.valides, icon: '✅', color: '#10b981', bg: '#ECFDF5' },
            { label: 'Expire bientôt', value: stats.expireBientot, icon: '⚠️', color: '#f59e0b', bg: '#FFFBEB' },
            { label: 'Expirées', value: stats.expirees, icon: '❌', color: '#ef4444', bg: '#FEF2F2' },
          ].map((s, i) => (
            <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
              </div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '10px 0 4px' }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '24px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>
              ➕ Nouvelle Certification
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Planteur *</label>
                  <select className="erp-select" required value={formData.planteurId} onChange={e => setFormData({...formData, planteurId: e.target.value})}>
                    <option value="">Sélectionner un planteur</option>
                    <option value="1">Amadou Diallo</option>
                    <option value="2">Fatou Camara</option>
                    <option value="3">Ibrahim Koné</option>
                    <option value="4">Aïcha Ouédraogo</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type *</label>
                  <select className="erp-select" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {types.map(t => <option key={t.nom} value={t.nom}>{t.icon} {t.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Organisme *</label>
                  <input className="erp-input" required value={formData.organisme} onChange={e => setFormData({...formData, organisme: e.target.value})} placeholder="Ex: ECOCERT" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date obtention *</label>
                  <input className="erp-input" type="date" required value={formData.dateObtention} onChange={e => setFormData({...formData, dateObtention: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date expiration</label>
                  <input className="erp-input" type="date" value={formData.dateExpiration} onChange={e => setFormData({...formData, dateExpiration: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Document</label>
                  <input className="erp-input" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} placeholder="Nom du fichier" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Enregistrer</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Contenu par tab */}
        {activeTab === 'liste' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table" style={{ border: 'none' }}>
                <thead>
                  <tr>
                    <th>Planteur</th>
                    <th>Type</th>
                    <th>Organisme</th>
                    <th>Date obtention</th>
                    <th>Date expiration</th>
                    <th style={{ textAlign: 'center' }}>Statut</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certifications.map(c => {
                    const typeInfo = types.find(t => t.nom === c.type)
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '600', color: '#1a1a1a' }}>👨‍🌾 {c.planteur}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{typeInfo?.icon}</span>
                            <span style={{ fontWeight: '500' }}>{c.type}</span>
                          </span>
                        </td>
                        <td>{c.organisme}</td>
                        <td style={{ color: '#666', fontSize: '13px' }}>{new Date(c.dateObtention).toLocaleDateString('fr-FR')}</td>
                        <td style={{ color: '#666', fontSize: '13px' }}>{new Date(c.dateExpiration).toLocaleDateString('fr-FR')}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`erp-badge ${c.statut === 'Valide' ? 'erp-badge-success' : c.statut === 'Expire bientôt' ? 'erp-badge-warning' : 'erp-badge-danger'}`}>
                            {c.statut}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button onClick={() => showNotif('📄 Document téléchargé !')} style={{ padding: '6px 12px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>📥</button>
                            <button onClick={() => showNotif('✅ Certification renouvelée !')} style={{ padding: '6px 12px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🔄</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {types.map(t => (
              <div key={t.nom} className="erp-card" style={{ padding: '24px', textAlign: 'center', border: `2px solid ${t.couleur}20` }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.couleur, margin: '0 0 8px 0' }}>{t.nom}</h3>
                <p style={{ color: '#999', fontSize: '13px', margin: '0 0 12px 0' }}>{t.description}</p>
                <span className="erp-badge" style={{ backgroundColor: t.couleur + '15', color: t.couleur }}>
                  {certifications.filter(c => c.type === t.nom).length} certification(s)
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suivi' && (
          <div className="erp-grid-2">
            <div className="erp-card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' }}>📊 État des Certifications</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(#10b981 0deg ${stats.valides * 72}deg, #f59e0b ${stats.valides * 72}deg ${(stats.valides + stats.expireBientot) * 72}deg, #ef4444 ${(stats.valides + stats.expireBientot) * 72}deg 360deg)`, margin: '0 auto 16px' }}></div>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '12px' }}>
                    <span>🟢 Valides: {stats.valides}</span>
                    <span>🟡 Bientôt: {stats.expireBientot}</span>
                    <span>🔴 Expirées: {stats.expirees}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="erp-card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' }}>📅 Calendrier d'Expiration</h3>
              {certifications
                .sort((a, b) => new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime())
                .slice(0, 5)
                .map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{types.find(t => t.nom === c.type)?.icon}</span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{c.planteur}</p>
                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{c.type}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: new Date(c.dateExpiration) < new Date() ? '#ef4444' : new Date(c.dateExpiration) < new Date(Date.now() + 90*24*60*60*1000) ? '#f59e0b' : '#10b981', fontWeight: '600', margin: 0 }}>
                        {new Date(c.dateExpiration).toLocaleDateString('fr-FR')}
                      </p>
                      <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>
                        {Math.ceil((new Date(c.dateExpiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours restants
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
