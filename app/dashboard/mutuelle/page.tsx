'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../services/dataService'
import { useApp } from '../context/AppContext'

export default function MutuellePage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [activeTab, setActiveTab] = useState('cotisations')
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('cotisation') / 'cotisation' ou 'aide'
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [cotisations, setCotisations] = useState<any[]>([])
  const [aides, setAides] = useState<any[]>([])

  const [formData, setFormData] = useState({
    planteurId: '', type: 'Mutuelle', montant: '', frequence: 'Mensuel', notes: ''
  })
  const [aideForm, setAideForm] = useState({
    planteurId: '', typeAide: 'Aide médicale', montant: '', description: '', urgence: 'Normal'
  })

  useEffect(() => {
    chargerDonnees()
    setPlanteurs(dataService.getPlanteurs())
  }, [])

  const chargerDonnees = () => {
    setCotisations(dataService.getCotisations())
    setAides(dataService.getAll('data_aides') || [])
  }

  const handleCotisation = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === formData.planteurId)
    const nouvelle = {
      ...formData,
      planteur: planteur ? `${planteur.prenom} ${planteur.nom}` : '',
      montant: parseFloat(formData.montant),
      date: new Date().toISOString().split('T')[0],
      statut: 'Payé'
    }
    dataService.create('data_cotisations', nouvelle)
    
    / Ajouter en caisse
    dataService.create('data_operations', {
      type: 'ENTREE',
      montant: parseFloat(formData.montant),
      motif: `Cotisation ${formData.type} - ${nouvelle.planteur}`,
      modePaiement: 'ESPECES',
      dateOperation: new Date().toISOString().split('T')[0],
      reference: `COT-${Date.now()}`
    })
    
    addNotification({ type: 'success', message: '✅ Cotisation enregistrée !' })
    setShowForm(false)
    setFormData({ planteurId: '', type: 'Mutuelle', montant: '', frequence: 'Mensuel', notes: '' })
    chargerDonnees()
  }

  const handleAide = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === aideForm.planteurId)
    const nouvelle = {
      ...aideForm,
      beneficiaire: planteur ? `${planteur.prenom} ${planteur.nom}` : '',
      montant: parseFloat(aideForm.montant),
      date: new Date().toISOString().split('T')[0],
      statut: 'Accordée'
    }
    const aidesActuelles = dataService.getAll('data_aides') || []
    aidesActuelles.push(nouvelle)
    localStorage.setItem('data_aides', JSON.stringify(aidesActuelles))
    
    / Sortie de caisse
    dataService.create('data_operations', {
      type: 'SORTIE',
      montant: parseFloat(aideForm.montant),
      motif: `${aideForm.typeAide} - ${nouvelle.beneficiaire}`,
      modePaiement: 'ESPECES',
      dateOperation: new Date().toISOString().split('T')[0],
      reference: `AIDE-${Date.now()}`
    })
    
    addNotification({ type: 'success', message: '✅ Aide accordée !' })
    setShowForm(false)
    setAideForm({ planteurId: '', typeAide: 'Aide médicale', montant: '', description: '', urgence: 'Normal' })
    chargerDonnees()
  }

  const handlePayer = (id: number) => {
    dataService.update('data_cotisations', id, { statut: 'Payé' })
    chargerDonnees()
    addNotification({ type: 'success', message: '✅ Paiement validé !' })
  }

  const totalCotisations = cotisations.filter(c => c.statut === 'Payé').reduce((s, c) => s + (c.montant || 0), 0)
  const totalAides = (aides || []).filter((a: any) => a.statut === 'Accordée').reduce((s: number, a: any) => s + (a.montant || 0), 0)
  const fondsDisponible = totalCotisations - totalAides
  const cotisationsEnAttente = cotisations.filter(c => c.statut !== 'Payé').length

  const typeCotisations = ['Mutuelle', 'Assurance', 'Fonds Solidarité', 'Épargne', 'Autre']
  const typeAides = ['Aide médicale', 'Aide scolaire', 'Aide agricole', 'Aide sociale', 'Aide d\'urgence', 'Autre']
  const frequences = ['Mensuel', 'Trimestriel', 'Semestriel', 'Annuel', 'Unique']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🏥 Mutuelle & Social</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({cotisations.length} cotisations, {aides.length} aides)</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setFormType('cotisation') }}>
            {showForm ? '✕ Annuler' : '+ Nouveau'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'cotisations', label: '💳 Cotisations' },
            { id: 'aides', label: '🤝 Aides Sociales' },
            { id: 'fonds', label: '💰 Fonds' },
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
            { label: 'Fonds Disponible', value: `${fondsDisponible.toLocaleString()} FCFA`, icon: '💰', color: fondsDisponible >= 0 ? '#10b981' : '#ef4444' },
            { label: 'Cotisations (mois)', value: `${totalCotisations.toLocaleString()} FCFA`, icon: '💳', color: '#CC5500' },
            { label: 'Aides Accordées', value: `${totalAides.toLocaleString()} FCFA`, icon: '🤝', color: '#004D4D' },
            { label: 'En attente', value: cotisationsEnAttente, icon: '⏳', color: '#f59e0b' },
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
              <button onClick={() => setFormType('cotisation')} style={{
                padding: '10px 20px', borderRadius: '8px', border: formType === 'cotisation' ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: formType === 'cotisation' ? couleurPrincipale + '10' : 'transparent',
                color: formType === 'cotisation' ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px'
              }}>💳 Nouvelle Cotisation</button>
              <button onClick={() => setFormType('aide')} style={{
                padding: '10px 20px', borderRadius: '8px', border: formType === 'aide' ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: formType === 'aide' ? couleurPrincipale + '10' : 'transparent',
                color: formType === 'aide' ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: '600', fontSize: '13px'
              }}>🤝 Nouvelle Aide</button>
            </div>

            {formType === 'cotisation' ? (
              <form onSubmit={handleCotisation}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Planteur *</label>
                    <select className="erp-select" required value={formData.planteurId} onChange={e => setFormData({...formData, planteurId: e.target.value})}>
                      <option value="">Sélectionner un planteur</option>
                      {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type *</label>
                    <select className="erp-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      {typeCotisations.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Montant (FCFA) *</label>
                    <input className="erp-input" type="number" required value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} placeholder="5000" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Fréquence</label>
                    <select className="erp-select" value={formData.frequence} onChange={e => setFormData({...formData, frequence: e.target.value})}>
                      {frequences.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Notes</label>
                    <input className="erp-input" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Observations" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="erp-btn-primary">💾 Enregistrer</button>
                  <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAide}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Bénéficiaire *</label>
                    <select className="erp-select" required value={aideForm.planteurId} onChange={e => setAideForm({...aideForm, planteurId: e.target.value})}>
                      <option value="">Sélectionner un planteur</option>
                      {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type d'aide *</label>
                    <select className="erp-select" value={aideForm.typeAide} onChange={e => setAideForm({...aideForm, typeAide: e.target.value})}>
                      {typeAides.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Montant (FCFA) *</label>
                    <input className="erp-input" type="number" required value={aideForm.montant} onChange={e => setAideForm({...aideForm, montant: e.target.value})} placeholder="50000" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Urgence</label>
                    <select className="erp-select" value={aideForm.urgence} onChange={e => setAideForm({...aideForm, urgence: e.target.value})}>
                      <option value="Normal">Normal</option><option value="Urgent">Urgent</option><option value="Très urgent">Très urgent</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Description</label>
                    <textarea className="erp-textarea" value={aideForm.description} onChange={e => setAideForm({...aideForm, description: e.target.value})} placeholder="Détails de la demande d'aide..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="erp-btn-primary">✅ Accorder l'aide</button>
                  <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Contenu */}
        {activeTab === 'cotisations' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table" style={{ border: 'none' }}>
                <thead><tr><th>Planteur</th><th>Type</th><th style={{ textAlign: 'right' }}>Montant</th><th>Fréquence</th><th>Date</th><th style={{ textAlign: 'center' }}>Statut</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                <tbody>
                  {cotisations.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '600', color: 'var(--text)' }}>👨‍🌾 {c.planteur}</td>
                      <td><span className="erp-badge erp-badge-info">{c.type}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#CC5500' }}>{c.montant?.toLocaleString()} FCFA</td>
                      <td>{c.frequence}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{c.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`erp-badge ${c.statut === 'Payé' ? 'erp-badge-success' : c.statut === 'En attente' ? 'erp-badge-warning' : 'erp-badge-danger'}`}>{c.statut}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {c.statut !== 'Payé' && (
                          <button onClick={() => handlePayer(c.id)} style={{ padding: '5px 12px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                            💳 Payer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {cotisations.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Aucune cotisation</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'aides' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
            {aides.map((a: any) => (
              <div key={a.id || a.date} className="erp-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>🤝 {a.beneficiaire}</h3>
                  <span className={`erp-badge ${a.statut === 'Accordée' ? 'erp-badge-success' : a.statut === 'En cours' ? 'erp-badge-warning' : 'erp-badge-info'}`}>{a.statut}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.8' }}>
                  <div>📋 Type: {a.typeAide}</div>
                  <div>💰 Montant: <strong style={{ color: '#CC5500' }}>{a.montant?.toLocaleString()} FCFA</strong></div>
                  <div>📅 Date: {a.date}</div>
                  <div>⚠️ Urgence: <span style={{ color: a.urgence === 'Urgent' || a.urgence === 'Très urgent' ? '#ef4444' : '#666', fontWeight: '600' }}>{a.urgence}</span></div>
                </div>
                {a.description && <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>📝 {a.description}</p>}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <button onClick={() => addNotification({ type: 'success', message: '✅ Aide validée !' })} style={{ flex: 1, padding: '8px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✅ Valider</button>
                  <button onClick={() => addNotification({ type: 'info', message: '📋 Détails consultés' })} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>👁️ Détails</button>
                </div>
              </div>
            ))}
            {aides.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤝</div>
                <p>Aucune aide enregistrée</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fonds' && (
          <div className="erp-grid-2">
            <div className="erp-card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' }}>💰 État des Fonds</h3>
              {[
                { label: 'Fonds Mutuelle', montant: cotisations.filter((c: any) => c.type === 'Mutuelle').reduce((s: number, c: any) => s + (c.montant || 0), 0), couleur: '#CC5500' },
                { label: 'Fonds Assurance', montant: cotisations.filter((c: any) => c.type === 'Assurance').reduce((s: number, c: any) => s + (c.montant || 0), 0), couleur: '#004D4D' },
                { label: 'Fonds Solidarité', montant: cotisations.filter((c: any) => c.type === 'Fonds Solidarité').reduce((s: number, c: any) => s + (c.montant || 0), 0), couleur: '#10b981' },
                { label: 'Total Aides', montant: totalAides, couleur: '#ef4444' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                  <span style={{ fontWeight: '700', color: f.couleur }}>{f.montant.toLocaleString()} FCFA</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontWeight: '700', fontSize: '15px', borderTop: '2px solid var(--border)', marginTop: '4px' }}>
                <span>Solde Net</span>
                <span style={{ color: fondsDisponible >= 0 ? '#10b981' : '#ef4444' }}>{fondsDisponible.toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="erp-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' }}>📊 Répartition</h3>
              <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: `conic-gradient(#CC5500 0deg 105deg, #004D4D 105deg 200deg, #10b981 200deg 290deg, #ef4444 290deg 360deg)`, margin: '0 auto 20px' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', fontSize: '11px' }}>
                <span>🟠 Mutuelle</span><span>🟢 Assurance</span><span>🔵 Solidarité</span><span>🔴 Aides</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
