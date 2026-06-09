'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function AccountingPage() {
  const router = useRouter()
  const [ventes, setVentes] = useState<any[]>([])
  const [achats, setAchats] = useState<any[]>([])
  const [operations, setOperations] = useState<any[]>([])
  const [ecritures, setEcritures] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('bilan')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [form, setForm] = useState({ 
    date: new Date().toISOString().split('T')[0], compte: '70', libelle: '', 
    debit: '', credit: '', piece: '' 
  })

  useEffect(() => { 
    dataService.init()
    setVentes(dataService.getVentes())
    setAchats(dataService.getAchats())
    setOperations(dataService.getOperations())
    chargerEcritures()
  }, [])
  
  const chargerEcritures = () => {
    const ecr = dataService.getAll('data_ecritures')
    if (ecr.length === 0) {
      const init = [
        { id: 1, date: '2024-06-08', compte: '70', libelle: 'Vente de tomates', debit: 0, credit: 150000, piece: 'FAC-001' },
        { id: 2, date: '2024-06-07', compte: '60', libelle: 'Achat engrais', debit: 85000, credit: 0, piece: 'ACH-001' },
        { id: 3, date: '2024-06-06', compte: '70', libelle: 'Vente de mil', debit: 0, credit: 230000, piece: 'FAC-002' },
        { id: 4, date: '2024-06-05', compte: '50', libelle: 'Dépôt bancaire', debit: 300000, credit: 0, piece: 'BQ-001' },
        { id: 5, date: '2024-06-04', compte: '80', libelle: 'Frais transport', debit: 25000, credit: 0, piece: 'CH-001' },
      ]
      localStorage.setItem('data_ecritures', JSON.stringify(init))
      setEcritures(init)
    } else {
      setEcritures(ecr)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.libelle) { showNotif('⚠️ Le libellé est obligatoire'); return }
    if (!form.debit && !form.credit) { showNotif('⚠️ Veuillez remplir le débit ou le crédit'); return }
    
    const ecriture = {
      ...form, 
      debit: parseFloat(form.debit) || 0, 
      credit: parseFloat(form.credit) || 0
    }
    
    if (editingId) {
      dataService.update('data_ecritures', editingId, ecriture)
      showNotif('✅ Écriture modifiée !')
    } else {
      dataService.create('data_ecritures', ecriture)
      showNotif('✅ Écriture enregistrée !')
    }
    setShowForm(false)
    setEditingId(null)
    setForm({ date: new Date().toISOString().split('T')[0], compte: '70', libelle: '', debit: '', credit: '', piece: '' })
    chargerEcritures()
  }

  const handleEdit = (ecr: any) => {
    setEditingId(ecr.id)
    setForm({
      date: ecr.date || '', compte: ecr.compte || '70', libelle: ecr.libelle || '',
      debit: ecr.debit?.toString() || '', credit: ecr.credit?.toString() || '', piece: ecr.piece || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette écriture ?')) {
      dataService.delete('data_ecritures', id)
      chargerEcritures()
      showNotif('🗑️ Écriture supprimée !')
    }
  }

  const imprimerBilan = () => {
    const totalVentes = ventes.filter(v => v.statut === 'VALIDEE').reduce((s, v) => s + (v.montantTotal || 0), 0)
    const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)
    const solde = operations.reduce((s: number, o: any) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0)
    const benefice = totalVentes - totalAchats

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bilan - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px;font-weight:800}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{text-align:center;font-size:18px;color:#CC5500;margin-bottom:16px}
.grid{display:flex;gap:40px}.col{flex:1}.col h3{font-size:14px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid}
.col.actif h3{color:#CC5500;border-color:#FFF5F0}.col.passif h3{color:#004D4D;border-color:#F0F7F7}
.item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
.total{display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid #e8e8e8}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p><strong>Coopérative Agricole</strong></p><p>Koudougou, Burkina Faso</p><p>RCCM: BF-2024-001</p></div></div>
<h2>📊 BILAN COMPTABLE</h2>
<div class="grid">
<div class="col actif"><h3>ACTIF</h3>
<div class="item"><span>Banque</span><span style="font-weight:600;color:#CC5500">${(solde*0.7).toLocaleString()} FCFA</span></div>
<div class="item"><span>Caisse</span><span style="font-weight:600;color:#CC5500">${(solde*0.3).toLocaleString()} FCFA</span></div>
<div class="item"><span>Stocks</span><span style="font-weight:600;color:#CC5500">${(totalAchats*0.4).toLocaleString()} FCFA</span></div>
<div class="item"><span>Créances</span><span style="font-weight:600;color:#CC5500">${(totalVentes*0.15).toLocaleString()} FCFA</span></div>
<div class="total"><span>TOTAL ACTIF</span><span style="color:#CC5500">${(solde+totalAchats*0.4+totalVentes*0.15).toLocaleString()} FCFA</span></div></div>
<div class="col passif"><h3>PASSIF</h3>
<div class="item"><span>Capital</span><span style="font-weight:600;color:#004D4D">3 000 000 FCFA</span></div>
<div class="item"><span>Réserves</span><span style="font-weight:600;color:#004D4D">500 000 FCFA</span></div>
<div class="item"><span>Résultat</span><span style="font-weight:600;color:#004D4D">${benefice.toLocaleString()} FCFA</span></div>
<div class="item"><span>Dettes</span><span style="font-weight:600;color:#004D4D">${(totalAchats*0.2).toLocaleString()} FCFA</span></div>
<div class="total"><span>TOTAL PASSIF</span><span style="color:#004D4D">${(3500000+benefice+totalAchats*0.2).toLocaleString()} FCFA</span></div></div></div>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer le bilan</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const totalVentes = ventes.filter(v => v.statut === 'VALIDEE').reduce((s, v) => s + (v.montantTotal || 0), 0)
  const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)
  const solde = operations.reduce((s: number, o: any) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0)
  const benefice = totalVentes - totalAchats
  const totalDebit = ecritures.reduce((s, e) => s + (e.debit || 0), 0)
  const totalCredit = ecritures.reduce((s, e) => s + (e.credit || 0), 0)

  const planComptable = [
    { code: '10', nom: 'Capital' }, { code: '20', nom: 'Immobilisations' }, { code: '30', nom: 'Stocks' },
    { code: '40', nom: 'Fournisseurs' }, { code: '41', nom: 'Clients' }, { code: '50', nom: 'Banque' },
    { code: '51', nom: 'Caisse' }, { code: '60', nom: 'Achats' }, { code: '70', nom: 'Ventes' }, { code: '80', nom: 'Charges' }
  ]
  const getCompteNom = (code: string) => planComptable.find(c => c.code === code)?.nom || code

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>💳 Comptabilité</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({ecritures.length} écritures)</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ date: new Date().toISOString().split('T')[0], compte: '70', libelle: '', debit: '', credit: '', piece: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvelle Écriture'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {[{ id: 'bilan', label: '📊 Bilan' }, { id: 'resultat', label: '💰 Résultat' }, { id: 'grand-livre', label: '📚 Grand Livre' }, { id: 'ecritures', label: '📝 Écritures' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400', color: activeTab === tab.id ? '#CC5500' : '#666', borderBottom: activeTab === tab.id ? '3px solid #CC5500' : '3px solid transparent', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Formulaire CRUD */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#CC5500', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier l\'écriture' : '➕ Nouvelle Écriture Comptable'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date *</label><input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Compte *</label><select value={form.compte} onChange={e => setForm({...form, compte: e.target.value})} style={{...is, background: 'white'}}>{planComptable.map(c => <option key={c.code} value={c.code}>{c.code} - {c.nom}</option>)}</select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Libellé *</label><input required value={form.libelle} onChange={e => setForm({...form, libelle: e.target.value})} placeholder="Description" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Débit (FCFA)</label><input type="number" value={form.debit} onChange={e => setForm({...form, debit: e.target.value})} placeholder="0" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Crédit (FCFA)</label><input type="number" value={form.credit} onChange={e => setForm({...form, credit: e.target.value})} placeholder="0" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Pièce justificative</label><input value={form.piece} onChange={e => setForm({...form, piece: e.target.value})} placeholder="N° pièce" style={is} /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* BILAN */}
        {activeTab === 'bilan' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={imprimerBilan} style={{ padding: '8px 16px', background: '#FFF5F0', color: '#CC5500', border: '1px solid #CC550030', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🖨️ Imprimer le bilan</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
                <h3 style={{ color: '#CC5500', fontWeight: '700', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #FFF5F0' }}>📈 ACTIF</h3>
                {[{ poste: 'Banque', montant: solde * 0.7 }, { poste: 'Caisse', montant: solde * 0.3 }, { poste: 'Stocks', montant: totalAchats * 0.4 }, { poste: 'Créances', montant: totalVentes * 0.15 }].map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#666' }}>{a.poste}</span><span style={{ fontWeight: '700', color: '#CC5500' }}>{a.montant.toLocaleString()} FCFA</span></div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', borderTop: '2px solid #E8E8E8', marginTop: '4px' }}><span>TOTAL ACTIF</span><span style={{ color: '#CC5500' }}>{(solde + totalAchats * 0.4 + totalVentes * 0.15).toLocaleString()} FCFA</span></div>
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
                <h3 style={{ color: '#004D4D', fontWeight: '700', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #F0F7F7' }}>📉 PASSIF</h3>
                {[{ poste: 'Capital', montant: 3000000 }, { poste: 'Réserves', montant: 500000 }, { poste: 'Résultat', montant: benefice }, { poste: 'Dettes', montant: totalAchats * 0.2 }].map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><span style={{ color: '#666' }}>{p.poste}</span><span style={{ fontWeight: '700', color: '#004D4D' }}>{p.montant.toLocaleString()} FCFA</span></div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', borderTop: '2px solid #E8E8E8', marginTop: '4px' }}><span>TOTAL PASSIF</span><span style={{ color: '#004D4D' }}>{(3500000 + benefice + totalAchats * 0.2).toLocaleString()} FCFA</span></div>
              </div>
            </div>
          </div>
        )}

        {/* RÉSULTAT */}
        {activeTab === 'resultat' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}><p style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>📈 PRODUITS</p><p style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{totalVentes.toLocaleString()} FCFA</p></div>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}><p style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>📉 CHARGES</p><p style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>{totalAchats.toLocaleString()} FCFA</p></div>
            </div>
            <div style={{ backgroundColor: benefice >= 0 ? '#ECFDF5' : '#FEF2F2', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: benefice >= 0 ? '#10b981' : '#ef4444' }}>Résultat Net : {benefice.toLocaleString()} FCFA {benefice >= 0 ? '✅ Bénéfice' : '❌ Perte'}</p>
            </div>
          </div>
        )}

        {/* GRAND LIVRE */}
        {activeTab === 'grand-livre' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Date</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Compte</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Libellé</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Débit</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Crédit</th></tr></thead>
              <tbody>{ecritures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #F0F0F0' }}><td style={{ padding: '12px 16px', fontSize: '12px' }}>{e.date}</td><td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', background: '#FFF5F0', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#CC5500' }}>{e.compte} - {getCompteNom(e.compte)}</span></td><td style={{ padding: '12px 16px' }}>{e.libelle}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td></tr>
              ))}</tbody>
              <tfoot><tr style={{ backgroundColor: '#FAFAFA', fontWeight: '700', borderTop: '2px solid #E8E8E8' }}><td colSpan={3} style={{ padding: '12px 16px', textAlign: 'right' }}>TOTAUX</td><td style={{ padding: '12px 16px', textAlign: 'right', color: '#ef4444' }}>{totalDebit.toLocaleString()}</td><td style={{ padding: '12px 16px', textAlign: 'right', color: '#10b981' }}>{totalCredit.toLocaleString()}</td></tr></tfoot>
            </table>
          </div>
        )}

        {/* ÉCRITURES */}
        {activeTab === 'ecritures' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Date</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Compte</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Libellé</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Débit</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Crédit</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Pièce</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Actions</th></tr></thead>
              <tbody>{ecritures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #F0F0F0' }}><td style={{ padding: '12px 16px', fontSize: '12px' }}>{e.date}</td><td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', background: '#FFF5F0', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#CC5500' }}>{e.compte}</span></td><td style={{ padding: '12px 16px' }}>{e.libelle}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td><td style={{ padding: '12px 16px', fontSize: '11px', color: '#999' }}>{e.piece || '-'}</td><td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button onClick={() => handleEdit(e)} style={{ padding: '5px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>✏️</button>
                    <button onClick={() => handleDelete(e.id)} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                  </div></td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
