'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function AchatsPage() {
  const router = useRouter()
  const [achats, setAchats] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({
    membreId: '', dateAchat: new Date().toISOString().split('T')[0], notes: ''
  })
  const [lignes, setLignes] = useState<any[]>([{ produitId: '', produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])

  useEffect(() => { 
    dataService.init()
    chargerAchats()
    setPlanteurs(dataService.getPlanteurs())
    setProduits(dataService.getProduits())
  }, [])
  
  const chargerAchats = () => setAchats(dataService.getAchats())
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }
  const getTotal = () => lignes.reduce((s, l) => s + (l.montant || 0), 0)

  const ajouterLigne = () => setLignes([...lignes, { produitId: '', produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])
  const supprimerLigne = (i: number) => { if (lignes.length > 1) setLignes(lignes.filter((_, idx) => idx !== i)) }
  
  const updateLigne = (i: number, field: string, value: string) => {
    const nl = [...lignes]
    nl[i][field] = value
    
    // Si on sélectionne un produit, auto-remplir le prix
    if (field === 'produitId' && value) {
      const prod = produits.find(p => p.id.toString() === value)
      if (prod) {
        nl[i].produit = prod.nom
        nl[i].prixUnitaire = prod.prixUnitaire?.toString() || ''
      }
    }
    
    if (field === 'quantite' || field === 'prixUnitaire') {
      nl[i].montant = (parseFloat(nl[i].quantite) || 0) * (parseFloat(nl[i].prixUnitaire) || 0)
    }
    setLignes(nl)
  }

  const resetForm = () => {
    setForm({ membreId: '', dateAchat: new Date().toISOString().split('T')[0], notes: '' })
    setLignes([{ produitId: '', produit: '', quantite: '1', prixUnitaire: '', montant: 0 }])
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fournisseur = planteurs.find(p => p.id.toString() === form.membreId)
    const achatData = {
      dateAchat: form.dateAchat,
      montantTotal: getTotal(),
      statut: 'VALIDEE',
      membreId: parseInt(form.membreId),
      membre: { prenom: fournisseur?.prenom || 'Fournisseur', nom: fournisseur?.nom || '' },
      notes: form.notes,
      produits: lignes.filter(l => l.produit && l.montant > 0)
    }

    if (editingId) {
      dataService.update('data_achats', editingId, achatData)
      showNotif('✅ Achat modifié avec succès !')
    } else {
      dataService.create('data_achats', achatData)
      // Ajouter en caisse (sortie)
      dataService.create('data_operations', {
        type: 'SORTIE', montant: getTotal(),
        motif: `Achat - ${fournisseur?.prenom || 'Fournisseur'} ${fournisseur?.nom || ''}`,
        modePaiement: 'ESPECES', dateOperation: form.dateAchat
      })
      showNotif('✅ Achat enregistré avec succès !')
    }
    setShowForm(false)
    resetForm()
    chargerAchats()
  }

  const handleEdit = (a: any) => {
    setEditingId(a.id)
    setForm({
      membreId: a.membreId?.toString() || '',
      dateAchat: a.dateAchat?.split('T')[0] || new Date().toISOString().split('T')[0],
      notes: a.notes || ''
    })
    if (a.produits && a.produits.length > 0) {
      setLignes(a.produits.map((p: any) => ({
        produitId: p.produitId || '',
        produit: p.produit || '',
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
      showNotif('🗑️ Achat supprimé !')
    }
  }

  const handleStatus = (id: number, newStatus: string) => {
    dataService.update('data_achats', id, { statut: newStatus })
    chargerAchats()
    showNotif(`✅ Statut changé en "${newStatus}" !`)
  }

  const filtered = achats.filter(a => {
    const fournisseur = `${a.membre?.prenom || ''} ${a.membre?.nom || ''}`.toLowerCase()
    return fournisseur.includes(searchTerm.toLowerCase()) || (a.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🛒 Achats</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({achats.length})</span>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#004D4D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvel Achat'}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Achats', value: `${totalAchats.toLocaleString()} FCFA`, icon: '🛒', color: '#004D4D' },
            { label: 'Nb Achats', value: achats.length, icon: '📊', color: '#CC5500' },
            { label: 'Validés', value: achats.filter(a => a.statut === 'VALIDEE').length, icon: '✅', color: '#10b981' },
            { label: 'En attente', value: achats.filter(a => a.statut !== 'VALIDEE').length, icon: '⏳', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire CRUD */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#004D4D', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier l\'achat' : '➕ Nouvel Achat'}
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Fournisseur + Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Fournisseur *</label>
                  <select required value={form.membreId} onChange={e => setForm({...form, membreId: e.target.value})} style={{...inputStyle, background: 'white'}}>
                    <option value="">Sélectionner un fournisseur</option>
                    {planteurs.map(p => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date *</label>
                  <input type="date" required value={form.dateAchat} onChange={e => setForm({...form, dateAchat: e.target.value})} style={inputStyle} />
                </div>
              </div>

              {/* Lignes de produits */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#1a1a1a' }}>📦 Produits achetés</h4>
                  <button type="button" onClick={ajouterLigne} style={{ padding: '5px 12px', background: '#FFF5F0', color: '#CC5500', border: '1px solid #CC550020', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                    + Ajouter un produit
                  </button>
                </div>
                
                {lignes.map((l, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '9px', color: '#999', display: 'block' }}>Produit</label>
                      <select value={l.produitId} onChange={e => updateLigne(i, 'produitId', e.target.value)} style={{...inputStyle, background: 'white'}}>
                        <option value="">Sélectionner</option>
                        {produits.map(p => (
                          <option key={p.id} value={p.id}>{p.nom} ({p.prixUnitaire} FCFA)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '9px', color: '#999', display: 'block' }}>Quantité</label>
                      <input type="number" min="1" value={l.quantite} onChange={e => updateLigne(i, 'quantite', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '9px', color: '#999', display: 'block' }}>Prix Unitaire</label>
                      <input type="number" value={l.prixUnitaire} onChange={e => updateLigne(i, 'prixUnitaire', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '9px', color: '#999', display: 'block' }}>Total</label>
                      <div style={{ padding: '10px', background: '#F5F5F5', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#004D4D' }}>
                        {(l.montant || 0).toLocaleString()} F
                      </div>
                    </div>
                    <button type="button" onClick={() => supprimerLigne(i)} style={{ padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Notes</label>
                <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Observations..." style={inputStyle} />
              </div>

              {/* Total */}
              <div style={{ textAlign: 'right', padding: '12px', background: '#F0F7F7', borderRadius: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#004D4D' }}>Total : {getTotal().toLocaleString()} FCFA</span>
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#004D4D', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {editingId ? '💾 Mettre à jour' : '💾 Enregistrer l\'achat'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); resetForm() }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recherche */}
        <input 
          type="text" 
          placeholder="🔍 Rechercher par fournisseur..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} 
        />

        {/* Tableau des achats */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Fournisseur</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Produits</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Montant</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666' }}>Statut</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛒</div>
                    Aucun achat enregistré
                    <br />
                    <button onClick={() => setShowForm(true)} style={{ color: '#CC5500', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '8px', fontSize: '13px' }}>
                      + Nouvel achat
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>
                      {new Date(a.dateAchat).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1a1a1a' }}>
                      {a.membre?.prenom} {a.membre?.nom}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>
                      {a.produits?.map((p: any) => p.produit).join(', ') || 'Produits'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#004D4D' }}>
                      {a.montantTotal?.toLocaleString()} FCFA
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <select 
                        value={a.statut} 
                        onChange={e => handleStatus(a.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: 'none', background: a.statut === 'VALIDEE' ? '#ECFDF5' : '#FFFBEB', color: a.statut === 'VALIDEE' ? '#10b981' : '#f59e0b', cursor: 'pointer' }}>
                        <option value="VALIDEE">✅ Validé</option>
                        <option value="EN_ATTENTE">⏳ En attente</option>
                        <option value="ANNULE">❌ Annulé</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(a)} style={{ padding: '5px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Modifier">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(a.id)} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Supprimer">
                          🗑️
                        </button>
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
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px',
  fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box'
}
