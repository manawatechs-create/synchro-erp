'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function PlanteursPage() {
  const router = useRouter()
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [form, setForm] = useState({
    nom: '', prenom: '', telephone: '', email: '', village: '', region: '', departement: '',
    sexe: 'M', dateNaissance: '', superficie: '', typeCulture: '', adresse: '', notes: ''
  })

  useEffect(() => { dataService.init(); chargerPlanteurs() }, [])
  const chargerPlanteurs = () => setPlanteurs(dataService.getPlanteurs())
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const resetForm = () => setForm({ nom: '', prenom: '', telephone: '', email: '', village: '', region: '', departement: '', sexe: 'M', dateNaissance: '', superficie: '', typeCulture: '', adresse: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      superficie: form.superficie ? parseFloat(form.superficie) : null,
      identifiant: editingId ? undefined : `PLT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      statut: 'ACTIF',
      dateAdhesion: editingId ? undefined : new Date().toISOString().split('T')[0]
    }
    
    if (editingId) {
      dataService.update('data_planteurs', editingId, data)
      showNotif('✅ Producteur modifié avec succès !')
    } else {
      dataService.create('data_planteurs', data)
      showNotif('✅ Producteur ajouté avec succès !')
    }
    setShowForm(false); setEditingId(null); resetForm(); chargerPlanteurs()
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      nom: p.nom || '', prenom: p.prenom || '', telephone: p.telephone || '', email: p.email || '',
      village: p.village || '', region: p.region || '', departement: p.departement || '',
      sexe: p.sexe || 'M', dateNaissance: p.dateNaissance || '', superficie: p.superficie?.toString() || '',
      typeCulture: p.typeCulture || '', adresse: p.adresse || '', notes: p.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer définitivement ce producteur ?')) {
      dataService.delete('data_planteurs', id)
      chargerPlanteurs()
      showNotif('🗑️ Producteur supprimé !')
    }
  }

  const handleViewFiche = (id: number) => {
    router.push(`/dashboard/planteurs/${id}`)
  }

  const filtered = planteurs.filter(p => 
    `${p.nom} ${p.prenom} ${p.village} ${p.identifiant}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>👨‍🌾 Producteurs</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({planteurs.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm() }} style={{ padding: '8px 16px', background: showForm ? '#666' : '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouveau Producteur'}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Formulaire */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#CC5500', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier le producteur' : '➕ Nouveau producteur'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nom *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Prénom *</label><input required value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Téléphone *</label><input required value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Village *</label><input required value={form.village} onChange={e => setForm({...form, village: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Région</label><input value={form.region} onChange={e => setForm({...form, region: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Département</label><input value={form.departement} onChange={e => setForm({...form, departement: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type culture</label><select value={form.typeCulture} onChange={e => setForm({...form, typeCulture: e.target.value})} style={{...inputStyle, background: 'white'}}><option value="">Sélectionner</option><option>Céréales</option><option>Maraîchage</option><option>Arboriculture</option><option>Tubercules</option><option>Légumineuses</option><option>Mixte</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Superficie (ha)</label><input type="number" step="0.01" value={form.superficie} onChange={e => setForm({...form, superficie: e.target.value})} style={inputStyle} /></div>
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
        <input type="text" placeholder="🔍 Rechercher un producteur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        {/* Liste */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍🌾</div>
              <p>Aucun producteur trouvé</p>
              <button onClick={() => { setShowForm(true); resetForm() }} style={{ color: '#CC5500', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '8px' }}>+ Ajouter un producteur</button>
            </div>
          ) : (
            filtered.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#CC5500'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, #CC5500, #A34400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '700' }}>
                    {p.prenom?.charAt(0)}{p.nom?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 2px 0' }}>{p.prenom} {p.nom}</h3>
                    <p style={{ fontSize: '10px', color: '#CC5500', fontWeight: '600', margin: 0, fontFamily: 'monospace' }}>{p.identifiant}</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: p.statut === 'ACTIF' ? '#ECFDF5' : '#FEF2F2', color: p.statut === 'ACTIF' ? '#10b981' : '#ef4444' }}>{p.statut}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', color: '#666', marginBottom: '14px' }}>
                  <div>📱 {p.telephone}</div>
                  <div>🏘️ {p.village}</div>
                  <div>🗺️ {p.region || 'N/A'}</div>
                  <div>🌾 {p.typeCulture || 'N/A'}</div>
                  {p.superficie && <div>📐 {p.superficie} ha</div>}
                  <div>📅 {new Date(p.dateAdhesion).toLocaleDateString('fr-FR')}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F0F0F0', paddingTop: '12px' }}>
                  <button onClick={() => handleViewFiche(p.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ Fiche</button>
                  <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: '8px', backgroundColor: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✏️ Modifier</button>
                  <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ Supprimer</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px',
  fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box'
}
