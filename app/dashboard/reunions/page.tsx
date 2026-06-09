'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function ReunionsPage() {
  const router = useRouter()
  const [reunions, setReunions] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showPV, setShowPV] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [activeTab, setActiveTab] = useState('liste')
  
  const [form, setForm] = useState({
    titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: ''
  })
  
  const [pvData, setPvData] = useState({
    president: '', secretaire: '', nombreParticipants: '', debutSeance: '', finSeance: '',
    ordreDuJour: '', deliberations: '', resolutions: '', votes: '', prochaineReunion: ''
  })

  useEffect(() => { 
    dataService.init()
    chargerReunions()
  }, [])
  
  const chargerReunions = () => {
    const r = dataService.getAll('data_reunions')
    if (r.length === 0) {
      const init = [
        { id: 1, titre: 'Assemblée Générale Annuelle', type: 'Assemblée Générale', date: '2024-06-15', heure: '10:00', lieu: 'Siège - Koudougou', statut: 'Planifiée', participants: 85, ordreDuJour: '1. Bilan annuel\n2. Élection du bureau\n3. Perspectives', pv: null },
        { id: 2, titre: 'Conseil d\'Administration Juin', type: 'Conseil d\'Administration', date: '2024-06-20', heure: '14:00', lieu: 'Salle de réunion', statut: 'Planifiée', participants: 12, ordreDuJour: '1. Approbation comptes\n2. Nouveaux membres', pv: null },
        { id: 3, titre: 'Formation Techniques Culturales', type: 'Formation', date: '2024-05-10', heure: '09:00', lieu: 'Centre Agricole', statut: 'Terminée', participants: 45, ordreDuJour: '1. Techniques de semis\n2. Gestion des intrants', pv: { dateRedaction: '2024-05-11', president: 'M. Diallo', secretaire: 'Mme Camara', nombreParticipants: '45', deliberations: 'Formation réussie', resolutions: 'Adoption des nouvelles techniques', votes: 'Unanimité' } },
      ]
      localStorage.setItem('data_reunions', JSON.stringify(init))
      setReunions(init)
    } else {
      setReunions(r)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.date) { showNotif('⚠️ Titre et date obligatoires'); return }
    
    const reunion = { ...form, participants: 0, statut: 'Planifiée', pv: null }

    if (editingId) {
      dataService.update('data_reunions', editingId, reunion)
      showNotif('✅ Réunion modifiée !')
    } else {
      dataService.create('data_reunions', reunion)
      showNotif('✅ Réunion planifiée !')
    }
    setShowForm(false); setEditingId(null)
    setForm({ titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: '' })
    chargerReunions()
  }

  const handleEdit = (r: any) => {
    setEditingId(r.id)
    setForm({ titre: r.titre || '', type: r.type || 'Assemblée Générale', date: r.date || '', heure: r.heure || '10:00', lieu: r.lieu || '', ordreDuJour: r.ordreDuJour || '', notes: r.notes || '' })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette réunion ?')) { dataService.delete('data_reunions', id); chargerReunions(); showNotif('🗑️ Supprimée !') }
  }

  const handleStatus = (id: number, statut: string) => {
    dataService.update('data_reunions', id, { statut }); chargerReunions()
    showNotif(`✅ Statut: "${statut}" !`)
  }

  const openPVEditor = (r: any) => {
    setPvData({
      president: r.pv?.president || '', secretaire: r.pv?.secretaire || '',
      nombreParticipants: r.pv?.nombreParticipants || r.participants?.toString() || '',
      debutSeance: r.pv?.debutSeance || r.heure || '10:00', finSeance: r.pv?.finSeance || '12:00',
      ordreDuJour: r.pv?.ordreDuJour || r.ordreDuJour || '',
      deliberations: r.pv?.deliberations || '', resolutions: r.pv?.resolutions || '',
      votes: r.pv?.votes || '', prochaineReunion: r.pv?.prochaineReunion || ''
    })
    setShowPV(r.id)
  }

  const handleSavePV = (e: React.FormEvent) => {
    e.preventDefault()
    dataService.update('data_reunions', showPV!, { 
      pv: { ...pvData, dateRedaction: new Date().toISOString().split('T')[0] }, 
      statut: 'Terminée' 
    })
    showNotif('✅ PV sauvegardé !'); setShowPV(null); chargerReunions()
  }

  const imprimerPV = (r: any) => {
    const pv = r.pv || {}
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>PV - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px}
.section{margin-bottom:20px}.section h3{font-size:14px;color:#CC5500;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #f0f0f0}
.section p{line-height:1.8;white-space:pre-line}
.signatures{display:flex;justify-content:space-between;margin-top:40px}.signature{text-align:center;width:45%}.signature-line{border-top:1px solid #1a1a1a;width:80%;margin:30px auto 8px}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>📋 PROCÈS-VERBAL</h2>
<div class="section"><h3>Informations</h3><p><strong>Réunion:</strong> ${r.titre}<br><strong>Type:</strong> ${r.type}<br><strong>Date:</strong> ${new Date(r.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}<br><strong>Lieu:</strong> ${r.lieu}<br><strong>Participants:</strong> ${pv.nombreParticipants || r.participants}</p></div>
<div class="section"><h3>Bureau</h3><p><strong>Président:</strong> ${pv.president || '_____________________'}<br><strong>Secrétaire:</strong> ${pv.secretaire || '_____________________'}</p></div>
<div class="section"><h3>Ordre du Jour</h3><p>${pv.ordreDuJour || r.ordreDuJour || 'Non défini'}</p></div>
<div class="section"><h3>Délibérations</h3><p>${pv.deliberations || 'En attente de rédaction'}</p></div>
<div class="section"><h3>Résolutions</h3><p>${pv.resolutions || 'En attente de rédaction'}</p></div>
<div class="section"><h3>Votes</h3><p>${pv.votes || 'En attente'}</p></div>
<div class="signatures"><div class="signature"><div class="signature-line"></div><p style="font-size:11px">Le Président</p></div><div class="signature"><div class="signature-line"></div><p style="font-size:11px">Le Secrétaire</p></div></div>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer le PV</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const filtered = reunions.filter(r => {
    const match = (r.titre || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filterType) return match && r.type === filterType
    return match
  })

  const types = ['Assemblée Générale', 'Conseil d\'Administration', 'Formation', 'Commission', 'Autre']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>📋 Réunions</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({reunions.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Planifier'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: '4px' }}>
        {[{ id: 'liste', label: '📋 Liste' }, { id: 'calendrier', label: '📅 Calendrier' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400', color: activeTab === tab.id ? '#3b82f6' : '#666', borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Formulaire */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>{editingId ? '✏️ Modifier' : '➕ Nouvelle Réunion'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Titre *</label><input required value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{...is, background: 'white'}}>{types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date *</label><input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Heure</label><input type="time" value={form.heure} onChange={e => setForm({...form, heure: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Lieu *</label><input required value={form.lieu} onChange={e => setForm({...form, lieu: e.target.value})} style={is} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Ordre du jour</label><textarea value={form.ordreDuJour} onChange={e => setForm({...form, ordreDuJour: e.target.value})} style={{...is, resize: 'vertical', minHeight: '60px'}} /></div>
              <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Planifier'}</button><button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
            </form>
          </div>
        )}

        {/* Éditeur PV */}
        {showPV && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '2px solid #3b82f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '700', margin: 0 }}>📝 Rédaction du PV</h3>
              <button onClick={() => setShowPV(null)} style={{ padding: '6px 12px', background: '#666', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕ Fermer</button>
            </div>
            <form onSubmit={handleSavePV}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Président *</label><input required value={pvData.president} onChange={e => setPvData({...pvData, president: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Secrétaire *</label><input required value={pvData.secretaire} onChange={e => setPvData({...pvData, secretaire: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Participants</label><input type="number" value={pvData.nombreParticipants} onChange={e => setPvData({...pvData, nombreParticipants: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Début</label><input type="time" value={pvData.debutSeance} onChange={e => setPvData({...pvData, debutSeance: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Fin</label><input type="time" value={pvData.finSeance} onChange={e => setPvData({...pvData, finSeance: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Prochaine réunion</label><input type="date" value={pvData.prochaineReunion} onChange={e => setPvData({...pvData, prochaineReunion: e.target.value})} style={is} /></div>
              </div>
              {['ordreDuJour', 'deliberations', 'resolutions', 'votes'].map(field => (
                <div key={field} style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px', textTransform: 'capitalize' }}>{field === 'ordreDuJour' ? 'Ordre du jour' : field === 'deliberations' ? 'Délibérations' : field === 'resolutions' ? 'Résolutions' : 'Votes'}</label>
                  <textarea value={(pvData as any)[field]} onChange={e => setPvData({...pvData, [field]: e.target.value})} style={{...is, resize: 'vertical', minHeight: field === 'ordreDuJour' ? '60px' : '80px'}} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Sauvegarder le PV</button><button type="button" onClick={() => imprimerPV(reunions.find(r => r.id === showPV)!)} style={{ padding: '10px 20px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🖨️ Imprimer</button></div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="">Tous types</option>{types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Liste */}
        {activeTab === 'liste' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}><div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div><p>Aucune réunion trouvée</p></div>
            ) : (
              filtered.map(r => (
                <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: r.statut === 'Planifiée' ? '#FFFBEB' : r.statut === 'En cours' ? '#EFF6FF' : '#ECFDF5', color: r.statut === 'Planifiée' ? '#f59e0b' : r.statut === 'En cours' ? '#3b82f6' : '#10b981' }}>{r.statut}</span>
                    <span style={{ fontSize: '11px', color: '#999' }}>{r.type}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0' }}>{r.titre}</h3>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8', marginBottom: '12px' }}>
                    <div>📅 {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {r.heure}</div>
                    <div>📍 {r.lieu}</div>
                    <div>👥 {r.participants || 0} participants</div>
                    {r.pv && <div style={{ color: '#10b981', fontWeight: '600' }}>📝 PV rédigé</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #F0F0F0', paddingTop: '12px' }}>
                    <button onClick={() => openPVEditor(r)} style={{ flex: 1, padding: '8px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>📝 {r.pv ? 'Voir PV' : 'Rédiger PV'}</button>
                    <select value={r.statut} onChange={e => handleStatus(r.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #E8E8E8', cursor: 'pointer', background: 'white' }}>
                      <option value="Planifiée">Planifiée</option><option value="En cours">En cours</option><option value="Terminée">Terminée</option>
                    </select>
                    <button onClick={() => imprimerPV(r)} style={{ padding: '8px', background: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🖨️</button>
                    <button onClick={() => handleEdit(r)} style={{ padding: '8px', background: '#EFF6FF', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Calendrier */}
        {activeTab === 'calendrier' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>📅 Calendrier des Réunions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reunions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: '#FAFAFA', borderRadius: '10px', borderLeft: `4px solid ${r.statut === 'Terminée' ? '#10b981' : r.statut === 'En cours' ? '#3b82f6' : '#f59e0b'}` }}>
                  <div style={{ textAlign: 'center', minWidth: '60px' }}><div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{new Date(r.date).getDate()}</div><div style={{ fontSize: '10px', color: '#999' }}>{new Date(r.date).toLocaleDateString('fr-FR', { month: 'short' })}</div></div>
                  <div style={{ flex: 1 }}><p style={{ fontWeight: '600', margin: 0 }}>{r.titre}</p><p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{r.heure} • {r.lieu} • {r.type}</p></div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: r.statut === 'Terminée' ? '#ECFDF5' : r.statut === 'En cours' ? '#EFF6FF' : '#FFFBEB', color: r.statut === 'Terminée' ? '#10b981' : r.statut === 'En cours' ? '#3b82f6' : '#f59e0b' }}>{r.statut}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
