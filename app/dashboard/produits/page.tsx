'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { useApp } from '@/context/AppContext'

export default function ProduitsPage() {
  const router = useRouter()
  const { addNotification } = useApp()
  const [produits, setProduits] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')

  const [formData, setFormData] = useState({
    nom: '', description: '', prixUnitaire: '', quantiteStock: '', uniteMesure: 'kg', categorieId: ''
  })

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = () => {
    setProduits(dataService.getProduits())
    const cats = dataService.getCategories()
    if (cats.length === 0) {
      const initCats = [
        { id: 1, nom: 'Céréales', description: 'Mil, maïs, sorgho, riz' },
        { id: 2, nom: 'Légumes', description: 'Tomates, oignons, choux' },
        { id: 3, nom: 'Fruits', description: 'Mangues, bananes, papayes' },
        { id: 4, nom: 'Tubercules', description: 'Patates, ignames, manioc' },
      ]
      localStorage.setItem('data_categories', JSON.stringify(initCats))
      setCategories(initCats)
    } else {
      setCategories(cats)
    }
    setLoading(false)
  }

  const resetForm = () => setFormData({ nom: '', description: '', prixUnitaire: '', quantiteStock: '', uniteMesure: 'kg', categorieId: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const produitData = {
      ...formData,
      prixUnitaire: parseFloat(formData.prixUnitaire),
      quantiteStock: parseInt(formData.quantiteStock),
      categorieId: parseInt(formData.categorieId),
      categorie: categories.find(c => c.id === parseInt(formData.categorieId))
    }

    if (editingId) {
      dataService.update('data_produits', editingId, produitData)
      addNotification({ type: 'success', message: '✅ Produit modifié avec succès !' })
    } else {
      dataService.create('data_produits', produitData)
      addNotification({ type: 'success', message: '✅ Produit créé avec succès !' })
    }

    setShowForm(false)
    setEditingId(null)
    resetForm()
    chargerDonnees()
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id)
    setFormData({
      nom: p.nom,
      description: p.description || '',
      prixUnitaire: p.prixUnitaire?.toString() || '',
      quantiteStock: p.quantiteStock?.toString() || '',
      uniteMesure: p.uniteMesure || 'kg',
      categorieId: p.categorieId?.toString() || p.categorie?.id?.toString() || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      dataService.delete('data_produits', id)
      chargerDonnees()
      addNotification({ type: 'success', message: '🗑️ Produit supprimé !' })
    }
  }

  const handleAddStock = (id: number, nom: string) => {
    const qte = prompt(`Quantité à ajouter au stock de "${nom}" ?`, '50')
    if (qte && parseInt(qte) > 0) {
      const produit = produits.find(p => p.id === id)
      if (produit) {
        dataService.update('data_produits', id, { quantiteStock: produit.quantiteStock + parseInt(qte) })
        chargerDonnees()
        addNotification({ type: 'success', message: `✅ ${qte} unités ajoutées au stock de ${nom} !` })
      }
    }
  }

  const filteredProduits = produits.filter(p => {
    const match = p.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = !filterCategorie || p.categorieId?.toString() === filterCategorie || p.categorie?.id?.toString() === filterCategorie
    return match && matchCat
  })

  const totalStock = produits.reduce((s, p) => s + (p.quantiteStock || 0), 0)
  const stockFaible = produits.filter(p => (p.quantiteStock || 0) < 50).length
  const valeurStock = produits.reduce((s, p) => s + ((p.prixUnitaire || 0) * (p.quantiteStock || 0)), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>📦 Gestion des Produits</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({produits.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }}>
            {showForm ? '✕ Annuler' : '+ Nouveau Produit'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {/* KPIs */}
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Total Produits', value: produits.length, icon: '📦', color: '#CC5500' },
            { label: 'Stock Total', value: totalStock.toLocaleString(), icon: '📊', color: '#004D4D' },
            { label: 'Valeur Stock', value: `${valeurStock.toLocaleString()} FCFA`, icon: '💰', color: '#10b981' },
            { label: 'Stock Faible (<50)', value: stockFaible, icon: '⚠️', color: stockFaible > 0 ? '#ef4444' : '#10b981' },
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
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>
              {editingId ? '✏️ Modifier le produit' : '➕ Nouveau Produit'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nom du produit *</label>
                  <input className="erp-input" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Ex: Tomates fraîches" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Catégorie *</label>
                  <select className="erp-select" required value={formData.categorieId} onChange={e => setFormData({...formData, categorieId: e.target.value})}>
                    <option value="">Sélectionner</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Prix unitaire (FCFA) *</label>
                  <input className="erp-input" type="number" required value={formData.prixUnitaire} onChange={e => setFormData({...formData, prixUnitaire: e.target.value})} placeholder="500" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Quantité en stock *</label>
                  <input className="erp-input" type="number" required value={formData.quantiteStock} onChange={e => setFormData({...formData, quantiteStock: e.target.value})} placeholder="100" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Unité de mesure</label>
                  <select className="erp-select" value={formData.uniteMesure} onChange={e => setFormData({...formData, uniteMesure: e.target.value})}>
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="tonne">Tonne</option>
                    <option value="sac">Sac (50kg)</option>
                    <option value="pièce">Pièce</option>
                    <option value="régime">Régime</option>
                    <option value="litre">Litre</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Description</label>
                  <textarea className="erp-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description du produit..." style={{ minHeight: '60px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">{editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}</button>
                <button type="button" className="erp-btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); resetForm() }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input className="erp-input" style={{ flex: '1 1 300px' }} placeholder="🔍 Rechercher un produit..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select className="erp-select" style={{ width: '200px' }} value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>

        {/* Tableau */}
        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th style={{ textAlign: 'right' }}>Prix</th>
                  <th style={{ textAlign: 'right' }}>Stock</th>
                  <th style={{ textAlign: 'center' }}>Unité</th>
                  <th style={{ textAlign: 'right' }}>Valeur</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#999' }}>⏳ Chargement...</td></tr>
                ) : filteredProduits.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                    <p>Aucun produit trouvé</p>
                    <button onClick={() => setShowForm(true)} style={{ color: '#CC5500', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '8px', fontSize: '13px' }}>
                      + Ajouter un produit
                    </button>
                  </td></tr>
                ) : (
                  filteredProduits.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: '600', color: 'var(--text)', margin: '0 0 2px 0' }}>{p.nom}</p>
                          {p.description && <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{p.description.substring(0, 60)}</p>}
                        </div>
                      </td>
                      <td>
                        <span className="erp-badge erp-badge-primary">
                          {p.categorie?.nom || categories.find(c => c.id === p.categorieId)?.nom || 'N/A'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#CC5500' }}>{p.prixUnitaire?.toLocaleString()} FCFA</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: (p.quantiteStock || 0) < 50 ? '#ef4444' : '#004D4D' }}>
                          {p.quantiteStock}
                        </span>
                        {(p.quantiteStock || 0) < 50 && <span style={{ fontSize: '10px', color: '#ef4444', marginLeft: '4px' }}>⚠️</span>}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.uniteMesure}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                        {((p.prixUnitaire || 0) * (p.quantiteStock || 0)).toLocaleString()} FCFA
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleAddStock(p.id, p.nom)}
                            style={{ padding: '6px 10px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                            title="Ajouter au stock">
                            📥
                          </button>
                          <button onClick={() => handleEdit(p)}
                            style={{ padding: '6px 10px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                            title="Modifier">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(p.id)}
                            style={{ padding: '6px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                            title="Supprimer">
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
    </div>
  )
}
