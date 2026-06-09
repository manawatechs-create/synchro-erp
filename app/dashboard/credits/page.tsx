'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function CreditsPage() {
  const router = useRouter()
  const [credits, setCredits] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showRemboursement, setShowRemboursement] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({
    planteurId: '', montant: '', taux: '5', duree: '12', garantie: '', notes: ''
  })
  const [remboursement, setRemboursement] = useState({ montant: '', modePaiement: 'ESPECES', notes: '' })

  useEffect(() => { 
    dataService.init()
    chargerCredits()
    setPlanteurs(dataService.getPlanteurs())
  }, [])
  
  const chargerCredits = () => {
    const cr = dataService.getAll('data_credits')
    if (cr.length === 0) {
      const init = [
        { id: 1, planteur: 'Amadou Diallo', planteurId: 1, montant: 250000, taux: 5, duree: 12, mensualite: 21875, reste: 175000, statut: 'Actif', progression: 30, dateOctroi: '2024-01-15', garantie: 'Titre foncier', notes: '', remboursements: [] },
        { id: 2, planteur: 'Fatou Camara', planteurId: 2, montant: 150000, taux: 5, duree: 6, mensualite: 25625, reste: 51250, statut: 'Actif', progression: 66, dateOctroi: '2024-02-20', garantie: '', notes: '', remboursements: [] },
        { id: 3, planteur: 'Ibrahim Koné', planteurId: 3, montant: 500000, taux: 7, duree: 24, mensualite: 22917, reste: 0, statut: 'Remboursé', progression: 100, dateOctroi: '2023-06-10', garantie: 'Terrain agricole', notes: '', remboursements: [] },
      ]
      localStorage.setItem('data_credits', JSON.stringify(init))
      setCredits(init)
    } else {
      setCredits(cr)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.montant || parseFloat(form.montant) <= 0) { showNotif('⚠️ Montant invalide'); return }
    
    const planteur = planteurs.find(p => p.id.toString() === form.planteurId)
    const montant = parseFloat(form.montant)
    const taux = parseFloat(form.taux)
    const duree = parseInt(form.duree)
    const mensualite = Math.round((montant * (1 + taux / 100)) / duree)
    
    const credit = {
      planteur: planteur ? `${planteur.prenom} ${planteur.nom}` : 'Inconnu',
      planteurId: parseInt(form.planteurId),
      montant, taux, duree, mensualite,
      reste: montant,
      statut: 'Actif',
      progression: 0,
      dateOctroi: new Date().toISOString().split('T')[0],
      garantie: form.garantie,
      notes: form.notes,
      remboursements: []
    }

    if (editingId) {
      dataService.update('data_credits', editingId, credit)
      showNotif('✅ Crédit modifié !')
    } else {
      dataService.create('data_credits', credit)
      showNotif('✅ Crédit accordé avec succès !')
    }
    setShowForm(false)
    setEditingId(null)
    setForm({ planteurId: '', montant: '', taux: '5', duree: '12', garantie: '', notes: '' })
    chargerCredits()
  }

  const handleEdit = (c: any) => {
    setEditingId(c.id)
    setForm({
      planteurId: c.planteurId?.toString() || '',
      montant: c.montant?.toString() || '',
      taux: c.taux?.toString() || '5',
      duree: c.duree?.toString() || '12',
      garantie: c.garantie || '',
      notes: c.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce crédit ?')) {
      dataService.delete('data_credits', id)
      chargerCredits()
      showNotif('🗑️ Crédit supprimé !')
    }
  }

  const handleRemboursement = (creditId: number) => {
    const montantRemb = parseFloat(remboursement.montant)
    if (!montantRemb || montantRemb <= 0) { showNotif('⚠️ Montant invalide'); return }
    
    const credit = credits.find(c => c.id === creditId)
    if (!credit) return
    
    const nouveauReste = Math.max(0, credit.reste - montantRemb)
    const progression = Math.round(((credit.montant - nouveauReste) / credit.montant) * 100)
    const nouveauStatut = nouveauReste === 0 ? 'Remboursé' : 'Actif'
    
    const remb = {
      date: new Date().toISOString().split('T')[0],
      montant: montantRemb,
      modePaiement: remboursement.modePaiement,
      notes: remboursement.notes
    }
    const remboursements = [...(credit.remboursements || []), remb]
    
    dataService.update('data_credits', creditId, {
      reste: nouveauReste, progression, statut: nouveauStatut, remboursements
    })
    
    // Ajouter en caisse
    dataService.create('data_operations', {
      type: 'ENTREE', montant: montantRemb,
      motif: `Remboursement crédit - ${credit.planteur}`,
      modePaiement: remboursement.modePaiement,
      dateOperation: new Date().toISOString().split('T')[0],
      reference: `CRED-${creditId}`
    })
    
    showNotif(`✅ Remboursement de ${montantRemb.toLocaleString()} FCFA enregistré !`)
    setShowRemboursement(null)
    setRemboursement({ montant: '', modePaiement: 'ESPECES', notes: '' })
    chargerCredits()
  }

  const imprimerEcheancier = (credit: any) => {
    let lignes = ''
    for (let i = 1; i <= credit.duree; i++) {
      const date = new Date(credit.dateOctroi)
      date.setMonth(date.getMonth() + i)
      lignes += `<tr><td>${i}</td><td>${date.toLocaleDateString('fr-FR')}</td><td style="text-align:right">${credit.mensualite?.toLocaleString()} FCFA</td></tr>`
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Échéancier - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px}
.info-box{background:#FAFAFA;border:1px solid #e8e8e8;border-radius:8px;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.info-box p{margin:4px 0}
table{width:100%;border-collapse:collapse}th{background:#FFF5F0;padding:10px;text-align:left;font-size:10px;color:#CC5500;border:1px solid #e8e8e8}td{padding:10px;border:1px solid #e8e8e8}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>🏦 Échéancier de Crédit</h2>
<div class="info-box"><div><p><strong>Bénéficiaire:</strong> ${credit.planteur}</p><p><strong>Montant:</strong> ${credit.montant?.toLocaleString()} FCFA</p></div><div><p><strong>Taux:</strong> ${credit.taux}%</p><p><strong>Durée:</strong> ${credit.duree} mois</p></div><div><p><strong>Mensualité:</strong> ${credit.mensualite?.toLocaleString()} FCFA</p><p><strong>Total à rembourser:</strong> ${(credit.mensualite * credit.duree)?.toLocaleString()} FCFA</p></div></div>
<table><thead><tr><th>N°</th><th>Date échéance</th><th style="text-align:right">Montant</th></tr></thead><tbody>${lignes}</tbody></table>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer l'échéancier</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const filtered = credits.filter(c => 
    (c.planteur || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCredits = credits.reduce((s, c) => s + (c.montant || 0), 0)
  const totalReste = credits.filter(c => c.statut === 'Actif').reduce((s, c) => s + (c.reste || 0), 0)
  const actifs = credits.filter(c => c.statut === 'Actif').length
  const rembourses = credits.filter(c => c.statut === 'Remboursé').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🏦 Micro-Crédit</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({credits.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ planteurId: '', montant: '', taux: '5', duree: '12', garantie: '', notes: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouveau Crédit'}
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Crédits', value: `${totalCredits.toLocaleString()} FCFA`, icon: '💰', color: '#CC5500' },
            { label: 'Reste à payer', value: `${totalReste.toLocaleString()} FCFA`, icon: '💳', color: '#f59e0b' },
            { label: 'Crédits Actifs', value: actifs, icon: '📊', color: '#3b82f6' },
            { label: 'Remboursés', value: rembourses, icon: '✅', color: '#10b981' },
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
            <h3 style={{ color: '#CC5500', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier le crédit' : '➕ Nouveau Crédit'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Bénéficiaire *</label>
                  <select required value={form.planteurId} onChange={e => setForm({...form, planteurId: e.target.value})} style={{...is, background: 'white'}}>
                    <option value="">Sélectionner un producteur</option>
                    {planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} - {p.village}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Montant (FCFA) *</label><input type="number" required value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} placeholder="250000" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Taux d'intérêt (%)</label><input type="number" value={form.taux} onChange={e => setForm({...form, taux: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Durée (mois) *</label><select value={form.duree} onChange={e => setForm({...form, duree: e.target.value})} style={{...is, background: 'white'}}><option value="3">3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option><option value="18">18 mois</option><option value="24">24 mois</option></select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Garantie</label><input value={form.garantie} onChange={e => setForm({...form, garantie: e.target.value})} placeholder="Ex: Titre foncier" style={is} /></div>
              </div>
              {form.montant && form.duree && (
                <div style={{ padding: '10px', background: '#FFF5F0', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#CC5500', fontWeight: '600' }}>
                  Mensualité estimée : {Math.round((parseFloat(form.montant) * (1 + parseFloat(form.taux) / 100)) / parseInt(form.duree)).toLocaleString()} FCFA/mois
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {editingId ? '💾 Mettre à jour' : '💾 Accorder le crédit'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Recherche */}
        <input type="text" placeholder="🔍 Rechercher par bénéficiaire..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        {/* Liste */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏦</div>
              <p>Aucun crédit trouvé</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>👨‍🌾 {c.planteur}</h3>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.statut === 'Actif' ? '#FFFBEB' : '#ECFDF5', color: c.statut === 'Actif' ? '#f59e0b' : '#10b981' }}>{c.statut}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#666', marginBottom: '14px' }}>
                  <div>💰 Montant: <strong style={{ color: '#CC5500' }}>{c.montant?.toLocaleString()} FCFA</strong></div>
                  <div>📊 Taux: {c.taux}%</div>
                  <div>📅 Durée: {c.duree} mois</div>
                  <div>💵 Mensualité: {c.mensualite?.toLocaleString()} FCFA</div>
                  <div>💳 Reste: <strong style={{ color: c.reste > 0 ? '#ef4444' : '#10b981' }}>{c.reste?.toLocaleString()} FCFA</strong></div>
                  <div>📅 Octroi: {c.dateOctroi}</div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginBottom: '4px' }}><span>Progression</span><span style={{ fontWeight: '600' }}>{c.progression}%</span></div>
                  <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progression}%`, height: '100%', background: c.progression === 100 ? '#10b981' : '#CC5500', borderRadius: '4px' }}></div>
                  </div>
                </div>

                {/* Formulaire remboursement */}
                {showRemboursement === c.id && (
                  <div style={{ padding: '12px', background: '#FAFAFA', borderRadius: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>💵 Enregistrer un remboursement</p>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input type="number" placeholder="Montant" value={remboursement.montant} onChange={e => setRemboursement({...remboursement, montant: e.target.value})} style={{...is, flex: 1}} />
                      <select value={remboursement.modePaiement} onChange={e => setRemboursement({...remboursement, modePaiement: e.target.value})} style={{...is, width: '130px', background: 'white'}}>
                        <option value="ESPECES">Espèces</option><option value="ORANGE_MONEY">Orange Money</option><option value="MOOV_MONEY">Moov Money</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleRemboursement(c.id)} style={{ flex: 1, padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✅ Valider</button>
                      <button onClick={() => setShowRemboursement(null)} style={{ flex: 1, padding: '8px', background: '#666', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Annuler</button>
                    </div>
                  </div>
                )}

                {/* Historique remboursements */}
                {c.remboursements && c.remboursements.length > 0 && (
                  <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#999', marginBottom: '4px' }}>📋 Derniers remboursements</p>
                    {c.remboursements.slice(-3).reverse().map((r: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', padding: '2px 0' }}>
                        <span>{r.date}</span><span style={{ fontWeight: '600', color: '#10b981' }}>+{r.montant.toLocaleString()} FCFA</span><span>{r.modePaiement}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {c.statut === 'Actif' && (
                    <button onClick={() => setShowRemboursement(c.id)} style={{ flex: 1, padding: '8px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>💵 Remboursement</button>
                  )}
                  <button onClick={() => imprimerEcheancier(c)} style={{ flex: 1, padding: '8px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minWidth: '80px' }}>🖨️ Échéancier</button>
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
