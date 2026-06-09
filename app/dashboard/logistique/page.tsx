'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogistiquePage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState('')
  const [livraisons] = useState([
    { id: 1, reference: 'LIV-2024-001', origine: 'Koudougou', destination: 'Ouagadougou', dateDepart: '2024-06-01', statut: 'Livrée', transporteur: 'TransCargo', produits: 'Tomates (500kg)', frais: 25000 },
    { id: 2, reference: 'LIV-2024-002', origine: 'Réo', destination: 'Koudougou', dateDepart: '2024-06-05', statut: 'En cours', transporteur: 'SpeedLog', produits: 'Mil (1 tonne)', frais: 45000 },
    { id: 3, reference: 'LIV-2024-003', origine: 'Dédougou', destination: 'Bobo-Dioulasso', dateDepart: '2024-06-10', statut: 'Planifiée', transporteur: 'TransCargo', produits: 'Oignons (300kg)', frais: 35000 },
  ])

  const [formData, setFormData] = useState({ origine: '', destination: '', transporteur: '', dateDepart: '', produits: '', quantite: '', fraisTransport: '', notes: '' })

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showNotif('✅ Livraison enregistrée !')
    setShowForm(false)
    setFormData({ origine: '', destination: '', transporteur: '', dateDepart: '', produits: '', quantite: '', fraisTransport: '', notes: '' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div className="erp-notification">{notification}</div>}
      
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>📦 Logistique & Transport</h1>
            <span style={{ color: '#999', fontSize: '13px' }}>({livraisons.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Livraison'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Nouvelle Livraison</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Origine *</label><input className="erp-input" required value={formData.origine} onChange={e => setFormData({...formData, origine: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Destination *</label><input className="erp-input" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Transporteur</label><input className="erp-input" value={formData.transporteur} onChange={e => setFormData({...formData, transporteur: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date départ *</label><input className="erp-input" type="date" required value={formData.dateDepart} onChange={e => setFormData({...formData, dateDepart: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Produits</label><input className="erp-input" value={formData.produits} onChange={e => setFormData({...formData, produits: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Quantité</label><input className="erp-input" value={formData.quantite} onChange={e => setFormData({...formData, quantite: e.target.value})} /></div>
                <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Frais transport (FCFA)</label><input className="erp-input" type="number" value={formData.fraisTransport} onChange={e => setFormData({...formData, fraisTransport: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Enregistrer</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="erp-grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Livraisons', value: livraisons.length, color: '#CC5500' },
            { label: 'En cours', value: livraisons.filter(l => l.statut === 'En cours').length, color: '#f59e0b' },
            { label: 'Livrées', value: livraisons.filter(l => l.statut === 'Livrée').length, color: '#10b981' },
            { label: 'Frais total', value: `${livraisons.reduce((s, l) => s + l.frais, 0).toLocaleString()} FCFA`, color: '#004D4D' },
          ].map((s, i) => (
            <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '6px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead><tr><th>Référence</th><th>Origine</th><th>Destination</th><th>Date</th><th>Transporteur</th><th style={{ textAlign: 'right' }}>Frais</th><th style={{ textAlign: 'center' }}>Statut</th></tr></thead>
              <tbody>
                {livraisons.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: '600', color: '#CC5500' }}>{l.reference}</td>
                    <td>{l.origine}</td>
                    <td>{l.destination}</td>
                    <td>{l.dateDepart}</td>
                    <td>{l.transporteur}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>{l.frais.toLocaleString()} FCFA</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`erp-badge ${l.statut === 'Livrée' ? 'erp-badge-success' : l.statut === 'En cours' ? 'erp-badge-warning' : 'erp-badge-info'}`}>{l.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
