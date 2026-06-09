'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../services/dataService'
import { useApp } from '../context/AppContext'
import { imprimerPV } from '../services/printService'

export default function ReunionsPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [activeTab, setActiveTab] = useState('liste')
  const [showForm, setShowForm] = useState(false)
  const [showPV, setShowPV] = useState<number | null>(null)
  const [reunions, setReunions] = useState<any[]>([])
  const [selectedReunion, setSelectedReunion] = useState<any>(null)

  // Formulaire réunion
  const [formData, setFormData] = useState({
    titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: ''
  })

  // Formulaire PV
  const [pvData, setPvData] = useState({
    reunionId: 0,
    president: '',
    secretaire: '',
    nombreParticipants: '',
    debutSeance: '',
    finSeance: '',
    ordreDuJour: '',
    deliberations: '',
    resolutions: '',
    votes: '',
    prochaineReunion: '',
    signaturePresident: '',
    signatureSecretaire: ''
  })

  useEffect(() => {
    chargerReunions()
  }, [])

  const chargerReunions = () => {
    const data = dataService.getAll('data_reunions')
    if (data.length === 0) {
      const init = [
        { id: 1, titre: 'Assemblée Générale Annuelle', type: 'Assemblée Générale', date: '2024-06-15', heure: '10:00', lieu: 'Siège Coopérative - Koudougou', statut: 'Planifiée', participants: 85, ordreDuJour: '', notes: '', pv: null },
        { id: 2, titre: 'Conseil d\'Administration - Juin', type: 'Conseil d\'Administration', date: '2024-06-20', heure: '14:00', lieu: 'Salle de réunion', statut: 'Planifiée', participants: 12, ordreDuJour: '', notes: '', pv: null },
        { id: 3, titre: 'Formation Techniques Culturales', type: 'Formation', date: '2024-05-10', heure: '09:00', lieu: 'Centre Agricole', statut: 'Terminée', participants: 45, ordreDuJour: '', notes: '', pv: null },
      ]
      localStorage.setItem('data_reunions', JSON.stringify(init))
      setReunions(init)
    } else {
      setReunions(data)
    }
  }

  const handleCreateReunion = (e: React.FormEvent) => {
    e.preventDefault()
    const nouvelle = {
      id: Date.now(),
      ...formData,
      statut: 'Planifiée',
      participants: 0,
      pv: null
    }
    dataService.create('data_reunions', nouvelle)
    addNotification({ type: 'success', message: '✅ Réunion planifiée avec succès !' })
    setShowForm(false)
    setFormData({ titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: '' })
    chargerReunions()
  }

  const handleUpdateStatut = (id: number, statut: string) => {
    dataService.update('data_reunions', id, { statut })
    chargerReunions()
    addNotification({ type: 'success', message: `✅ Réunion marquée comme "${statut}" !` })
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette réunion ?')) {
      dataService.delete('data_reunions', id)
      chargerReunions()
      addNotification({ type: 'success', message: '🗑️ Réunion supprimée !' })
    }
  }

  const openPVEditor = (reunion: any) => {
    setSelectedReunion(reunion)
    setPvData({
      reunionId: reunion.id,
      president: '',
      secretaire: '',
      nombreParticipants: reunion.participants?.toString() || '',
      debutSeance: reunion.heure || '10:00',
      finSeance: '12:00',
      ordreDuJour: reunion.ordreDuJour || reunion.titre,
      deliberations: '',
      resolutions: '',
      votes: '',
      prochaineReunion: '',
      signaturePresident: '',
      signatureSecretaire: ''
    })
    setShowPV(reunion.id)
  }

  const handleSavePV = (e: React.FormEvent) => {
    e.preventDefault()
    const pvComplet = {
      ...pvData,
      dateRedaction: new Date().toISOString().split('T')[0],
      statut: 'Rédigé'
    }
    dataService.update('data_reunions', pvData.reunionId, { pv: pvComplet, statut: 'Terminée' })
    addNotification({ type: 'success', message: '✅ PV sauvegardé avec succès !' })
    setShowPV(null)
    chargerReunions()
  }

  const handlePrintPV = (reunion: any) => {
    if (reunion.pv) {
      const pvInfo = {
        ...reunion,
        type: reunion.type,
        date: reunion.date,
        lieu: reunion.lieu,
        participants: reunion.pv.nombreParticipants || reunion.participants,
        titre: reunion.titre
      }
      imprimerPV(pvInfo)
    } else {
      imprimerPV(reunion)
    }
  }

  const types = ['Assemblée Générale', 'Conseil d\'Administration', 'Formation', 'Commission', 'Réunion d\'équipe', 'Autre']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>📋 Gestion des Réunions</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({reunions.length})</span>
          </div>
          <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setFormData({ titre: '', type: 'Assemblée Générale', date: '', heure: '10:00', lieu: '', ordreDuJour: '', notes: '' }) }}>
            {showForm ? '✕ Annuler' : '+ Planifier une Réunion'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'liste', label: '📋 Liste des réunions' },
            { id: 'calendrier', label: '📅 Calendrier' },
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
        {/* Formulaire nouvelle réunion */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Planifier une Réunion</h3>
            <form onSubmit={handleCreateReunion}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Titre *</label>
                  <input className="erp-input" required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} placeholder="Ex: Assemblée Générale Annuelle" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Type *</label>
                  <select className="erp-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date *</label>
                  <input className="erp-input" type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Heure</label>
                  <input className="erp-input" type="time" value={formData.heure} onChange={e => setFormData({...formData, heure: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Lieu *</label>
                  <input className="erp-input" required value={formData.lieu} onChange={e => setFormData({...formData, lieu: e.target.value})} placeholder="Siège, salle de réunion..." />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Ordre du jour</label>
                  <textarea className="erp-textarea" value={formData.ordreDuJour} onChange={e => setFormData({...formData, ordreDuJour: e.target.value})} placeholder="Points à l'ordre du jour..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">📅 Planifier</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'liste' && (
          <div>
            {/* Éditeur PV */}
            {showPV && selectedReunion && (
              <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease', border: '2px solid #CC5500' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#CC5500', margin: 0 }}>
                    📝 Rédaction du PV - {selectedReunion.titre}
                  </h3>
                  <button onClick={() => setShowPV(null)} style={{ padding: '6px 12px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕ Fermer</button>
                </div>
                <form onSubmit={handleSavePV}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Président de séance *</label>
                      <input className="erp-input" required value={pvData.president} onChange={e => setPvData({...pvData, president: e.target.value})} placeholder="Nom du président" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Secrétaire de séance *</label>
                      <input className="erp-input" required value={pvData.secretaire} onChange={e => setPvData({...pvData, secretaire: e.target.value})} placeholder="Nom du secrétaire" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nombre de participants</label>
                      <input className="erp-input" type="number" value={pvData.nombreParticipants} onChange={e => setPvData({...pvData, nombreParticipants: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Heure début</label>
                      <input className="erp-input" type="time" value={pvData.debutSeance} onChange={e => setPvData({...pvData, debutSeance: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Heure fin</label>
                      <input className="erp-input" type="time" value={pvData.finSeance} onChange={e => setPvData({...pvData, finSeance: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Prochaine réunion</label>
                      <input className="erp-input" type="date" value={pvData.prochaineReunion} onChange={e => setPvData({...pvData, prochaineReunion: e.target.value})} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Ordre du jour</label>
                    <textarea className="erp-textarea" value={pvData.ordreDuJour} onChange={e => setPvData({...pvData, ordreDuJour: e.target.value})} style={{ minHeight: '80px' }} placeholder="1. Ouverture de la séance&#10;2. Lecture du PV précédent&#10;3. Points à l'ordre du jour&#10;4. Divers&#10;5. Clôture" />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Délibérations</label>
                    <textarea className="erp-textarea" value={pvData.deliberations} onChange={e => setPvData({...pvData, deliberations: e.target.value})} style={{ minHeight: '120px' }} placeholder="Compte-rendu des discussions et délibérations..." />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Résolutions adoptées</label>
                    <textarea className="erp-textarea" value={pvData.resolutions} onChange={e => setPvData({...pvData, resolutions: e.target.value})} style={{ minHeight: '120px' }} placeholder="Liste des résolutions adoptées..." />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Résultats des votes</label>
                    <textarea className="erp-textarea" value={pvData.votes} onChange={e => setPvData({...pvData, votes: e.target.value})} style={{ minHeight: '80px' }} placeholder="Résultats des votes (pour, contre, abstentions)..." />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Signature Président</label>
                      <input className="erp-input" value={pvData.signaturePresident} onChange={e => setPvData({...pvData, signaturePresident: e.target.value})} placeholder="Nom pour signature" />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Signature Secrétaire</label>
                      <input className="erp-input" value={pvData.signatureSecretaire} onChange={e => setPvData({...pvData, signatureSecretaire: e.target.value})} placeholder="Nom pour signature" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="erp-btn-primary">💾 Sauvegarder le PV</button>
                    <button type="button" className="erp-btn-secondary" onClick={() => handlePrintPV(selectedReunion)}>🖨️ Imprimer le PV</button>
                    <button type="button" className="erp-btn-ghost" onClick={() => setShowPV(null)}>Annuler</button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des réunions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
              {reunions.map(r => (
                <div key={r.id} className="erp-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className={`erp-badge ${r.statut === 'Planifiée' ? 'erp-badge-warning' : r.statut === 'En cours' ? 'erp-badge-info' : r.pv ? 'erp-badge-success' : 'erp-badge-secondary'}`}>
                      {r.statut}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.type}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: '0 0 12px 0' }}>{r.titre}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '14px' }}>
                    <div>📅 {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {r.heure}</div>
                    <div>📍 {r.lieu}</div>
                    <div>👥 {r.participants || 0} participants</div>
                    {r.pv && <div style={{ color: '#10b981', fontWeight: '600' }}>📝 PV rédigé le {r.pv.dateRedaction}</div>}
                  </div>

                  {r.ordreDuJour && (
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: '6px', marginBottom: '14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <strong>Ordre du jour:</strong> {r.ordreDuJour.substring(0, 100)}{r.ordreDuJour.length > 100 ? '...' : ''}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <button onClick={() => openPVEditor(r)} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>
                      📝 {r.pv ? 'Voir PV' : 'Rédiger PV'}
                    </button>
                    {r.statut === 'Planifiée' && (
                      <button onClick={() => handleUpdateStatut(r.id, 'En cours')} style={{ flex: 1, padding: '8px', backgroundColor: '#EFF6FF', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>
                        ▶️ Démarrer
                      </button>
                    )}
                    {r.statut === 'En cours' && (
                      <button onClick={() => handleUpdateStatut(r.id, 'Terminée')} style={{ flex: 1, padding: '8px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>
                        ✅ Terminer
                      </button>
                    )}
                    <button onClick={() => handlePrintPV(r)} style={{ flex: 1, padding: '8px', backgroundColor: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>
                      🖨️ Imprimer
                    </button>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '8px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {reunions.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                  <p>Aucune réunion planifiée</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendrier' && (
          <div className="erp-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' }}>📅 Calendrier des Réunions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reunions
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: '10px', borderLeft: `4px solid ${r.statut === 'Terminée' ? '#10b981' : r.statut === 'En cours' ? '#3b82f6' : '#f59e0b'}` }}>
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#CC5500' }}>{new Date(r.date).getDate()}</div>
                      <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>{new Date(r.date).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>{r.titre}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{r.heure} • {r.lieu} • {r.type}</p>
                    </div>
                    <span className={`erp-badge ${r.statut === 'Terminée' ? 'erp-badge-success' : r.statut === 'En cours' ? 'erp-badge-info' : 'erp-badge-warning'}`}>{r.statut}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
