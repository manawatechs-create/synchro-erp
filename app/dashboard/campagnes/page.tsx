'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CampagnesPage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState('')
  const [campagnes] = useState([
    { id: 1, nom: 'Campagne 2024 - Saison Pluvieuse', saison: 'Pluvieuse', dateDebut: '2024-06-01', dateFin: '2024-10-31', statut: 'En cours', planteurs: 85, cultures: ['Mil', 'Maïs', 'Sorgho'], progression: 65 },
    { id: 2, nom: 'Campagne 2024 - Contre-saison', saison: 'Sèche', dateDebut: '2024-11-01', dateFin: '2025-03-31', statut: 'Planifiée', planteurs: 42, cultures: ['Tomates', 'Oignons'], progression: 0 },
    { id: 3, nom: 'Campagne 2023 - Saison Pluvieuse', saison: 'Pluvieuse', dateDebut: '2023-06-01', dateFin: '2023-10-31', statut: 'Terminée', planteurs: 78, cultures: ['Mil', 'Maïs', 'Riz'], progression: 100 },
  ])

  const [formData, setFormData] = useState({ nom: '', saison: 'Pluvieuse', dateDebut: '', dateFin: '', description: '', cultures: '' })

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showNotif('✅ Campagne créée avec succès !')
    setShowForm(false)
    setFormData({ nom: '', saison: 'Pluvieuse', dateDebut: '', dateFin: '', description: '', cultures: '' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div className="erp-notification">{notification}</div>}
      
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>🌾 Campagnes Agricoles</h1>
            <span style={{ color: '#999', fontSize: '13px' }}>({campagnes.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Campagne'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {/* Formulaire */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '24px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Nouvelle Campagne Agricole</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nom de la campagne *</label>
                  <input className="erp-input" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Ex: Campagne 2024 - Saison Pluvieuse" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Saison *</label>
                  <select className="erp-select" value={formData.saison} onChange={e => setFormData({...formData, saison: e.target.value})}>
                    <option value="Pluvieuse">🌧️ Saison Pluvieuse</option>
                    <option value="Sèche">☀️ Saison Sèche</option>
                    <option value="Contre-saison">🌤️ Contre-saison</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date début *</label>
                  <input className="erp-input" type="date" required value={formData.dateDebut} onChange={e => setFormData({...formData, dateDebut: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date fin *</label>
                  <input className="erp-input" type="date" required value={formData.dateFin} onChange={e => setFormData({...formData, dateFin: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Cultures prévues</label>
                  <input className="erp-input" value={formData.cultures} onChange={e => setFormData({...formData, cultures: e.target.value})} placeholder="Ex: Mil, Maïs, Sorgho" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Description</label>
                  <textarea className="erp-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description de la campagne..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Créer la campagne</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des campagnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
          {campagnes.map(c => (
            <div key={c.id} className="erp-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>{c.nom}</h3>
                  <span className={`erp-badge ${c.statut === 'En cours' ? 'erp-badge-success' : c.statut === 'Planifiée' ? 'erp-badge-warning' : 'erp-badge-secondary'}`}>
                    {c.statut}
                  </span>
                </div>
                <span style={{ fontSize: '24px' }}>{c.saison === 'Pluvieuse' ? '🌧️' : c.saison === 'Sèche' ? '☀️' : '🌤️'}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                <div>📅 Début: {c.dateDebut}</div>
                <div>📅 Fin: {c.dateFin}</div>
                <div>👨‍🌾 Planteurs: {c.planteurs}</div>
                <div>🌾 Cultures: {c.cultures.join(', ')}</div>
              </div>

              {/* Barre de progression */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#666' }}>Progression</span>
                  <span style={{ fontWeight: '600', color: c.progression === 100 ? '#10b981' : '#CC5500' }}>{c.progression}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.progression}%`, height: '100%', background: c.progression === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #CC5500, #E8661A)', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ Détails</button>
                <button style={{ flex: 1, padding: '8px', backgroundColor: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✏️ Modifier</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
