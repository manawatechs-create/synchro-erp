'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function ProduitsPage() {
  const router = useRouter()
  const [produits, setProduits] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [form, setForm] = useState({
    nom: '', description: '', prixUnitaire: '', quantiteStock: '', uniteMesure: 'kg', categorieNom: ''
  })

  useEffect(() => { dataService.init(); chargerProduits() }, [])
  const chargerProduits = () => setProduits(dataService.getProduits())
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }
  const resetForm = () => setForm({ nom: '', description: '', prixUnitaire: '', quantiteStock: '', uniteMesure: 'kg', categorieNom: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      prixUnitaire: parseFloat(form.prixUnitaire),
      quantiteStock: parseInt(form.quantiteStock),
      categorie: { nom: form.categorieNom || 'Non classé' }
    }
    if (editingId) {
      dataService.update('data_produits', editingId, data)
      showNotif('✅ Produit modifié !')
    } else {
      dataService.create('data_produits', data)
      showNotif('✅ Produit ajouté !')
    }
    setShowForm(false); setEditingId(null); resetForm(); chargerProduits()
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      nom: p.nom || '', description: p.description || '', prixUnitaire: p.prixUnitaire?.toString() || '',
      quantiteStock: p.quantiteStock?.toString() || '', uniteMesure: p.uniteMesure || 'kg',
      categorieNom: p.categorie?.nom || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      dataService.delete('data_produits', id)
      chargerProduits()
      showNotif('🗑️ Produit supprimé !')
    }
  }

  const handleAddStock = (id: number, nom: string) => {
    const qte = prompt(`Quantité à ajouter au stock de "${nom}" ?`, '50')
    if (qte && parseInt(qte) > 0) {
      const p = produits.find(x => x.id === id)
      if (p) {
        dataService.update('data_produits', id, { quantiteStock: (p.quantiteStock || 0) + parseInt(qte) })
        chargerProduits()
        showNotif(`✅ ${qte} unités ajoutées au stock de ${nom} !`)
      }
    }
  }

  const filtered = produits.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categorie?.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>📦 Produits</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({produits.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }} style={{ padding: '8px 16px', background: showForm ? '#666' : '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouveau Produit'}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Produits', value: produits.length, color: '#CC5500', icon: '📦' },
            { label: 'Valeur Stock', value: `${produits.reduce((s, p) => s + ((p.prixUnitaire || 0) * (p.quantiteStock || 0)), 0).toLocaleString()} FCFA`, color: '#10b981', icon: '💰' },
            { label: 'Stock Total', value: produits.reduce((s, p) => s + (p.quantiteStock || 0), 0), color: '#004D4D', icon: '📊' },
            { label: 'Stock Faible', value: produits.filter(p => (p.quantiteStock || 0) < 50).length, color: '#ef4444', icon: '⚠️' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#CC5500', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nom du produit *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Ex: Tomates fraîches" style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Catégorie</label><input value={form.categorieNom} onChange={e => setForm({...form, categorieNom: e.target.value})} placeholder="Ex: Légumes" style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Prix unitaire (FCFA) *</label><input type="number" required value={form.prixUnitaire} onChange={e => setForm({...form, prixUnitaire: e.target.value})} placeholder="500" style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Quantité en stock *</label><input type="number" required value={form.quantiteStock} onChange={e => setForm({...form, quantiteStock: e.target.value})} placeholder="100" style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Unité de mesure</label><select value={form.uniteMesure} onChange={e => setForm({...form, uniteMesure: e.target.value})} style={{...inputStyle, background: 'white'}}><option value="kg">Kilogramme (kg)</option><option value="tonne">Tonne</option><option value="sac">Sac</option><option value="pièce">Pièce</option><option value="litre">Litre</option></select></div>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description du produit..." style={{...inputStyle, resize: 'vertical', minHeight: '60px'}} /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); resetForm() }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Recherche */}
        <input type="text" placeholder="🔍 Rechercher un produit..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        {/* Tableau */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Produit</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666' }}>Catégorie</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Prix</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Stock</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666' }}>Unité</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666' }}>Valeur</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📦</div>Aucun produit trouvé
                </td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{p.nom}</span>
                      {p.description && <div style={{ fontSize: '11px', color: '#999' }}>{p.description.substring(0, 40)}</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: '#FFF5F0', color: '#CC5500' }}>{p.categorie?.nom || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#CC5500' }}>{p.prixUnitaire?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', color: (p.quantiteStock || 0) < 50 ? '#ef4444' : '#004D4D' }}>{p.quantiteStock}</span>
                      {(p.quantiteStock || 0) < 50 && <span style={{ fontSize: '10px', color: '#ef4444', marginLeft: '4px' }}>⚠️</span>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#666' }}>{p.uniteMesure}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{((p.prixUnitaire || 0) * (p.quantiteStock || 0)).toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleAddStock(p.id, p.nom)} style={{ padding: '5px 10px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Ajouter au stock">📥</button>
                        <button onClick={() => handleEdit(p)} style={{ padding: '5px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Modifier">✏️</button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Supprimer">🗑️</button>
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
