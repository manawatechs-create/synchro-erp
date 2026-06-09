'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function LoyaltyPage() {
  const router = useRouter()
  const [membres, setMembres] = useState<any[]>([])
  const [recompenses, setRecompenses] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [historique, setHistorique] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('points')
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('membres')

  const [pointsForm, setPointsForm] = useState({ planteurId: '', montantAchat: '', pointsGagnes: '', motif: '' })
  const [recompenseForm, setRecompenseForm] = useState({ nom: '', pointsRequis: '', description: '', stock: 'Illimité' })
  const [attributionForm, setAttributionForm] = useState({ planteurId: '', recompenseId: '' })

  useEffect(() => { 
    dataService.init()
    chargerDonnees()
    setPlanteurs(dataService.getPlanteurs())
  }, [])
  
  const chargerDonnees = () => {
    // Membres fidélité
    const mem = dataService.getAll('data_loyalty_membres')
    if (mem.length === 0) {
      const init = [
        { id: 1, nom: 'Amadou Diallo', planteurId: 1, points: 2500, grade: 'Or', visites: 48, progression: 83 },
        { id: 2, nom: 'Fatou Camara', planteurId: 2, points: 1800, grade: 'Argent', visites: 35, progression: 60 },
        { id: 3, nom: 'Ibrahim Koné', planteurId: 3, points: 3200, grade: 'Platine', visites: 62, progression: 100 },
        { id: 4, nom: 'Aïcha Ouédraogo', planteurId: 4, points: 900, grade: 'Bronze', visites: 18, progression: 30 },
        { id: 5, nom: 'Moussa Traoré', planteurId: 5, points: 4200, grade: 'Diamant', visites: 85, progression: 100 },
      ]
      localStorage.setItem('data_loyalty_membres', JSON.stringify(init))
      setMembres(init)
    } else { setMembres(mem) }

    // Récompenses
    const rec = dataService.getAll('data_loyalty_recompenses')
    if (rec.length === 0) {
      const init = [
        { id: 1, nom: 'Bon d\'achat 5,000 FCFA', pointsRequis: 500, description: 'Bon utilisable sur tous les produits', stock: 'Illimité' },
        { id: 2, nom: 'Réduction 5%', pointsRequis: 800, description: 'Réduction sur le prochain achat', stock: 'Illimité' },
        { id: 3, nom: 'Bon d\'achat 25,000 FCFA', pointsRequis: 2500, description: 'Bon utilisable sur tous les produits', stock: '50' },
        { id: 4, nom: 'Réduction 10%', pointsRequis: 1500, description: 'Réduction sur le prochain achat', stock: 'Illimité' },
        { id: 5, nom: 'Bon d\'achat 50,000 FCFA', pointsRequis: 3000, description: 'Bon utilisable sur tous les produits', stock: '20' },
        { id: 6, nom: 'Bon d\'achat 100,000 FCFA', pointsRequis: 4000, description: 'Bon utilisable sur tous les produits', stock: '10' },
      ]
      localStorage.setItem('data_loyalty_recompenses', JSON.stringify(init))
      setRecompenses(init)
    } else { setRecompenses(rec) }

    // Historique
    const hist = dataService.getAll('data_loyalty_historique')
    if (hist.length === 0) {
      const init = [
        { id: 1, date: new Date(Date.now()-86400000).toISOString().split('T')[0], membre: 'Amadou Diallo', action: 'Points gagnés', points: 150, detail: 'Achat de 150,000 FCFA' },
        { id: 2, date: new Date(Date.now()-172800000).toISOString().split('T')[0], membre: 'Fatou Camara', action: 'Récompense utilisée', points: -800, detail: 'Réduction 5%' },
        { id: 3, date: new Date(Date.now()-259200000).toISOString().split('T')[0], membre: 'Ibrahim Koné', action: 'Points bonus', points: 500, detail: 'Fidélité annuelle' },
      ]
      localStorage.setItem('data_loyalty_historique', JSON.stringify(init))
      setHistorique(init)
    } else { setHistorique(hist) }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const grades = [
    { nom: 'Bronze', min: 0, max: 999, couleur: '#cd7f32', icon: '🥉', bg: '#fdf6f0' },
    { nom: 'Argent', min: 1000, max: 1999, couleur: '#c0c0c0', icon: '🥈', bg: '#f8f8f8' },
    { nom: 'Or', min: 2000, max: 2999, couleur: '#ffd700', icon: '🥇', bg: '#fffdf0' },
    { nom: 'Platine', min: 3000, max: 3999, couleur: '#e5e4e2', icon: '💎', bg: '#fafafa' },
    { nom: 'Diamant', min: 4000, max: 99999, couleur: '#b9f2ff', icon: '👑', bg: '#f0faff' },
  ]

  const getGrade = (points: number) => {
    for (let i = grades.length - 1; i >= 0; i--) { if (points >= grades[i].min) return grades[i] }
    return grades[0]
  }

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === pointsForm.planteurId)
    const points = parseInt(pointsForm.pointsGagnes) || Math.round(parseFloat(pointsForm.montantAchat) * 0.01)
    if (!planteur) { showNotif('⚠️ Sélectionnez un producteur'); return }
    if (points <= 0) { showNotif('⚠️ Points invalides'); return }

    const mems = dataService.getAll('data_loyalty_membres')
    let membre = mems.find((m: any) => m.planteurId === planteur.id)
    if (membre) {
      membre.points += points; membre.visites += 1
      const g = getGrade(membre.points); membre.grade = g.nom
      dataService.update('data_loyalty_membres', membre.id, membre)
    } else {
      const g = getGrade(points)
      dataService.create('data_loyalty_membres', { nom: `${planteur.prenom} ${planteur.nom}`, planteurId: planteur.id, points, grade: g.nom, visites: 1, progression: Math.min(100, Math.round(points / 1000 * 100)) })
    }
    const h = dataService.getAll('data_loyalty_historique')
    h.unshift({ id: Date.now(), date: new Date().toISOString().split('T')[0], membre: `${planteur.prenom} ${planteur.nom}`, action: 'Points gagnés', points, detail: pointsForm.motif || `Achat de ${pointsForm.montantAchat || points * 100} FCFA` })
    localStorage.setItem('data_loyalty_historique', JSON.stringify(h))
    showNotif(`✅ ${points} points ajoutés !`)
    setShowForm(false); setPointsForm({ planteurId: '', montantAchat: '', pointsGagnes: '', motif: '' }); chargerDonnees()
  }

  const handleAddRecompense = (e: React.FormEvent) => {
    e.preventDefault()
    dataService.create('data_loyalty_recompenses', { ...recompenseForm, pointsRequis: parseInt(recompenseForm.pointsRequis) })
    showNotif('✅ Récompense créée !')
    setShowForm(false); setRecompenseForm({ nom: '', pointsRequis: '', description: '', stock: 'Illimité' }); chargerDonnees()
  }

  const handleAttribuer = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === attributionForm.planteurId)
    const rec = recompenses.find(r => r.id.toString() === attributionForm.recompenseId)
    if (!planteur || !rec) { showNotif('⚠️ Sélectionnez un producteur et une récompense'); return }
    const mems = dataService.getAll('data_loyalty_membres')
    const membre = mems.find((m: any) => m.planteurId === planteur.id)
    if (!membre || membre.points < rec.pointsRequis) { showNotif('⚠️ Points insuffisants'); return }
    membre.points -= rec.pointsRequis
    const g = getGrade(membre.points); membre.grade = g.nom
    dataService.update('data_loyalty_membres', membre.id, membre)
    const h = dataService.getAll('data_loyalty_historique')
    h.unshift({ id: Date.now(), date: new Date().toISOString().split('T')[0], membre: `${planteur.prenom} ${planteur.nom}`, action: 'Récompense utilisée', points: -rec.pointsRequis, detail: rec.nom })
    localStorage.setItem('data_loyalty_historique', JSON.stringify(h))
    showNotif(`🎁 ${rec.nom} attribué !`)
    setAttributionForm({ planteurId: '', recompenseId: '' }); chargerDonnees()
  }

  const handleDeleteMembre = (id: number) => { if (confirm('Supprimer ?')) { dataService.delete('data_loyalty_membres', id); chargerDonnees(); showNotif('🗑️ Supprimé !') } }
  const handleDeleteRecompense = (id: number) => { if (confirm('Supprimer ?')) { dataService.delete('data_loyalty_recompenses', id); chargerDonnees(); showNotif('🗑️ Supprimée !') } }

  const imprimerCarteFidelite = (m: any) => {
    const grade = getGrade(m.points)
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Carte Fidélité - Synchro ERP</title>
<style>@page{size:A6;margin:5mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:10px;color:#1a1a1a;padding:10px;text-align:center}
.card{border:3px solid ${grade.couleur};border-radius:12px;padding:16px;max-width:300px;margin:0 auto}
.card h2{font-size:14px;color:#CC5500;margin-bottom:4px}.card .grade{font-size:28px;margin:8px 0}.card .points{font-size:18px;font-weight:700;color:${grade.couleur}}
.footer{border-top:1px solid #eee;padding-top:8px;margin-top:12px;font-size:8px;color:#999}
.no-print{text-align:center;margin-top:12px}.no-print button{padding:8px 16px;background:#CC5500;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="card"><h2>Synchro ERP</h2><p style="font-size:8px;color:#CC5500">Carte de Fidélité</p><div class="grade">${grade.icon}</div><p style="font-weight:700;font-size:12px;color:${grade.couleur}">${grade.nom}</p><p style="font-size:12px;font-weight:600">${m.nom}</p><p class="points">${m.points?.toLocaleString()} points</p><p style="font-size:9px;color:#666">${m.visites} visites</p></div>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer la carte</button></div></body></html>`
    const w = window.open('', '_blank', 'width=400,height=500')
    if (w) { w.document.write(html); w.document.close() }
  }

  const totalPoints = membres.reduce((s, m) => s + m.points, 0)
  const totalVisites = membres.reduce((s, m) => s + m.visites, 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🏆 Fidélité</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({membres.length} membres)</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setFormType('points'); setPointsForm({ planteurId: '', montantAchat: '', pointsGagnes: '', motif: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#eab308', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Action'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: '4px' }}>
        {[{ id: 'membres', label: '👥 Membres' }, { id: 'grades', label: '🏅 Grades' }, { id: 'recompenses', label: '🎁 Récompenses' }, { id: 'historique', label: '📋 Historique' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400', color: activeTab === tab.id ? '#eab308' : '#666', borderBottom: activeTab === tab.id ? '3px solid #eab308' : '3px solid transparent' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '⭐', color: '#eab308' },
            { label: 'Membres', value: membres.length, icon: '👥', color: '#CC5500' },
            { label: 'Visites', value: totalVisites, icon: '🔄', color: '#10b981' },
            { label: 'Top Grade', value: membres.find(m => m.grade === 'Diamant') ? '👑 Diamant' : membres.find(m => m.grade === 'Platine') ? '💎 Platine' : '🥇 Or', icon: '🏆', color: '#8b5cf6' },
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
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => setFormType('points')} style={{ padding: '8px 16px', borderRadius: '8px', border: formType === 'points' ? '2px solid #eab308' : '1px solid #E8E8E8', background: formType === 'points' ? '#FEFCE8' : 'white', color: formType === 'points' ? '#eab308' : '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⭐ Ajouter points</button>
              <button onClick={() => setFormType('recompense')} style={{ padding: '8px 16px', borderRadius: '8px', border: formType === 'recompense' ? '2px solid #eab308' : '1px solid #E8E8E8', background: formType === 'recompense' ? '#FEFCE8' : 'white', color: formType === 'recompense' ? '#eab308' : '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎁 Créer récompense</button>
              <button onClick={() => setFormType('attribuer')} style={{ padding: '8px 16px', borderRadius: '8px', border: formType === 'attribuer' ? '2px solid #eab308' : '1px solid #E8E8E8', background: formType === 'attribuer' ? '#FEFCE8' : 'white', color: formType === 'attribuer' ? '#eab308' : '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎁 Attribuer</button>
            </div>
            {formType === 'points' && (
              <form onSubmit={handleAddPoints}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Producteur *</label><select required value={pointsForm.planteurId} onChange={e => setPointsForm({...pointsForm, planteurId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Montant achat (FCFA)</label><input type="number" value={pointsForm.montantAchat} onChange={e => setPointsForm({...pointsForm, montantAchat: e.target.value, pointsGagnes: Math.round(parseFloat(e.target.value)*0.01).toString()})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Points à ajouter *</label><input type="number" required value={pointsForm.pointsGagnes} onChange={e => setPointsForm({...pointsForm, pointsGagnes: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Motif</label><input value={pointsForm.motif} onChange={e => setPointsForm({...pointsForm, motif: e.target.value})} style={is} /></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#eab308', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⭐ Ajouter</button><button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
              </form>
            )}
            {formType === 'recompense' && (
              <form onSubmit={handleAddRecompense}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nom *</label><input required value={recompenseForm.nom} onChange={e => setRecompenseForm({...recompenseForm, nom: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Points requis *</label><input type="number" required value={recompenseForm.pointsRequis} onChange={e => setRecompenseForm({...recompenseForm, pointsRequis: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Stock</label><select value={recompenseForm.stock} onChange={e => setRecompenseForm({...recompenseForm, stock: e.target.value})} style={{...is, background: 'white'}}><option value="Illimité">Illimité</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></div>
                </div>
                <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Description</label><textarea value={recompenseForm.description} onChange={e => setRecompenseForm({...recompenseForm, description: e.target.value})} style={{...is, resize: 'vertical', minHeight: '50px'}} /></div>
                <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#eab308', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎁 Créer</button><button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
              </form>
            )}
            {formType === 'attribuer' && (
              <form onSubmit={handleAttribuer}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Producteur *</label><select required value={attributionForm.planteurId} onChange={e => setAttributionForm({...attributionForm, planteurId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Récompense *</label><select required value={attributionForm.recompenseId} onChange={e => setAttributionForm({...attributionForm, recompenseId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{recompenses.map(r => <option key={r.id} value={r.id}>{r.nom} ({r.pointsRequis} pts)</option>)}</select></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#eab308', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎁 Attribuer</button><button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
              </form>
            )}
          </div>
        )}

        {/* Membres */}
        {activeTab === 'membres' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Membre</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Grade</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Points</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Visites</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Progression</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Actions</th></tr></thead>
              <tbody>
                {membres.filter(m => (m.nom||'').toLowerCase().includes(searchTerm.toLowerCase())).map(m => {
                  const g = getGrade(m.points)
                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>{m.nom}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: g.bg, color: g.couleur }}>{g.icon} {g.nom}</span></td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#eab308' }}>{m.points?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>{m.visites}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '6px', background: '#F0F0F0', borderRadius: '3px', margin: '0 auto', overflow: 'hidden' }}><div style={{ width: `${Math.min(100, m.progression||0)}%`, height: '100%', background: '#eab308', borderRadius: '3px' }}></div></div>
                        <span style={{ fontSize: '10px', color: '#999' }}>{m.progression||0}%</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => imprimerCarteFidelite(m)} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🖨️</button>
                          <button onClick={() => handleDeleteMembre(m.id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grades */}
        {activeTab === 'grades' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {grades.map(g => (
              <div key={g.nom} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', border: `2px solid ${g.couleur}30` }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{g.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: g.couleur, margin: '0 0 6px 0' }}>{g.nom}</h3>
                <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>{g.min.toLocaleString()} - {g.max.toLocaleString()} pts</p>
                <span style={{ padding: '6px 14px', background: g.bg, borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: g.couleur }}>{membres.filter(m => getGrade(m.points).nom === g.nom).length} membre(s)</span>
              </div>
            ))}
          </div>
        )}

        {/* Récompenses */}
        {activeTab === 'recompenses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {recompenses.map(r => (
              <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1 }}><h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>{r.nom}</h4><div style={{ fontSize: '11px', color: '#999' }}>⭐ {r.pointsRequis} pts • 📦 {r.stock}</div></div>
                <button onClick={() => { setFormType('attribuer'); setShowForm(true); setAttributionForm({...attributionForm, recompenseId: r.id.toString()}) }} style={{ padding: '8px 14px', background: '#eab308', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Attribuer</button>
                <button onClick={() => handleDeleteRecompense(r.id)} style={{ padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        {/* Historique */}
        {activeTab === 'historique' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Date</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Membre</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Action</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Points</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Détail</th></tr></thead>
              <tbody>
                {historique.map((h: any) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>{h.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{h.membre}</td>
                    <td style={{ padding: '12px 16px' }}>{h.action}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: h.points > 0 ? '#10b981' : '#ef4444' }}>{h.points > 0 ? '+' : ''}{h.points}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{h.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
