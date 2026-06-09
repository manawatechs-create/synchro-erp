'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { useApp } from '@/context/AppContext'

export default function PlanteursPage() {
  const router = useRouter()
  const { addNotification } = useApp()
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVillage, setFilterVillage] = useState('')
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '', email: '', village: '', region: '', departement: '', sexe: 'M', dateNaissance: '', superficie: '', typeCulture: '', adresse: '', notes: '' })

  useEffect(() => { chargerPlanteurs() }, [])
  const chargerPlanteurs = () => setPlanteurs(dataService.getPlanteurs())
  const villages = [...new Set(planteurs.map(p => p.village).filter(Boolean))] as string[]
  const filtered = planteurs.filter(p => {
    const match = `${p.nom} ${p.prenom} ${p.identifiant} ${p.village}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchV = !filterVillage || p.village === filterVillage
    return match && matchV
  })

  const resetForm = () => setFormData({ nom: '', prenom: '', telephone: '', email: '', village: '', region: '', departement: '', sexe: 'M', dateNaissance: '', superficie: '', typeCulture: '', adresse: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      dataService.update('data_planteurs', editingId, formData)
      addNotification({ type: 'success', message: '✅ Planteur modifié !' })
    } else {
      const newPlanteur = { ...formData, identifiant: `PLT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`, statut: 'ACTIF', dateAdhesion: new Date().toISOString().split('T')[0] }
      dataService.create('data_planteurs', newPlanteur)
      addNotification({ type: 'success', message: '✅ Planteur créé !' })
    }
    setShowForm(false); setEditingId(null); resetForm(); chargerPlanteurs()
  }

  const handleEdit = (p: any) => { setEditingId(p.id); setFormData(p); setShowForm(true) }
  const handleDelete = (id: number) => { if (confirm('Supprimer ?')) { dataService.delete('data_planteurs', id); chargerPlanteurs(); addNotification({ type: 'success', message: '🗑️ Supprimé !' }) } }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>👨‍🌾 Planteurs</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({planteurs.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }}>
            {showForm ? '✕ Annuler' : '+ Nouveau Planteur'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>{editingId ? '✏️ Modifier' : '➕ Nouveau planteur'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nom *</label><input className="erp-input" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Prénom *</label><input className="erp-input" required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Téléphone *</label><input className="erp-input" required value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Email</label><input className="erp-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Village *</label><input className="erp-input" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Région</label><input className="erp-input" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type culture</label><select className="erp-select" value={formData.typeCulture} onChange={e => setFormData({...formData, typeCulture: e.target.value})}><option value="">Sélectionner</option><option>Céréales</option><option>Maraîchage</option><option>Arboriculture</option><option>Tubercules</option><option>Légumineuses</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Superficie (ha)</label><input className="erp-input" type="number" step="0.01" value={formData.superficie} onChange={e => setFormData({...formData, superficie: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">{editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}</button>
                <button type="button" className="erp-btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); resetForm() }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input className="erp-input" style={{ flex: '1 1 300px' }} placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select className="erp-select" style={{ width: '200px' }} value={filterVillage} onChange={e => setFilterVillage(e.target.value)}>
            <option value="">Tous les villages</option>
            {villages.map((v, i) => <option key={i} value={v}>{v}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
          {filtered.map(p => (
            <div key={p.id} className="erp-card" style={{ padding: '20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, #CC5500, #A34400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '700' }}>{p.prenom?.charAt(0)}{p.nom?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', margin: '0 0 2px 0' }}>{p.prenom} {p.nom}</h3>
                  <p style={{ fontSize: '10px', color: '#CC5500', fontWeight: '600', margin: 0, fontFamily: 'monospace' }}>{p.identifiant}</p>
                </div>
                <span className={`erp-badge ${p.statut === 'ACTIF' ? 'erp-badge-success' : 'erp-badge-danger'}`}>{p.statut}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <div>📱 {p.telephone}</div><div>🏘️ {p.village}</div>
                <div>🗺️ {p.region || 'N/A'}</div><div>🌾 {p.typeCulture || 'N/A'}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/planteurs/${p.id}`) }} style={{ flex: 1, padding: '7px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>👁️ Fiche</button>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(p) }} style={{ flex: 1, padding: '7px', backgroundColor: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>✏️</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }} style={{ flex: 1, padding: '7px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
