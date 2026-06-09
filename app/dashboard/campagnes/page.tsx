'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function CampagnesPage() {
  const router = useRouter()
  const [campagnes, setCampagnes] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSaison, setFilterSaison] = useState('')
  const [form, setForm] = useState({
    nom: '', saison: 'Pluvieuse', dateDebut: '', dateFin: '', description: '', cultures: '', planteurs: ''
  })

  useEffect(() => { 
    dataService.init()
    chargerCampagnes()
  }, [])
  
  const chargerCampagnes = () => {
    const camp = dataService.getAll('data_campagnes')
    if (camp.length === 0) {
      const init = [
        { id: 1, nom: 'Campagne 2024 - Saison Pluvieuse', saison: 'Pluvieuse', dateDebut: '2024-06-01', dateFin: '2024-10-31', statut: 'En cours', planteurs: 85, cultures: 'Mil, Maïs, Sorgho', progression: 65, description: 'Campagne principale' },
        { id: 2, nom: 'Campagne 2024 - Contre-saison', saison: 'Sèche', dateDebut: '2024-11-01', dateFin: '2025-03-31', statut: 'Planifiée', planteurs: 42, cultures: 'Tomates, Oignons', progression: 0, description: '' },
        { id: 3, nom: 'Campagne 2023 - Saison Pluvieuse', saison: 'Pluvieuse', dateDebut: '2023-06-01', dateFin: '2023-10-31', statut: 'Terminée', planteurs: 78, cultures: 'Mil, Maïs, Riz', progression: 100, description: 'Campagne record' },
      ]
      localStorage.setItem('data_campagnes', JSON.stringify(init))
      setCampagnes(init)
    } else {
      setCampagnes(camp)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom) { showNotif('⚠️ Le nom est obligatoire'); return }
    
    const campagne = {
      ...form,
      planteurs: parseInt(form.planteurs) || 0,
      progression: editingId ? undefined : 0,
      statut: editingId ? undefined : 'Planifiée'
    }

    if (editingId) {
      dataService.update('data_campagnes', editingId, campagne)
      showNotif('✅ Campagne modifiée !')
    } else {
      dataService.create('data_campagnes', campagne)
      showNotif('✅ Campagne créée !')
    }
    setShowForm(false)
    setEditingId(null)
    setForm({ nom: '', saison: 'Pluvieuse', dateDebut: '', dateFin: '', description: '', cultures: '', planteurs: '' })
    chargerCampagnes()
  }

  const handleEdit = (c: any) => {
    setEditingId(c.id)
    setForm({
      nom: c.nom || '', saison: c.saison || 'Pluvieuse', dateDebut: c.dateDebut || '', dateFin: c.dateFin || '',
      description: c.description || '', cultures: c.cultures || '', planteurs: c.planteurs?.toString() || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette campagne ?')) {
      dataService.delete('data_campagnes', id)
      chargerCampagnes()
      showNotif('🗑️ Campagne supprimée !')
    }
  }

  const handleStatus = (id: number, statut: string) => {
    dataService.update('data_campagnes', id, { statut })
    chargerCampagnes()
    showNotif(`✅ Statut changé en "${statut}" !`)
  }

  const handleProgression = (id: number, nom: string) => {
    const prog = prompt(`Progression de "${nom}" (0-100) ?`, '50')
    if (prog && !isNaN(parseInt(prog)) && parseInt(prog) >= 0 && parseInt(prog) <= 100) {
      const newProg = parseInt(prog)
      const newStatut = newProg === 100 ? 'Terminée' : newProg > 0 ? 'En cours' : 'Planifiée'
      dataService.update('data_campagnes', id, { progression: newProg, statut: newStatut })
      chargerCampagnes()
      showNotif(`✅ Progression mise à jour : ${newProg}%`)
    }
  }

  const imprimerRapportCampagne = (c: any) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rapport Campagne - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px}
.info-box{background:#FAFAFA;border:1px solid #e8e8e8;border-radius:8px;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.progress-bar{height:12px;background:#f0f0f0;border-radius:6px;overflow:hidden;margin:8px 0}
.progress-fill{height:100%;background:${c.progression===100?'#10b981':'#CC5500'};border-radius:6px;width:${c.progression}%}
table{width:100%;border-collapse:collapse}th{background:#FFF5F0;padding:10px;text-align:left;font-size:10px;color:#CC5500;border:1px solid #e8e8e8}td{padding:10px;border:1px solid #e8e8e8}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>🌾 Rapport de Campagne</h2>
<div class="info-box"><div><p><strong>Nom:</strong> ${c.nom}</p><p><strong>Saison:</strong> ${c.saison}</p></div><div><p><strong>Début:</strong> ${c.dateDebut}</p><p><strong>Fin:</strong> ${c.dateFin}</p></div><div><p><strong>Producteurs:</strong> ${c.planteurs}</p><p><strong>Cultures:</strong> ${c.cultures}</p></div><div><p><strong>Statut:</strong> ${c.statut}</p><p><strong>Progression:</strong> ${c.progression}%</p></div></div>
<div class="progress-bar"><div class="progress-fill"></div></div>
${c.description ? `<p style="margin-top:16px"><strong>Description:</strong> ${c.description}</p>` : ''}
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer le rapport</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const filtered = campagnes.filter(c => {
    const match = (c.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (c.cultures || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filterSaison) return match && c.saison === filterSaison
    return match
  })

  const totalPlanteurs = campagnes.reduce((s, c) => s + (parseInt(c.planteurs) || 0), 0)
  const enCours = campagnes.filter(c => c.statut === 'En cours').length
  const terminees = campagnes.filter(c => c.statut === 'Terminée').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🌾 Campagnes</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({campagnes.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ nom: '', saison: 'Pluvieuse', dateDebut: '', dateFin: '', description: '', cultures: '', planteurs: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvelle Campagne'}
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Campagnes', value: campagnes.length, icon: '🌾', color: '#10b981' },
            { label: 'En cours', value: enCours, icon: '🔄', color: '#3b82f6' },
            { label: 'Terminées', value: terminees, icon: '✅', color: '#004D4D' },
            { label: 'Total Producteurs', value: totalPlanteurs, icon: '👨‍🌾', color: '#CC5500' },
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
            <h3 style={{ color: '#10b981', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier la campagne' : '➕ Nouvelle Campagne Agricole'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nom de la campagne *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Ex: Campagne 2024 - Saison Pluvieuse" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Saison *</label><select value={form.saison} onChange={e => setForm({...form, saison: e.target.value})} style={{...is, background: 'white'}}><option value="Pluvieuse">🌧️ Pluvieuse</option><option value="Sèche">☀️ Sèche</option><option value="Contre-saison">🌤️ Contre-saison</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date début</label><input type="date" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date fin</label><input type="date" value={form.dateFin} onChange={e => setForm({...form, dateFin: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Cultures</label><input value={form.cultures} onChange={e => setForm({...form, cultures: e.target.value})} placeholder="Ex: Mil, Maïs, Sorgho" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nb Producteurs</label><input type="number" value={form.planteurs} onChange={e => setForm({...form, planteurs: e.target.value})} placeholder="85" style={is} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description..." style={{...is, resize: 'vertical', minHeight: '60px'}} /></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Créer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres + Recherche */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filterSaison} onChange={e => setFilterSaison(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="">Toutes saisons</option>
            <option value="Pluvieuse">🌧️ Pluvieuse</option>
            <option value="Sèche">☀️ Sèche</option>
            <option value="Contre-saison">🌤️ Contre-saison</option>
          </select>
        </div>

        {/* Liste */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌾</div>
              <p>Aucune campagne trouvée</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>{c.nom}</h3>
                    <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', background: c.saison === 'Pluvieuse' ? '#EFF6FF' : c.saison === 'Sèche' ? '#FFFBEB' : '#ECFDF5', color: c.saison === 'Pluvieuse' ? '#3b82f6' : c.saison === 'Sèche' ? '#f59e0b' : '#10b981' }}>{c.saison}</span>
                  </div>
                  <select value={c.statut} onChange={e => handleStatus(c.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: 'none', cursor: 'pointer',
                      background: c.statut === 'En cours' ? '#EFF6FF' : c.statut === 'Terminée' ? '#ECFDF5' : '#FFFBEB',
                      color: c.statut === 'En cours' ? '#3b82f6' : c.statut === 'Terminée' ? '#10b981' : '#f59e0b' }}>
                    <option value="Planifiée">📅 Planifiée</option>
                    <option value="En cours">🔄 En cours</option>
                    <option value="Terminée">✅ Terminée</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#666', marginBottom: '14px' }}>
                  <div>📅 {c.dateDebut} - {c.dateFin}</div>
                  <div>👨‍🌾 {c.planteurs} producteurs</div>
                  <div>🌾 {c.cultures}</div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                    <span style={{ color: '#999' }}>Progression</span>
                    <span style={{ fontWeight: '600', color: c.progression === 100 ? '#10b981' : '#CC5500', cursor: 'pointer' }} onClick={() => handleProgression(c.id, c.nom)}>
                      {c.progression}% ✏️
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progression}%`, height: '100%', background: c.progression === 100 ? '#10b981' : 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #F0F0F0', paddingTop: '12px' }}>
                  <button onClick={() => imprimerRapportCampagne(c)} style={{ flex: 1, padding: '8px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>🖨️ Rapport</button>
                  <button onClick={() => handleEdit(c)} style={{ padding: '8px 12px', background: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>✏️</button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: '8px 12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
