'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VentesPage() {
  const router = useRouter()
  const [ventes, setVentes] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [membres, setMembres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState('')
  const [formData, setFormData] = useState({
    membreId: '', notes: ''
  })
  const [lignes, setLignes] = useState<any[]>([
    { produitId: '', quantite: 1, prixUnitaire: 0 }
  ])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetchVentes()
    fetchProduits()
    fetchMembres()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchVentes = async () => {
    try {
      const response = await fetch('/api/ventes', { headers: getHeaders() })
      if (response.ok) setVentes(await response.json())
    } catch (error) { console.error(error) }
    finally { setLoading(false) }
  }

  const fetchProduits = async () => {
    try {
      const response = await fetch('/api/produits', { headers: getHeaders() })
      if (response.ok) setProduits(await response.json())
    } catch (error) { console.error(error) }
  }

  const fetchMembres = async () => {
    try {
      const response = await fetch('/api/membres', { headers: getHeaders() })
      if (response.ok) setMembres(await response.json())
    } catch (error) { console.error(error) }
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const ajouterLigne = () => {
    setLignes([...lignes, { produitId: '', quantite: 1, prixUnitaire: 0 }])
  }

  const supprimerLigne = (index: number) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter((_, i) => i !== index))
    }
  }

  const updateLigne = (index: number, field: string, value: any) => {
    const nouvellesLignes = [...lignes]
    nouvellesLignes[index][field] = value
    
    if (field === 'produitId' && value) {
      const produit = produits.find(p => p.id.toString() === value.toString())
      if (produit) {
        nouvellesLignes[index].prixUnitaire = produit.prixUnitaire
      }
    }
    
    setLignes(nouvellesLignes)
  }

  const calculerTotal = () => {
    return lignes.reduce((sum, l) => sum + (l.quantite * l.prixUnitaire), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const total = calculerTotal()
    
    try {
      const response = await fetch('/api/ventes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          membreId: parseInt(formData.membreId),
          montantTotal: total,
          notes: formData.notes,
          produits: lignes.map(l => ({
            produitId: parseInt(l.produitId),
            quantite: parseFloat(l.quantite),
            prixUnitaire: l.prixUnitaire,
            montant: l.quantite * l.prixUnitaire
          }))
        })
      })
      
      if (response.ok) {
        showNotification('✅ Vente enregistrée avec succès !')
        setShowForm(false)
        setFormData({ membreId: '', notes: '' })
        setLignes([{ produitId: '', quantite: 1, prixUnitaire: 0 }])
        fetchVentes()
      }
    } catch (error) { console.error(error) }
  }

  const totalVentes = ventes.reduce((sum, v) => sum + (v.montantTotal || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          backgroundColor: '#004D4D', color: 'white', padding: '14px 24px',
          borderRadius: '10px', boxShadow: '0 8px 25px rgba(0,77,77,0.3)',
          fontWeight: '600', fontSize: '14px'
        }}>{notification}</div>
      )}

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>💰 Gestion des Ventes</h1>
            <span style={{ color: '#999', fontSize: '13px' }}>({ventes.length})</span>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: '10px 20px', backgroundColor: showForm ? '#666' : '#CC5500',
            color: 'white', border: 'none', borderRadius: '10px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            boxShadow: showForm ? 'none' : '0 4px 12px rgba(204,85,0,0.25)'
          }}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Vente'}
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        {/* Formulaire de vente */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', border: '1px solid #E8E8E8', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#CC5500', marginBottom: '20px' }}>➕ Nouvelle Vente</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Client *</label>
                  <select required value={formData.membreId}
                    onChange={(e) => setFormData({...formData, membreId: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }}>
                    <option value="">Sélectionner un client</option>
                    {membres.map((m: any) => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Notes</label>
                  <input type="text" placeholder="Notes éventuelles..." value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Lignes de produits */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#1a1a1a', fontSize: '15px' }}>Produits</h4>
                  <button type="button" onClick={ajouterLigne} style={{
                    padding: '8px 16px', backgroundColor: '#F0F7F7', color: '#004D4D',
                    border: '1px solid #004D4D20', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '500'
                  }}>+ Ajouter une ligne</button>
                </div>
                
                {lignes.map((ligne, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#999' }}>Produit</label>
                      <select required value={ligne.produitId}
                        onChange={(e) => updateLigne(index, 'produitId', e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }}>
                        <option value="">Sélectionner</option>
                        {produits.map((p: any) => <option key={p.id} value={p.id}>{p.nom} ({p.prixUnitaire} FCFA)</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#999' }}>Quantité</label>
                      <input type="number" required min="1" value={ligne.quantite}
                        onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#999' }}>Prix unit.</label>
                      <input type="number" required value={ligne.prixUnitaire}
                        onChange={(e) => updateLigne(index, 'prixUnitaire', parseFloat(e.target.value))}
                        style={{ width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#999' }}>Sous-total</label>
                      <div style={{ padding: '10px', backgroundColor: '#F5F5F5', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#CC5500' }}>
                        {(ligne.quantite * ligne.prixUnitaire).toLocaleString()} F
                      </div>
                    </div>
                    <button type="button" onClick={() => supprimerLigne(index)}
                      style={{ padding: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right', padding: '16px', backgroundColor: '#FFF5F0', borderRadius: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500' }}>
                  Total : {calculerTotal().toLocaleString()} FCFA
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{
                  padding: '12px 28px', background: 'linear-gradient(135deg, #CC5500, #A34400)',
                  color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(204,85,0,0.25)'
                }}>💾 Enregistrer la vente</button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '12px 28px', backgroundColor: '#F0F0F0', color: '#666',
                  border: '1px solid #E8E8E8', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px'
                }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total des ventes', value: `${totalVentes.toLocaleString()} FCFA`, color: '#CC5500', bg: '#FFF5F0' },
            { label: 'Nombre de ventes', value: ventes.length.toString(), color: '#004D4D', bg: '#F0F7F7' },
            { label: 'Moyenne par vente', value: `${ventes.length > 0 ? Math.round(totalVentes / ventes.length).toLocaleString() : 0} FCFA`, color: '#E8661A', bg: '#FFF8F5' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: '12px' }}>Client</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: '12px' }}>Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', color: '#666', fontSize: '12px' }}>Montant</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#666', fontSize: '12px' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#999' }}>⏳ Chargement...</td></tr>
                ) : ventes.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💰</div>
                    <p>Aucune vente enregistrée</p>
                  </td></tr>
                ) : (
                  ventes.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1a1a1a' }}>
                        {v.membre?.prenom} {v.membre?.nom}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#666', fontSize: '13px' }}>
                        {new Date(v.dateVente).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: '#CC5500' }}>
                        {v.montantTotal?.toLocaleString()} FCFA
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                          backgroundColor: v.statut === 'VALIDEE' ? '#F0F7F7' : '#FFF5F0',
                          color: v.statut === 'VALIDEE' ? '#004D4D' : '#CC5500'
                        }}>{v.statut}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
