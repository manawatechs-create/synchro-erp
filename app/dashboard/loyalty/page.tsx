'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../services/dataService'
import { useApp } from '../context/AppContext'

export default function LoyaltyPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [activeTab, setActiveTab] = useState('membres')
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('points') // 'points' ou 'recompense'
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [membres, setMembres] = useState<any[]>([])
  const [recompenses, setRecompenses] = useState<any[]>([])
  const [historique, setHistorique] = useState<any[]>([])

  // Formulaire points
  const [pointsForm, setPointsForm] = useState({
    planteurId: '', montantAchat: '', pointsGagnes: '', motif: ''
  })

  // Formulaire récompense
  const [recompenseForm, setRecompenseForm] = useState({
    nom: '', pointsRequis: '', description: '', stock: 'Illimité'
  })

  // Attribution récompense
  const [attributionForm, setAttributionForm] = useState({
    planteurId: '', recompenseId: ''
  })

  useEffect(() => {
    chargerDonnees()
    setPlanteurs(dataService.getPlanteurs())
  }, [])

  const chargerDonnees = () => {
    const membresData = dataService.getAll('data_loyalty_membres')
    if (membresData.length === 0) {
      // Initialiser avec les planteurs
      const planteurs = dataService.getPlanteurs()
      const initMembres = planteurs.map((p: any, i: number) => ({
        id: p.id,
        nom: `${p.prenom} ${p.nom}`,
        planteurId: p.id,
        points: Math.floor(Math.random() * 3000) + 200,
        grade: 'Bronze',
        visites: Math.floor(Math.random() * 50) + 5,
        recompense: 'Aucune',
        progression: 0
      }))
      // Ajuster les grades selon les points
      initMembres.forEach((m: any) => {
        if (m.points >= 4000) { m.grade = 'Diamant'; m.progression = 100 }
        else if (m.points >= 3000) { m.grade = 'Platine'; m.progression = 100 }
        else if (m.points >= 2000) { m.grade = 'Or'; m.progression = Math.round((m.points - 2000) / 1000 * 100) }
        else if (m.points >= 1000) { m.grade = 'Argent'; m.progression = Math.round((m.points - 1000) / 1000 * 100) }
        else { m.grade = 'Bronze'; m.progression = Math.round(m.points / 1000 * 100) }
      })
      localStorage.setItem('data_loyalty_membres', JSON.stringify(initMembres))
      setMembres(initMembres)
    } else {
      setMembres(membresData)
    }

    const recData = dataService.getAll('data_loyalty_recompenses')
    if (recData.length === 0) {
      const initRec = [
        { id: 1, nom: 'Bon d\'achat 5,000 FCFA', pointsRequis: 500, description: 'Bon utilisable sur tous les produits', stock: 'Illimité' },
        { id: 2, nom: 'Réduction 5%', pointsRequis: 800, description: 'Réduction sur le prochain achat', stock: 'Illimité' },
        { id: 3, nom: 'Bon d\'achat 25,000 FCFA', pointsRequis: 2500, description: 'Bon utilisable sur tous les produits', stock: '50' },
        { id: 4, nom: 'Réduction 10%', pointsRequis: 1500, description: 'Réduction sur le prochain achat', stock: 'Illimité' },
        { id: 5, nom: 'Bon d\'achat 50,000 FCFA', pointsRequis: 3000, description: 'Bon utilisable sur tous les produits', stock: '20' },
        { id: 6, nom: 'Bon d\'achat 100,000 FCFA', pointsRequis: 4000, description: 'Bon utilisable sur tous les produits', stock: '10' },
      ]
      localStorage.setItem('data_loyalty_recompenses', JSON.stringify(initRec))
      setRecompenses(initRec)
    } else {
      setRecompenses(recData)
    }

    const histData = dataService.getAll('data_loyalty_historique')
    if (histData.length === 0) {
      const initHist = [
        { id: 1, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], membre: 'Amadou Diallo', action: 'Points gagnés', points: 150, detail: 'Achat de 150,000 FCFA' },
        { id: 2, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], membre: 'Fatou Camara', action: 'Récompense utilisée', points: -800, detail: 'Réduction 5%' },
        { id: 3, date: new Date(Date.now() - 259200000).toISOString().split('T')[0], membre: 'Ibrahim Koné', action: 'Points bonus', points: 500, detail: 'Fidélité annuelle' },
      ]
      localStorage.setItem('data_loyalty_historique', JSON.stringify(initHist))
      setHistorique(initHist)
    } else {
      setHistorique(histData)
    }
  }

  const grades = [
    { nom: 'Bronze', min: 0, max: 999, couleur: '#cd7f32', icon: '🥉', bg: '#fdf6f0' },
    { nom: 'Argent', min: 1000, max: 1999, couleur: '#c0c0c0', icon: '🥈', bg: '#f8f8f8' },
    { nom: 'Or', min: 2000, max: 2999, couleur: '#ffd700', icon: '🥇', bg: '#fffdf0' },
    { nom: 'Platine', min: 3000, max: 3999, couleur: '#e5e4e2', icon: '💎', bg: '#fafafa' },
    { nom: 'Diamant', min: 4000, max: 99999, couleur: '#b9f2ff', icon: '👑', bg: '#f0faff' },
  ]

  const getGrade = (points: number) => {
    for (let i = grades.length - 1; i >= 0; i--) {
      if (points >= grades[i].min) return grades[i]
    }
    return grades[0]
  }

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === pointsForm.planteurId)
    const points = parseInt(pointsForm.pointsGagnes) || Math.round(parseFloat(pointsForm.montantAchat) * 0.01)
    
    if (!planteur) { addNotification({ type: 'alerte', message: '⚠️ Sélectionnez un planteur' }); return }
    if (points <= 0) { addNotification({ type: 'alerte', message: '⚠️ Points invalides' }); return }

    const membresActuels = dataService.getAll('data_loyalty_membres')
    let membre = membresActuels.find((m: any) => m.planteurId === planteur.id)
    
    if (membre) {
      membre.points += points
      membre.visites += 1
      const grade = getGrade(membre.points)
      membre.grade = grade.nom
      membre.progression = Math.min(100, Math.round((membre.points - (grade.nom === 'Bronze' ? 0 : grades[grades.indexOf(grade) - 1].max)) / (grade.max - (grade.nom === 'Bronze' ? 0 : grades[grades.indexOf(grade) - 1].max)) * 100))
      dataService.update('data_loyalty_membres', membre.id, membre)
    } else {
      const nouveau = {
        id: Date.now(),
        nom: `${planteur.prenom} ${planteur.nom}`,
        planteurId: planteur.id,
        points: points,
        grade: getGrade(points).nom,
        visites: 1,
        progression: Math.min(100, Math.round(points / 1000 * 100))
      }
      dataService.create('data_loyalty_membres', nouveau)
    }

    // Historique
    const hist = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      membre: `${planteur.prenom} ${planteur.nom}`,
      action: 'Points gagnés',
      points: points,
      detail: pointsForm.motif || `Achat de ${pointsForm.montantAchat || points * 100} FCFA`
    }
    const histActuel = dataService.getAll('data_loyalty_historique')
    histActuel.unshift(hist)
    localStorage.setItem('data_loyalty_historique', JSON.stringify(histActuel))

    addNotification({ type: 'success', message: `✅ ${points} points ajoutés à ${planteur.prenom} !` })
    setShowForm(false)
    setPointsForm({ planteurId: '', montantAchat: '', pointsGagnes: '', motif: '' })
    chargerDonnees()
  }

  const handleAddRecompense = (e: React.FormEvent) => {
    e.preventDefault()
    const nouvelle = {
      id: Date.now(),
      nom: recompenseForm.nom,
      pointsRequis: parseInt(recompenseForm.pointsRequis),
      description: recompenseForm.description,
      stock: recompenseForm.stock
    }
    dataService.create('data_loyalty_recompenses', nouvelle)
    addNotification({ type: 'success', message: '✅ Récompense ajoutée !' })
    setShowForm(false)
    setRecompenseForm({ nom: '', pointsRequis: '', description: '', stock: 'Illimité' })
    chargerDonnees()
  }

  const handleAttribuerRecompense = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === attributionForm.planteurId)
    const recompense = recompenses.find(r => r.id.toString() === attributionForm.recompenseId)
    
    if (!planteur || !recompense) {
      addNotification({ type: 'alerte', message: '⚠️ Sélectionnez un planteur et une récompense' })
      return
    }

    const membresActuels = dataService.getAll('data_loyalty_membres')
    const membre = membresActuels.find((m: any) => m.planteurId === planteur.id)
    
    if (!membre || membre.points < recompense.pointsRequis) {
      addNotification({ type: 'alerte', message: '⚠️ Points insuffisants pour cette récompense' })
      return
    }

    membre.points -= recompense.pointsRequis
    const grade = getGrade(membre.points)
    membre.grade = grade.nom
    dataService.update('data_loyalty_membres', membre.id, membre)

    // Historique
    const hist = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      membre: `${planteur.prenom} ${planteur.nom}`,
      action: 'Récompense utilisée',
      points: -recompense.pointsRequis,
      detail: recompense.nom
    }
    const histActuel = dataService.getAll('data_loyalty_historique')
    histActuel.unshift(hist)
    localStorage.setItem('data_loyalty_historique', JSON.stringify(histActuel))

    addNotification({ type: 'success', message: `🎁 ${recompense.nom} attribué à ${planteur.prenom} !` })
    setAttributionForm({ planteurId: '', recompenseId: '' })
    chargerDonnees()
  }

  const totalPoints = membres.reduce((s, m) => s + m.points, 0)
  const totalVisites = membres.reduce((s, m) => s + m.visites, 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🏆 Programme de Fidélité</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({membres.length} membres)</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setFormType('points') }}>
            {showForm ? '✕ Annuler' : '+ Action'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'membres', label: '👥 Membres' },
            { id: 'grades', label: '🏅 Grades' },
            { id: 'recompenses', label: '🎁 Récompenses' },
            { id: 'historique', label: '📋 Historique' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400',
              color: activeTab === tab.id ? couleurPrincipale : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? `3px solid ${couleurPrincipale}` : '3px solid transparent',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="erp-page-content">
        {/* KPIs */}
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '⭐', color: '#CC5500' },
            { label: 'Membres', value: membres.length, icon: '👥', color: '#004D4D' },
            { label: 'Visites', value: totalVisites, icon: '🔄', color: '#10b981' },
            { label: 'Top Grade', value: membres.filter(m => m.grade === 'Diamant').length > 0 ? 'Diamant' : membres.filter(m => m.grade === 'Platine').length > 0 ? 'Platine' : 'Or', icon: '👑', color: '#8b5cf6' },
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button onClick={() => setFormType('points')} style={{
                padding: '10px 20px', borderRadius: '8px', border: formType === 'points' ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: formType === 'points' ? couleurPrincipale + '10' : 'transparent',
                color: formType === 'points' ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px'
              }}>⭐ Ajouter des points</button>
              <button onClick={() => setFormType('recompense')} style={{
                padding: '10px 20px', borderRadius: '8px', border: formType === 'recompense' ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: formType === 'recompense' ? couleurPrincipale + '10' : 'transparent',
                color: formType === 'recompense' ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px'
              }}>🎁 Nouvelle Récompense</button>
              <button onClick={() => setFormType('attribuer')} style={{
                padding: '10px 20px', borderRadius: '8px', border: formType === 'attribuer' ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: formType === 'attribuer' ? couleurPrincipale + '10' : 'transparent',
                color: formType === 'attribuer' ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px'
              }}>🎁 Attribuer récompense</button>
            </div>

            {formType === 'points' && (
              <form onSubmit={handleAddPoints}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Planteur *</label>
                    <select className="erp-select" required value={pointsForm.planteurId} onChange={e => setPointsForm({...pointsForm, planteurId: e.target.value})}>
                      <option value="">Sélectionner un planteur</option>
                      {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Montant achat (FCFA)</label>
                    <input className="erp-input" type="number" value={pointsForm.montantAchat} onChange={e => setPointsForm({...pointsForm, montantAchat: e.target.value, pointsGagnes: Math.round(parseFloat(e.target.value) * 0.01).toString()})} placeholder="Ex: 150000" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Points à ajouter *</label>
                    <input className="erp-input" type="number" required value={pointsForm.pointsGagnes} onChange={e => setPointsForm({...pointsForm, pointsGagnes: e.target.value})} placeholder="Ex: 150" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Motif</label>
                    <input className="erp-input" value={pointsForm.motif} onChange={e => setPointsForm({...pointsForm, motif: e.target.value})} placeholder="Achat, bonus, etc." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="erp-btn-primary">⭐ Ajouter les points</button>
                  <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            )}

            {formType === 'recompense' && (
              <form onSubmit={handleAddRecompense}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nom de la récompense *</label>
                    <input className="erp-input" required value={recompenseForm.nom} onChange={e => setRecompenseForm({...recompenseForm, nom: e.target.value})} placeholder="Ex: Bon d'achat 10,000 FCFA" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Points requis *</label>
                    <input className="erp-input" type="number" required value={recompenseForm.pointsRequis} onChange={e => setRecompenseForm({...recompenseForm, pointsRequis: e.target.value})} placeholder="Ex: 1000" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Stock</label>
                    <select className="erp-select" value={recompenseForm.stock} onChange={e => setRecompenseForm({...recompenseForm, stock: e.target.value})}>
                      <option value="Illimité">Illimité</option><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Description</label>
                    <textarea className="erp-textarea" value={recompenseForm.description} onChange={e => setRecompenseForm({...recompenseForm, description: e.target.value})} placeholder="Description de la récompense..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="erp-btn-primary">🎁 Créer la récompense</button>
                  <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            )}

            {formType === 'attribuer' && (
              <form onSubmit={handleAttribuerRecompense}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Planteur *</label>
                    <select className="erp-select" required value={attributionForm.planteurId} onChange={e => setAttributionForm({...attributionForm, planteurId: e.target.value})}>
                      <option value="">Sélectionner</option>
                      {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Récompense *</label>
                    <select className="erp-select" required value={attributionForm.recompenseId} onChange={e => setAttributionForm({...attributionForm, recompenseId: e.target.value})}>
                      <option value="">Sélectionner</option>
                      {recompenses.map(r => <option key={r.id} value={r.id}>{r.nom} ({r.pointsRequis} pts)</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="erp-btn-primary">🎁 Attribuer</button>
                  <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Membres */}
        {activeTab === 'membres' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table" style={{ border: 'none' }}>
                <thead><tr><th>Membre</th><th style={{ textAlign: 'center' }}>Grade</th><th style={{ textAlign: 'right' }}>Points</th><th style={{ textAlign: 'right' }}>Visites</th><th>Récompense</th><th style={{ textAlign: 'center' }}>Progression</th></tr></thead>
                <tbody>
                  {membres.map(m => {
                    const gradeInfo = getGrade(m.points)
                    return (
                      <tr key={m.id}>
                        <td style={{ fontWeight: '600', color: 'var(--text)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, #CC5500, #A34400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700' }}>{m.nom?.charAt(0)}</div>
                            {m.nom}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', backgroundColor: gradeInfo.bg, color: gradeInfo.couleur }}>{gradeInfo.icon} {gradeInfo.nom}</span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: '#CC5500' }}>{m.points?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{m.visites}</td>
                        <td><span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>{m.recompense || 'Aucune'}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ width: '80px', height: '6px', backgroundColor: '#F0F0F0', borderRadius: '3px', margin: '0 auto', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, m.progression || 0)}%`, height: '100%', background: m.progression === 100 ? '#10b981' : '#CC5500', borderRadius: '3px' }}></div>
                          </div>
                          <span style={{ fontSize: '10px', color: '#999' }}>{m.progression || 0}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grades */}
        {activeTab === 'grades' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {grades.map(g => (
              <div key={g.nom} className="erp-card" style={{ textAlign: 'center', padding: '24px', border: `2px solid ${g.couleur}30` }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{g.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: g.couleur, margin: '0 0 6px 0' }}>{g.nom}</h3>
                <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>{g.min.toLocaleString()} - {g.max.toLocaleString()} pts</p>
                <span style={{ padding: '6px 14px', backgroundColor: g.bg, borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: g.couleur }}>
                  {membres.filter(m => getGrade(m.points).nom === g.nom).length} membre(s)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Récompenses */}
        {activeTab === 'recompenses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {recompenses.map(r => (
              <div key={r.id} className="erp-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', margin: '0 0 4px 0' }}>{r.nom}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>⭐ {r.pointsRequis} pts</span> • <span>📦 {r.stock}</span>
                  </div>
                  {r.description && <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0' }}>{r.description}</p>}
                </div>
                <button onClick={() => { setFormType('attribuer'); setShowForm(true); setAttributionForm({...attributionForm, recompenseId: r.id.toString()}) }}
                  style={{ padding: '8px 14px', backgroundColor: couleurPrincipale, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  Attribuer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Historique */}
        {activeTab === 'historique' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead><tr><th>Date</th><th>Membre</th><th>Action</th><th style={{ textAlign: 'right' }}>Points</th><th>Détail</th></tr></thead>
              <tbody>
                {historique.map((h: any) => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td style={{ fontWeight: '600' }}>{h.membre}</td>
                    <td>{h.action}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: h.points > 0 ? '#10b981' : '#ef4444' }}>{h.points > 0 ? '+' : ''}{h.points}</td>
                    <td style={{ color: '#666', fontSize: '12px' }}>{h.detail}</td>
                  </tr>
                ))}
                {historique.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Aucun historique</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
