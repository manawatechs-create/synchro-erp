'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function MutuellePage() {
  const router = useRouter()
  const [cotisations, setCotisations] = useState<any[]>([])
  const [aides, setAides] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('cotisation')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('cotisations')

  const [form, setForm] = useState({ planteurId: '', type: 'Mutuelle', montant: '', frequence: 'Mensuel', notes: '' })
  const [aideForm, setAideForm] = useState({ planteurId: '', typeAide: 'Aide médicale', montant: '', description: '', urgence: 'Normal' })

  useEffect(() => { 
    dataService.init()
    chargerDonnees()
    setPlanteurs(dataService.getPlanteurs())
  }, [])
  
  const chargerDonnees = () => {
    const cot = dataService.getAll('data_cotisations')
    if (cot.length === 0) {
      const init = [
        { id: 1, planteur: 'Amadou Diallo', planteurId: 1, type: 'Mutuelle', montant: 5000, frequence: 'Mensuel', date: '2024-06-01', statut: 'Payé', notes: '' },
        { id: 2, planteur: 'Fatou Camara', planteurId: 2, type: 'Assurance', montant: 15000, frequence: 'Trimestriel', date: '2024-05-15', statut: 'Payé', notes: '' },
        { id: 3, planteur: 'Ibrahim Koné', planteurId: 3, type: 'Fonds Solidarité', montant: 10000, frequence: 'Mensuel', date: '2024-06-05', statut: 'En attente', notes: '' },
        { id: 4, planteur: 'Aïcha Ouédraogo', planteurId: 4, type: 'Mutuelle', montant: 5000, frequence: 'Mensuel', date: '2024-06-01', statut: 'Payé', notes: '' },
      ]
      localStorage.setItem('data_cotisations', JSON.stringify(init))
      setCotisations(init)
    } else { setCotisations(cot) }
    
    const aid = dataService.getAll('data_aides')
    if (aid.length === 0) {
      const init = [
        { id: 1, beneficiaire: 'Amadou Diallo', planteurId: 1, typeAide: 'Aide médicale', montant: 50000, date: '2024-05-10', statut: 'Accordée', urgence: 'Normal', description: 'Frais d\'hospitalisation' },
        { id: 2, beneficiaire: 'Fatou Camara', planteurId: 2, typeAide: 'Aide scolaire', montant: 25000, date: '2024-04-20', statut: 'Accordée', urgence: 'Normal', description: 'Frais de scolarité' },
      ]
      localStorage.setItem('data_aides', JSON.stringify(init))
      setAides(init)
    } else { setAides(aid) }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleCotisation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.montant || parseFloat(form.montant) <= 0) { showNotif('⚠️ Montant invalide'); return }
    const planteur = planteurs.find(p => p.id.toString() === form.planteurId)
    const cotisation = { ...form, planteur: planteur ? `${planteur.prenom} ${planteur.nom}` : '', planteurId: parseInt(form.planteurId), montant: parseFloat(form.montant), date: new Date().toISOString().split('T')[0], statut: 'Payé' }
    
    if (editingId) { dataService.update('data_cotisations', editingId, cotisation); showNotif('✅ Cotisation modifiée !') }
    else { 
      dataService.create('data_cotisations', cotisation)
      dataService.create('data_operations', { type: 'ENTREE', montant: parseFloat(form.montant), motif: `Cotisation ${form.type} - ${cotisation.planteur}`, modePaiement: 'ESPECES', dateOperation: new Date().toISOString().split('T')[0] })
      showNotif('✅ Cotisation enregistrée !') 
    }
    setShowForm(false); setEditingId(null); setForm({ planteurId: '', type: 'Mutuelle', montant: '', frequence: 'Mensuel', notes: '' }); chargerDonnees()
  }

  const handleAide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aideForm.montant || parseFloat(aideForm.montant) <= 0) { showNotif('⚠️ Montant invalide'); return }
    const planteur = planteurs.find(p => p.id.toString() === aideForm.planteurId)
    const aide = { ...aideForm, beneficiaire: planteur ? `${planteur.prenom} ${planteur.nom}` : '', planteurId: parseInt(aideForm.planteurId), montant: parseFloat(aideForm.montant), date: new Date().toISOString().split('T')[0], statut: 'Accordée' }
    
    const aidesActuelles = dataService.getAll('data_aides')
    aidesActuelles.unshift({ ...aide, id: Date.now() })
    localStorage.setItem('data_aides', JSON.stringify(aidesActuelles))
    dataService.create('data_operations', { type: 'SORTIE', montant: parseFloat(aideForm.montant), motif: `${aideForm.typeAide} - ${aide.beneficiaire}`, modePaiement: 'ESPECES', dateOperation: new Date().toISOString().split('T')[0] })
    showNotif('✅ Aide accordée !')
    setShowForm(false); setAideForm({ planteurId: '', typeAide: 'Aide médicale', montant: '', description: '', urgence: 'Normal' }); chargerDonnees()
  }

  const handleEdit = (item: any, type: string) => {
    setEditingId(item.id)
    if (type === 'cotisation') {
      setForm({ planteurId: item.planteurId?.toString() || '', type: item.type || 'Mutuelle', montant: item.montant?.toString() || '', frequence: item.frequence || 'Mensuel', notes: item.notes || '' })
      setFormType('cotisation')
    }
    setShowForm(true)
  }

  const handleDelete = (id: number, type: string) => {
    if (confirm('Supprimer ?')) {
      if (type === 'cotisation') dataService.delete('data_cotisations', id)
      else { const a = dataService.getAll('data_aides').filter((x: any) => x.id !== id); localStorage.setItem('data_aides', JSON.stringify(a)) }
      chargerDonnees(); showNotif('🗑️ Supprimé !')
    }
  }

  const handlePayer = (id: number) => { dataService.update('data_cotisations', id, { statut: 'Payé' }); chargerDonnees(); showNotif('✅ Paiement validé !') }

  const totalCotisations = cotisations.filter(c => c.statut === 'Payé').reduce((s, c) => s + (c.montant || 0), 0)
  const totalAides = aides.filter((a: any) => a.statut === 'Accordée').reduce((s: number, a: any) => s + (a.montant || 0), 0)
  const fondsDisponible = totalCotisations - totalAides

  const typeCotisations = ['Mutuelle', 'Assurance', 'Fonds Solidarité', 'Épargne', 'Autre']
  const typeAides = ['Aide médicale', 'Aide scolaire', 'Aide agricole', 'Aide sociale', 'Aide d\'urgence', 'Autre']
  const frequences = ['Mensuel', 'Trimestriel', 'Semestriel', 'Annuel', 'Unique']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🏥 Mutuelle & Social</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({cotisations.length} cot., {aides.length} aides)</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ planteurId: '', type: 'Mutuelle', montant: '', frequence: 'Mensuel', notes: '' }); setFormType('cotisation') }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouveau'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: '4px' }}>
        {[{ id: 'cotisations', label: '💳 Cotisations' }, { id: 'aides', label: '🤝 Aides' }, { id: 'fonds', label: '💰 Fonds' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400', color: activeTab === tab.id ? '#ec4899' : '#666', borderBottom: activeTab === tab.id ? '3px solid #ec4899' : '3px solid transparent' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Fonds Disponible', value: `${fondsDisponible.toLocaleString()} FCFA`, icon: '💰', color: fondsDisponible >= 0 ? '#10b981' : '#ef4444' },
            { label: 'Cotisations', value: `${totalCotisations.toLocaleString()} FCFA`, icon: '💳', color: '#ec4899' },
            { label: 'Aides Accordées', value: `${totalAides.toLocaleString()} FCFA`, icon: '🤝', color: '#004D4D' },
            { label: 'En attente', value: cotisations.filter(c => c.statut !== 'Payé').length, icon: '⏳', color: '#f59e0b' },
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => setFormType('cotisation')} style={{ padding: '8px 16px', borderRadius: '8px', border: formType === 'cotisation' ? '2px solid #ec4899' : '1px solid #E8E8E8', background: formType === 'cotisation' ? '#FDF2F8' : 'white', color: formType === 'cotisation' ? '#ec4899' : '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💳 Cotisation</button>
              <button onClick={() => setFormType('aide')} style={{ padding: '8px 16px', borderRadius: '8px', border: formType === 'aide' ? '2px solid #ec4899' : '1px solid #E8E8E8', background: formType === 'aide' ? '#FDF2F8' : 'white', color: formType === 'aide' ? '#ec4899' : '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🤝 Aide</button>
            </div>
            {formType === 'cotisation' ? (
              <form onSubmit={handleCotisation}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Producteur *</label><select required value={form.planteurId} onChange={e => setForm({...form, planteurId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{...is, background: 'white'}}>{typeCotisations.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Montant (FCFA) *</label><input type="number" required value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Fréquence</label><select value={form.frequence} onChange={e => setForm({...form, frequence: e.target.value})} style={{...is, background: 'white'}}>{frequences.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Enregistrer</button><button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
              </form>
            ) : (
              <form onSubmit={handleAide}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Bénéficiaire *</label><select required value={aideForm.planteurId} onChange={e => setAideForm({...aideForm, planteurId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type d'aide</label><select value={aideForm.typeAide} onChange={e => setAideForm({...aideForm, typeAide: e.target.value})} style={{...is, background: 'white'}}>{typeAides.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Montant (FCFA) *</label><input type="number" required value={aideForm.montant} onChange={e => setAideForm({...aideForm, montant: e.target.value})} style={is} /></div>
                  <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Urgence</label><select value={aideForm.urgence} onChange={e => setAideForm({...aideForm, urgence: e.target.value})} style={{...is, background: 'white'}}><option value="Normal">Normal</option><option value="Urgent">Urgent</option><option value="Très urgent">Très urgent</option></select></div>
                </div>
                <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Description</label><textarea value={aideForm.description} onChange={e => setAideForm({...aideForm, description: e.target.value})} style={{...is, resize: 'vertical', minHeight: '60px'}} /></div>
                <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>✅ Accorder l'aide</button><button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
              </form>
            )}
          </div>
        )}

        {/* Recherche */}
        <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        {/* Cotisations */}
        {activeTab === 'cotisations' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Producteur</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Type</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Montant</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Fréquence</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Date</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Statut</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Actions</th></tr></thead>
              <tbody>
                {cotisations.filter(c => (c.planteur||'').toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{c.planteur}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', background: '#FDF2F8', borderRadius: '4px', fontSize: '11px', color: '#ec4899' }}>{c.type}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#ec4899' }}>{c.montant?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>{c.frequence}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{c.date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.statut === 'Payé' ? '#ECFDF5' : '#FFFBEB', color: c.statut === 'Payé' ? '#10b981' : '#f59e0b' }}>{c.statut}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {c.statut !== 'Payé' && <button onClick={() => handlePayer(c.id)} style={{ padding: '6px 10px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>💳</button>}
                        <button onClick={() => handleEdit(c, 'cotisation')} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                        <button onClick={() => handleDelete(c.id, 'cotisation')} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Aides */}
        {activeTab === 'aides' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
            {aides.filter((a: any) => (a.beneficiaire||'').toLowerCase().includes(searchTerm.toLowerCase())).map((a: any) => (
              <div key={a.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>🤝 {a.beneficiaire}</h3>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: a.statut === 'Accordée' ? '#ECFDF5' : '#FFFBEB', color: a.statut === 'Accordée' ? '#10b981' : '#f59e0b' }}>{a.statut}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8', marginBottom: '12px' }}>
                  <div>📋 {a.typeAide}</div>
                  <div>💰 <strong style={{ color: '#ec4899' }}>{a.montant?.toLocaleString()} FCFA</strong></div>
                  <div>📅 {a.date}</div>
                  <div>⚠️ Urgence: <span style={{ color: a.urgence === 'Urgent' || a.urgence === 'Très urgent' ? '#ef4444' : '#666', fontWeight: '600' }}>{a.urgence}</span></div>
                  {a.description && <div>📝 {a.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleDelete(a.id, 'aide')} style={{ padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🗑️ Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fonds */}
        {activeTab === 'fonds' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>💰 État des Fonds</h3>
              {[
                { label: 'Fonds Mutuelle', montant: cotisations.filter((c: any) => c.type === 'Mutuelle').reduce((s: number, c: any) => s + (c.montant || 0), 0), color: '#ec4899' },
                { label: 'Fonds Assurance', montant: cotisations.filter((c: any) => c.type === 'Assurance').reduce((s: number, c: any) => s + (c.montant || 0), 0), color: '#004D4D' },
                { label: 'Fonds Solidarité', montant: cotisations.filter((c: any) => c.type === 'Fonds Solidarité').reduce((s: number, c: any) => s + (c.montant || 0), 0), color: '#10b981' },
                { label: 'Total Aides', montant: totalAides, color: '#ef4444' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#666' }}>{f.label}</span><span style={{ fontWeight: '700', color: f.color }}>{f.montant.toLocaleString()} FCFA</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', borderTop: '2px solid #E8E8E8', marginTop: '4px' }}><span>Solde Net</span><span style={{ color: fondsDisponible >= 0 ? '#10b981' : '#ef4444' }}>{fondsDisponible.toLocaleString()} FCFA</span></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8', textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>📊 Répartition</h3>
              <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(#ec4899 0deg 105deg, #004D4D 105deg 200deg, #10b981 200deg 290deg, #ef4444 290deg 360deg)', margin: '0 auto 16px' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', fontSize: '11px' }}><span>🟣 Mutuelle</span><span>🟢 Assurance</span><span>🔵 Solidarité</span><span>🔴 Aides</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
