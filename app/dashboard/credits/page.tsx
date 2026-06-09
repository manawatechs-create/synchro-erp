'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { useApp } from '@/context/AppContext'
import { imprimerDocument } from '@/services/printService'

export default function CreditsPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [credits, setCredits] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showRemboursement, setShowRemboursement] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    planteurId: '', planteurNom: '', montant: '', taux: '5', duree: '12', garantie: '', notes: ''
  })
  const [remboursement, setRemboursement] = useState({ montant: '', modePaiement: 'ESPECES', notes: '' })

  useEffect(() => {
    chargerCredits()
    setPlanteurs(dataService.getPlanteurs())
  }, [])

  const chargerCredits = () => setCredits(dataService.getCredits())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === formData.planteurId)
    const montant = parseFloat(formData.montant)
    const taux = parseFloat(formData.taux)
    const duree = parseInt(formData.duree)
    const mensualite = Math.round((montant * (1 + taux / 100)) / duree)
    
    const nouveauCredit = {
      planteur: planteur ? `${planteur.prenom} ${planteur.nom}` : formData.planteurNom,
      planteurId: parseInt(formData.planteurId),
      montant,
      taux,
      duree,
      mensualite,
      reste: montant,
      statut: 'Actif',
      progression: 0,
      garantie: formData.garantie,
      notes: formData.notes,
      dateOctroi: new Date().toISOString().split('T')[0],
      remboursements: []
    }
    
    dataService.create('data_credits', nouveauCredit)
    addNotification({ type: 'success', message: '✅ Crédit accordé avec succès !' })
    setShowForm(false)
    setFormData({ planteurId: '', planteurNom: '', montant: '', taux: '5', duree: '12', garantie: '', notes: '' })
    chargerCredits()
  }

  const handleRemboursement = (creditId: number) => {
    const montantRemb = parseFloat(remboursement.montant)
    if (!montantRemb || montantRemb <= 0) {
      addNotification({ type: 'alerte', message: '⚠️ Veuillez entrer un montant valide' })
      return
    }
    
    const creditsActuels = dataService.getCredits()
    const credit = creditsActuels.find((c: any) => c.id === creditId)
    if (!credit) return
    
    const nouveauReste = Math.max(0, credit.reste - montantRemb)
    const progression = Math.round(((credit.montant - nouveauReste) / credit.montant) * 100)
    const nouveauStatut = nouveauReste === 0 ? 'Remboursé' : 'Actif'
    
    // Ajouter le remboursement à l'historique
    const remb = {
      date: new Date().toISOString().split('T')[0],
      montant: montantRemb,
      modePaiement: remboursement.modePaiement,
      notes: remboursement.notes
    }
    
    const remboursements = credit.remboursements || []
    remboursements.push(remb)
    
    dataService.update('data_credits', creditId, {
      reste: nouveauReste,
      progression,
      statut: nouveauStatut,
      remboursements
    })
    
    // Ajouter une opération de caisse
    dataService.create('data_operations', {
      type: 'ENTREE',
      montant: montantRemb,
      motif: `Remboursement crédit - ${credit.planteur}`,
      modePaiement: remboursement.modePaiement,
      dateOperation: new Date().toISOString().split('T')[0],
      reference: `CRED-${creditId}`
    })
    
    addNotification({ type: 'success', message: `✅ Remboursement de ${montantRemb.toLocaleString()} FCFA enregistré !` })
    setShowRemboursement(null)
    setRemboursement({ montant: '', modePaiement: 'ESPECES', notes: '' })
    chargerCredits()
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce crédit ?')) {
      dataService.delete('data_credits', id)
      chargerCredits()
      addNotification({ type: 'success', message: '🗑️ Crédit supprimé !' })
    }
  }

  const imprimerEcheancier = (credit: any) => {
    const mensualite = credit.mensualite
    let lignes = ''
    for (let i = 1; i <= credit.duree; i++) {
      const date = new Date(credit.dateOctroi)
      date.setMonth(date.getMonth() + i)
      lignes += `<tr><td>${i}</td><td>${date.toLocaleDateString('fr-FR')}</td><td style="text-align: right;">${mensualite.toLocaleString()} FCFA</td><td style="text-align: center;"><span class="badge badge-warning">En attente</span></td></tr>`
    }
    
    const contenu = `
      <div class="info-box">
        <h3>🏦 Échéancier de Crédit</h3>
        <p><strong>Bénéficiaire:</strong> ${credit.planteur}</p>
        <p><strong>Montant:</strong> ${credit.montant.toLocaleString()} FCFA</p>
        <p><strong>Taux:</strong> ${credit.taux}% | <strong>Durée:</strong> ${credit.duree} mois</p>
        <p><strong>Mensualité:</strong> ${mensualite.toLocaleString()} FCFA</p>
      </div>
      <table>
        <thead><tr><th>N°</th><th>Date échéance</th><th style="text-align: right;">Montant</th><th style="text-align: center;">Statut</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>
      <p style="font-size: 11px; color: #999; margin-top: 16px;">Total à rembourser: <strong style="color: #CC5500;">${(mensualite * credit.duree).toLocaleString()} FCFA</strong></p>
    `
    imprimerDocument(`Échéancier - ${credit.planteur}`, contenu, `Crédit N° ${credit.id}`)
  }

  const totalCredits = credits.reduce((s, c) => s + c.montant, 0)
  const totalReste = credits.filter(c => c.statut === 'Actif').reduce((s, c) => s + c.reste, 0)
  const actifs = credits.filter(c => c.statut === 'Actif').length
  const rembourses = credits.filter(c => c.statut === 'Remboursé').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🏦 Micro-Crédit & Financement</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({credits.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setFormData({ planteurId: '', planteurNom: '', montant: '', taux: '5', duree: '12', garantie: '', notes: '' }) }}>
            {showForm ? '✕ Annuler' : '+ Nouveau Crédit'}
          </button>
        </div>
      </div>

      <div className="erp-page-content">
        {/* Stats */}
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Total Crédits', value: `${totalCredits.toLocaleString()} FCFA`, icon: '💰', color: '#CC5500' },
            { label: 'Reste à payer', value: `${totalReste.toLocaleString()} FCFA`, icon: '💳', color: '#f59e0b' },
            { label: 'Crédits Actifs', value: actifs, icon: '📊', color: '#3b82f6' },
            { label: 'Remboursés', value: rembourses, icon: '✅', color: '#10b981' },
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

        {/* Formulaire nouveau crédit */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Nouveau Crédit</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Bénéficiaire *</label>
                  <select className="erp-select" required value={formData.planteurId} onChange={e => setFormData({...formData, planteurId: e.target.value})}>
                    <option value="">Sélectionner un planteur</option>
                    {planteurs.map(p => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Montant (FCFA) *</label>
                  <input className="erp-input" type="number" required value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} placeholder="Ex: 250000" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Taux d'intérêt (%)</label>
                  <input className="erp-input" type="number" value={formData.taux} onChange={e => setFormData({...formData, taux: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Durée (mois) *</label>
                  <select className="erp-select" value={formData.duree} onChange={e => setFormData({...formData, duree: e.target.value})}>
                    <option value="3">3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option><option value="18">18 mois</option><option value="24">24 mois</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Garantie</label>
                  <input className="erp-input" value={formData.garantie} onChange={e => setFormData({...formData, garantie: e.target.value})} placeholder="Ex: Titre foncier" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Notes</label>
                  <textarea className="erp-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Observations..." />
                </div>
              </div>
              {formData.montant && formData.duree && (
                <div style={{ padding: '12px', backgroundColor: '#FFF5F0', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#CC5500', fontWeight: '600', margin: 0 }}>
                    Mensualité estimée : {Math.round((parseFloat(formData.montant) * (1 + parseFloat(formData.taux) / 100)) / parseInt(formData.duree)).toLocaleString()} FCFA/mois
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Accorder le crédit</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des crédits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
          {credits.map(c => (
            <div key={c.id} className="erp-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>👨‍🌾 {c.planteur}</h3>
                <span className={`erp-badge ${c.statut === 'Actif' ? 'erp-badge-warning' : c.statut === 'Remboursé' ? 'erp-badge-success' : 'erp-badge-danger'}`}>{c.statut}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div>💰 Montant: <strong style={{ color: '#CC5500' }}>{c.montant?.toLocaleString()} FCFA</strong></div>
                <div>📊 Taux: {c.taux}%</div>
                <div>📅 Durée: {c.duree} mois</div>
                <div>💵 Mensualité: {c.mensualite?.toLocaleString()} FCFA</div>
                <div>💳 Reste: <strong style={{ color: c.reste > 0 ? '#ef4444' : '#10b981' }}>{c.reste?.toLocaleString()} FCFA</strong></div>
                <div>📅 Octroi: {c.dateOctroi || 'N/A'}</div>
              </div>

              {/* Progression */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px', color: 'var(--text-muted)' }}>
                  <span>Progression</span><span style={{ fontWeight: '600' }}>{c.progression}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.progression}%`, height: '100%', background: c.progression === 100 ? '#10b981' : `linear-gradient(90deg, ${couleurPrincipale}, #E8661A)`, borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

              {/* Formulaire remboursement */}
              {showRemboursement === c.id && (
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '10px' }}>💵 Enregistrer un remboursement</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input className="erp-input" type="number" placeholder="Montant" value={remboursement.montant} onChange={e => setRemboursement({...remboursement, montant: e.target.value})} style={{ flex: 1 }} />
                    <select className="erp-select" value={remboursement.modePaiement} onChange={e => setRemboursement({...remboursement, modePaiement: e.target.value})} style={{ width: '140px' }}>
                      <option value="ESPECES">Espèces</option><option value="ORANGE_MONEY">Orange Money</option><option value="MOOV_MONEY">Moov Money</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleRemboursement(c.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✅ Valider</button>
                    <button onClick={() => setShowRemboursement(null)} style={{ flex: 1, padding: '8px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Annuler</button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                {c.statut === 'Actif' && (
                  <button onClick={() => setShowRemboursement(c.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    💵 Remboursement
                  </button>
                )}
                <button onClick={() => imprimerEcheancier(c)} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                  🖨️ Échéancier
                </button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
              </div>

              {/* Historique des remboursements */}
              {c.remboursements && c.remboursements.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>📋 Derniers remboursements</p>
                  {c.remboursements.slice(-3).reverse().map((r: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', padding: '3px 0' }}>
                      <span>{r.date}</span>
                      <span style={{ fontWeight: '600', color: '#10b981' }}>+{r.montant.toLocaleString()} FCFA</span>
                      <span>{r.modePaiement}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {credits.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏦</div>
              <p>Aucun crédit enregistré</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
