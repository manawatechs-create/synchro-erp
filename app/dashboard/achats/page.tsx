'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { useApp } from '@/context/AppContext'

export default function AchatsPage() {
  const router = useRouter()
  const { addNotification } = useApp()
  const [achats, setAchats] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState('')

  const [formData, setFormData] = useState({
    membreId: '', dateAchat: new Date().toISOString().split('T')[0], notes: ''
  })
  const [lignes, setLignes] = useState<any[]>([{ produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])

  useEffect(() => {
    chargerAchats()
    setPlanteurs(dataService.getPlanteurs())
  }, [])

  const chargerAchats = () => setAchats(dataService.getAchats())

  const getTotal = () => lignes.reduce((s, l) => s + (parseFloat(l.montant) || 0), 0)

  const ajouterLigne = () => setLignes([...lignes, { produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])

  const supprimerLigne = (i: number) => {
    if (lignes.length > 1) setLignes(lignes.filter((_, idx) => idx !== i))
  }

  const updateLigne = (i: number, field: string, value: string) => {
    const nl = [...lignes]
    nl[i][field] = value
    if (field === 'quantite' || field === 'prixUnitaire') {
      nl[i].montant = (parseFloat(nl[i].quantite) || 0) * (parseFloat(nl[i].prixUnitaire) || 0)
    }
    setLignes(nl)
  }

  const resetForm = () => {
    setFormData({ membreId: '', dateAchat: new Date().toISOString().split('T')[0], notes: '' })
    setLignes([{ produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fournisseur = planteurs.find(p => p.id.toString() === formData.membreId)
    const nouvelAchat = {
      dateAchat: formData.dateAchat,
      montantTotal: getTotal(),
      statut: 'VALIDEE',
      membreId: parseInt(formData.membreId),
      membre: { prenom: fournisseur?.prenom || '', nom: fournisseur?.nom || '' },
      notes: formData.notes,
      produits: lignes.filter(l => l.produit && parseFloat(l.montant) > 0)
    }

    if (editingId) {
      dataService.update('data_achats', editingId, nouvelAchat)
      addNotification({ type: 'success', message: '✅ Achat modifié avec succès !' })
    } else {
      dataService.create('data_achats', nouvelAchat)
      // Ajouter en sortie de caisse
      dataService.create('data_operations', {
        type: 'SORTIE',
        montant: getTotal(),
        motif: `Achat - ${fournisseur?.prenom || ''} ${fournisseur?.nom || ''}`,
        modePaiement: 'ESPECES',
        dateOperation: formData.dateAchat,
        reference: `ACH-${Date.now().toString().slice(-6)}`
      })
      addNotification({ type: 'success', message: '✅ Achat enregistré avec succès !' })
    }

    setShowForm(false)
    setEditingId(null)
    resetForm()
    chargerAchats()
  }

  const handleEdit = (achat: any) => {
    setEditingId(achat.id)
    setFormData({
      membreId: achat.membreId?.toString() || '',
      dateAchat: achat.dateAchat,
      notes: achat.notes || ''
    })
    if (achat.produits && achat.produits.length > 0) {
      setLignes(achat.produits.map((p: any) => ({
        produit: p.produit || p.nom || '',
        quantite: p.quantite?.toString() || '1',
        prixUnitaire: p.prixUnitaire?.toString() || '',
        montant: p.montant || 0
      })))
    }
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cet achat ?')) {
      dataService.delete('data_achats', id)
      chargerAchats()
      addNotification({ type: 'success', message: '🗑️ Achat supprimé !' })
    }
  }

  const filteredAchats = achats.filter(a => {
    const match = `${a.membre?.prenom} ${a.membre?.nom} ${a.notes}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchS = !filterStatut || a.statut === filterStatut
    return match && matchS
  })

  const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🛒 Gestion des Achats</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({achats.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }}>
            {showForm ? '✕ Annuler' : '+ Nouvel Achat'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {/* KPIs */}
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Total Achats', value: `${totalAchats.toLocaleString()} FCFA`, icon: '🛒', color: '#004D4D' },
            { label: 'Nb Achats', value: achats.length, icon: '📊', color: '#CC5500' },
            { label: 'Validés', value: achats.filter(a => a.statut === 'VALIDEE').length, icon: '✅', color: '#10b981' },
            { label: 'En attente', value: achats.filter(a => a.statut !== 'VALIDEE').length, icon: '⏳', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
              </div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '10px 0 4px' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#004D4D', marginBottom: '20px' }}>
              {editingId ? '✏️ Modifier l\'achat' : '➕ Nouvel Achat'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Fournisseur *</label>
                  <select className="erp-select" required value={formData.membreId} onChange={e => setFormData({...formData, membreId: e.target.value})}>
                    <option value="">Sélectionner un fournisseur</option>
                    {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date *</label>
                  <input className="erp-input" type="date" required value={formData.dateAchat} onChange={e => setFormData({...formData, dateAchat: e.target.value})} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Notes</label>
                  <input className="erp-input" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Observations..." />
                </div>
              </div>

              {/* Lignes de produits */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '14px' }}>📦 Produits achetés</h4>
                  <button type="button" onClick={ajouterLigne} style={{
                    padding: '6px 14px', backgroundColor: '#F0F7F7', color: '#004D4D',
                    border: '1px solid #004D4D20', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '500'
                  }}>+ Ajouter un produit</button>
                </div>
                {lignes.map((l, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#999', display: 'block', marginBottom: '2px' }}>Produit</label>
                      <input className="erp-input" required value={l.produit} onChange={e => updateLigne(i, 'produit', e.target.value)} placeholder="Nom du produit" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#999', display: 'block', marginBottom: '2px' }}>Quantité</label>
                      <input className="erp-input" type="number" required min="1" value={l.quantite} onChange={e => updateLigne(i, 'quantite', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#999', display: 'block', marginBottom: '2px' }}>Prix unit.</label>
                      <input className="erp-input" type="number" required value={l.prixUnitaire} onChange={e => updateLigne(i, 'prixUnitaire', e.target.value)} placeholder="FCFA" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#999', display: 'block', marginBottom: '2px' }}>Total</label>
                      <div style={{ padding: '10px', backgroundColor: '#F5F5F5', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#004D4D' }}>
                        {(l.montant || 0).toLocaleString()} F
                      </div>
                    </div>
                    <button type="button" onClick={() => supprimerLigne(i)}
                      style={{ padding: '8px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right', padding: '14px', backgroundColor: '#F0F7F7', borderRadius: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#004D4D' }}>
                  Total : {getTotal().toLocaleString()} FCFA
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 {editingId ? 'Mettre à jour' : 'Enregistrer l\'achat'}</button>
                <button type="button" className="erp-btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); resetForm() }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input className="erp-input" style={{ flex: '1 1 300px' }} placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select className="erp-select" style={{ width: '180px' }} value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="VALIDEE">Validés</option>
            <option value="EN_ATTENTE">En attente</option>
          </select>
        </div>

        {/* Tableau */}
        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead><tr><th>Date</th><th>Fournisseur</th><th>Produits</th><th style={{ textAlign: 'right' }}>Montant</th><th style={{ textAlign: 'center' }}>Statut</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
              <tbody>
                {filteredAchats.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                    <p>Aucun achat trouvé</p>
                  </td></tr>
                ) : (
                  filteredAchats.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(a.dateAchat).toLocaleDateString('fr-FR')}</td>
                      <td style={{ fontWeight: '600', color: 'var(--text)' }}>{a.membre?.prenom} {a.membre?.nom}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {a.produits?.map((p: any) => p.produit || p.nom).join(', ') || 'Produits'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#004D4D' }}>{a.montantTotal?.toLocaleString()} FCFA</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`erp-badge ${a.statut === 'VALIDEE' ? 'erp-badge-success' : 'erp-badge-warning'}`}>{a.statut}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(a)} style={{ padding: '6px 10px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                          <button onClick={() => handleDelete(a.id)} style={{ padding: '6px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
