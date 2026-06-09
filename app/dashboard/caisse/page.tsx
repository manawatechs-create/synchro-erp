'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { imprimerRecu } from '@/services/printService'
import { useApp } from '@/context/AppContext'

export default function CaissePage() {
  const router = useRouter()
  const { addNotification } = useApp()
  const [operations, setOperations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ type: 'ENTREE', montant: '', motif: '', modePaiement: 'ESPECES', reference: '', notes: '' })

  useEffect(() => { chargerOperations() }, [])
  const chargerOperations = () => setOperations(dataService.getOperations())
  const solde = operations.reduce((s, o) => s + (o.type === 'ENTREE' ? o.montant : -o.montant), 0)
  const entrees = operations.filter(o => o.type === 'ENTREE').reduce((s, o) => s + o.montant, 0)
  const sorties = operations.filter(o => o.type === 'SORTIE').reduce((s, o) => s + o.montant, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const op = { ...formData, montant: parseFloat(formData.montant), dateOperation: new Date().toISOString().split('T')[0] }
    dataService.create('data_operations', op)
    addNotification({ type: 'success', message: '✅ Opération enregistrée !' })
    setShowForm(false); setFormData({ type: 'ENTREE', montant: '', motif: '', modePaiement: 'ESPECES', reference: '', notes: '' }); chargerOperations()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>💵 Caisse</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({operations.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Opération'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Solde', value: `${solde.toLocaleString()} FCFA`, color: solde >= 0 ? '#004D4D' : '#CC5500' },
            { label: 'Entrées', value: `${entrees.toLocaleString()} FCFA`, color: '#10b981' },
            { label: 'Sorties', value: `${sorties.toLocaleString()} FCFA`, color: '#ef4444' },
            { label: 'Opérations', value: operations.length, color: '#3b82f6' },
          ].map((s, i) => (
            <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '6px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Nouvelle Opération</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type *</label><select className="erp-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="ENTREE">💰 Entrée</option><option value="SORTIE">💸 Sortie</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Montant (FCFA) *</label><input className="erp-input" type="number" required value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Motif *</label><input className="erp-input" required value={formData.motif} onChange={e => setFormData({...formData, motif: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Mode de paiement</label><select className="erp-select" value={formData.modePaiement} onChange={e => setFormData({...formData, modePaiement: e.target.value})}><option value="ESPECES">Espèces</option><option value="ORANGE_MONEY">Orange Money</option><option value="MOOV_MONEY">Moov Money</option><option value="BANQUE">Banque</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Référence</label><input className="erp-input" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Enregistrer</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead><tr><th>Date</th><th>Motif</th><th style={{ textAlign: 'right' }}>Montant</th><th style={{ textAlign: 'center' }}>Type</th><th style={{ textAlign: 'center' }}>Mode</th><th style={{ textAlign: 'center' }}>Reçu</th></tr></thead>
              <tbody>
                {operations.map(o => (
                  <tr key={o.id}>
                    <td>{o.dateOperation}</td>
                    <td>{o.motif}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: o.type === 'ENTREE' ? '#10b981' : '#ef4444' }}>{o.type === 'ENTREE' ? '+' : '-'}{o.montant?.toLocaleString()} FCFA</td>
                    <td style={{ textAlign: 'center' }}><span className={`erp-badge ${o.type === 'ENTREE' ? 'erp-badge-success' : 'erp-badge-danger'}`}>{o.type}</span></td>
                    <td style={{ textAlign: 'center' }}>{o.modePaiement}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => imprimerRecu(o)} style={{ padding: '5px 10px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🧾</button>
                    </td>
                  </tr>
                ))}
                {operations.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Aucune opération</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
