'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function LogistiquePage() {
  const router = useRouter()
  const [livraisons, setLivraisons] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [form, setForm] = useState({
    origine: '', destination: '', transporteur: '', dateDepart: '', 
    produits: '', quantite: '', fraisTransport: '', notes: ''
  })

  useEffect(() => { 
    dataService.init()
    chargerLivraisons()
  }, [])
  
  const chargerLivraisons = () => {
    const liv = dataService.getAll('data_livraisons')
    if (liv.length === 0) {
      const init = [
        { id: 1, reference: 'LIV-2024-001', origine: 'Koudougou', destination: 'Ouagadougou', dateDepart: '2024-06-01', statut: 'Livrée', transporteur: 'TransCargo', produits: 'Tomates', quantite: '500kg', frais: 25000, notes: '' },
        { id: 2, reference: 'LIV-2024-002', origine: 'Réo', destination: 'Koudougou', dateDepart: '2024-06-05', statut: 'En cours', transporteur: 'SpeedLog', produits: 'Mil', quantite: '1 tonne', frais: 45000, notes: 'Livraison urgente' },
        { id: 3, reference: 'LIV-2024-003', origine: 'Dédougou', destination: 'Bobo-Dioulasso', dateDepart: '2024-06-10', statut: 'Planifiée', transporteur: 'TransCargo', produits: 'Oignons', quantite: '300kg', frais: 35000, notes: '' },
      ]
      localStorage.setItem('data_livraisons', JSON.stringify(init))
      setLivraisons(init)
    } else {
      setLivraisons(liv)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.origine || !form.destination) { showNotif('⚠️ Origine et destination obligatoires'); return }
    
    const livraison = {
      ...form,
      frais: parseFloat(form.fraisTransport) || 0,
      reference: editingId ? undefined : `LIV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      statut: editingId ? undefined : 'Planifiée'
    }

    if (editingId) {
      dataService.update('data_livraisons', editingId, livraison)
      showNotif('✅ Livraison modifiée !')
    } else {
      dataService.create('data_livraisons', livraison)
      // Ajouter en caisse (frais de transport)
      if (livraison.frais > 0) {
        dataService.create('data_operations', {
          type: 'SORTIE', montant: livraison.frais,
          motif: `Transport - ${livraison.origine} → ${livraison.destination}`,
          modePaiement: 'ESPECES', dateOperation: livraison.dateDepart
        })
      }
      showNotif('✅ Livraison enregistrée !')
    }
    setShowForm(false)
    setEditingId(null)
    setForm({ origine: '', destination: '', transporteur: '', dateDepart: '', produits: '', quantite: '', fraisTransport: '', notes: '' })
    chargerLivraisons()
  }

  const handleEdit = (l: any) => {
    setEditingId(l.id)
    setForm({
      origine: l.origine || '', destination: l.destination || '', transporteur: l.transporteur || '',
      dateDepart: l.dateDepart || '', produits: l.produits || '', quantite: l.quantite || '',
      fraisTransport: l.frais?.toString() || '', notes: l.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette livraison ?')) {
      dataService.delete('data_livraisons', id)
      chargerLivraisons()
      showNotif('🗑️ Livraison supprimée !')
    }
  }

  const handleStatus = (id: number, statut: string) => {
    dataService.update('data_livraisons', id, { statut })
    chargerLivraisons()
    showNotif(`✅ Statut changé en "${statut}" !`)
  }

  const imprimerBonLivraison = (l: any) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bon Livraison - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px}
.info-box{background:#FAFAFA;border:1px solid #e8e8e8;border-radius:8px;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.info-box p{margin:4px 0}
table{width:100%;border-collapse:collapse}th{background:#FFF5F0;padding:10px;text-align:left;font-size:10px;color:#CC5500;border:1px solid #e8e8e8}td{padding:10px;border:1px solid #e8e8e8}
.signatures{display:flex;justify-content:space-between;margin-top:40px}.signature{text-align:center;width:45%}.signature-line{border-top:1px solid #1a1a1a;width:80%;margin:30px auto 8px}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>📦 BON DE LIVRAISON N° ${l.reference}</h2>
<div class="info-box"><div><p><strong>Origine:</strong> ${l.origine}</p><p><strong>Destination:</strong> ${l.destination}</p></div><div><p><strong>Transporteur:</strong> ${l.transporteur}</p><p><strong>Date:</strong> ${l.dateDepart}</p></div><div><p><strong>Produits:</strong> ${l.produits}</p><p><strong>Quantité:</strong> ${l.quantite}</p></div><div><p><strong>Statut:</strong> ${l.statut}</p><p><strong>Frais:</strong> ${l.frais?.toLocaleString()} FCFA</p></div></div>
<table><thead><tr><th>Produit</th><th style="text-align:center">Quantité</th><th>Conditionnement</th><th style="text-align:right">Observations</th></tr></thead><tbody><tr><td>${l.produits || 'Marchandises'}</td><td style="text-align:center">${l.quantite || '-'}</td><td>-</td><td style="text-align:right">${l.notes || 'Néant'}</td></tr></tbody></table>
<div class="signatures"><div class="signature"><div class="signature-line"></div><p style="font-size:11px">Le Transporteur</p></div><div class="signature"><div class="signature-line"></div><p style="font-size:11px">Le Réceptionnaire</p></div></div>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer le bon de livraison</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const filtered = livraisons.filter(l => {
    const match = (l.origine || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (l.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (l.reference || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filterStatut) return match && l.statut === filterStatut
    return match
  })

  const totalFrais = livraisons.reduce((s, l) => s + (l.frais || 0), 0)
  const enCours = livraisons.filter(l => l.statut === 'En cours').length
  const livrees = livraisons.filter(l => l.statut === 'Livrée').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🚚 Logistique</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({livraisons.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ origine: '', destination: '', transporteur: '', dateDepart: '', produits: '', quantite: '', fraisTransport: '', notes: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvelle Livraison'}
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Livraisons', value: livraisons.length, icon: '🚚', color: '#f97316' },
            { label: 'En cours', value: enCours, icon: '🔄', color: '#3b82f6' },
            { label: 'Livrées', value: livrees, icon: '✅', color: '#10b981' },
            { label: 'Frais Total', value: `${totalFrais.toLocaleString()} FCFA`, icon: '💰', color: '#CC5500' },
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
            <h3 style={{ color: '#f97316', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
              {editingId ? '✏️ Modifier la livraison' : '➕ Nouvelle Livraison'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Origine *</label><input required value={form.origine} onChange={e => setForm({...form, origine: e.target.value})} placeholder="Ville de départ" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Destination *</label><input required value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="Ville d'arrivée" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Transporteur</label><input value={form.transporteur} onChange={e => setForm({...form, transporteur: e.target.value})} placeholder="Nom du transporteur" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date départ</label><input type="date" value={form.dateDepart} onChange={e => setForm({...form, dateDepart: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Produits</label><input value={form.produits} onChange={e => setForm({...form, produits: e.target.value})} placeholder="Type de produits" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Quantité</label><input value={form.quantite} onChange={e => setForm({...form, quantite: e.target.value})} placeholder="Ex: 500kg" style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Frais transport (FCFA)</label><input type="number" value={form.fraisTransport} onChange={e => setForm({...form, fraisTransport: e.target.value})} placeholder="25000" style={is} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Observations..." style={is} /></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres + Recherche */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher par origine, destination ou référence..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="">Tous statuts</option>
            <option value="Planifiée">📅 Planifiée</option>
            <option value="En cours">🔄 En cours</option>
            <option value="Livrée">✅ Livrée</option>
          </select>
        </div>

        {/* Tableau */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Réf.</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Origine</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Destination</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Date</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Transporteur</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Frais</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Statut</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Aucune livraison trouvée</td></tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#f97316', fontFamily: 'monospace', fontSize: '11px' }}>{l.reference}</td>
                    <td style={{ padding: '12px 16px' }}>{l.origine}</td>
                    <td style={{ padding: '12px 16px' }}>{l.destination}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>{l.dateDepart}</td>
                    <td style={{ padding: '12px 16px' }}>{l.transporteur}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#CC5500' }}>{l.frais?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <select value={l.statut} onChange={e => handleStatus(l.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: 'none', cursor: 'pointer',
                          background: l.statut === 'Livrée' ? '#ECFDF5' : l.statut === 'En cours' ? '#EFF6FF' : '#FFFBEB',
                          color: l.statut === 'Livrée' ? '#10b981' : l.statut === 'En cours' ? '#3b82f6' : '#f59e0b' }}>
                        <option value="Planifiée">📅 Planifiée</option>
                        <option value="En cours">🔄 En cours</option>
                        <option value="Livrée">✅ Livrée</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => imprimerBonLivraison(l)} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Imprimer">🖨️</button>
                        <button onClick={() => handleEdit(l)} style={{ padding: '6px 10px', background: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Modifier">✏️</button>
                        <button onClick={() => handleDelete(l.id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
