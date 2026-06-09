'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function CaissePage() {
  const router = useRouter()
  const [operations, setOperations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('tous')
  const [form, setForm] = useState({
    type: 'ENTREE', montant: '', motif: '', modePaiement: 'ESPECES', reference: '', notes: ''
  })

  useEffect(() => { dataService.init(); chargerOperations() }, [])
  const chargerOperations = () => setOperations(dataService.getOperations())
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const solde = operations.reduce((s, o) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0)
  const entrees = operations.filter(o => o.type === 'ENTREE').reduce((s, o) => s + (o.montant || 0), 0)
  const sorties = operations.filter(o => o.type === 'SORTIE').reduce((s, o) => s + (o.montant || 0), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.montant || parseFloat(form.montant) <= 0) { showNotif('⚠️ Veuillez entrer un montant valide'); return }
    
    const op = {
      ...form,
      montant: parseFloat(form.montant),
      dateOperation: new Date().toISOString().split('T')[0],
      reference: form.reference || `OP-${Date.now().toString().slice(-6)}`
    }
    
    if (editingId) {
      dataService.update('data_operations', editingId, op)
      showNotif('✅ Opération modifiée avec succès !')
    } else {
      dataService.create('data_operations', op)
      showNotif('✅ Opération enregistrée avec succès !')
    }
    setShowForm(false); setEditingId(null)
    setForm({ type: 'ENTREE', montant: '', motif: '', modePaiement: 'ESPECES', reference: '', notes: '' })
    chargerOperations()
  }

  const handleEdit = (o: any) => {
    setEditingId(o.id)
    setForm({
      type: o.type, montant: o.montant?.toString() || '', motif: o.motif || '',
      modePaiement: o.modePaiement || 'ESPECES', reference: o.reference || '', notes: o.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette opération ?')) {
      dataService.delete('data_operations', id)
      chargerOperations()
      showNotif('🗑️ Opération supprimée !')
    }
  }

  const imprimerRecu = (op: any) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reçu - Synchro ERP</title>
  <style>
    @page { size: A5; margin: 10mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.6; padding: 15px; }
    
    .header { text-align: center; border-bottom: 2px dashed #CC5500; padding-bottom: 12px; margin-bottom: 16px; }
    .header img { width: 50px; height: 50px; object-fit: contain; border-radius: 8px; margin-bottom: 8px; }
    .header h1 { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 2px 0; }
    .header p { font-size: 10px; color: #CC5500; font-weight: 600; margin: 0; }
    
    h2 { text-align: center; font-size: 14px; font-weight: 700; margin: 12px 0; color: #CC5500; }
    
    .montant-box { text-align: center; padding: 16px; background: ${op.type === 'ENTREE' ? '#ECFDF5' : '#FEF2F2'}; border-radius: 8px; margin: 16px 0; }
    .montant { font-size: 28px; font-weight: 700; color: ${op.type === 'ENTREE' ? '#10b981' : '#ef4444'}; }
    
    .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .info-table td { padding: 6px 8px; border-bottom: 1px solid #f0f0f0; }
    .info-table td:first-child { font-weight: 600; color: #666; font-size: 10px; text-transform: uppercase; width: 40%; }
    .info-table td:last-child { font-size: 12px; font-weight: 500; }
    
    .footer { border-top: 2px dashed #CC5500; padding-top: 12px; margin-top: 20px; font-size: 9px; color: #999; text-align: center; }
    .footer p { margin: 2px 0; }
    
    .no-print { text-align: center; margin-top: 16px; }
    .no-print button { padding: 10px 24px; background: #CC5500; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; }
    
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="/logo.png" alt="Synchro ERP" />
    <h1>Synchro ERP</h1>
    <p>Plus qu'un ERP, un Partenaire</p>
    <p style="color:#666;font-size:9px;">Coopérative Agricole - Koudougou</p>
    <p style="color:#999;font-size:8px;">RCCM: BF-2024-001 | NIF: 123456789</p>
  </div>

  <h2>${op.type === 'ENTREE' ? '💰 REÇU DE PAIEMENT' : '💸 REÇU DE DÉCAISSEMENT'}</h2>

  <div class="montant-box">
    <p style="font-size:10px;color:#666;">${op.type === 'ENTREE' ? 'Montant reçu' : 'Montant payé'}</p>
    <p class="montant">${op.montant?.toLocaleString()} FCFA</p>
    <p style="font-size:10px;color:#999;">Reçu N° ${op.reference || op.id}</p>
  </div>

  <table class="info-table">
    <tr><td>Type</td><td><span style="color:${op.type==='ENTREE'?'#10b981':'#ef4444'};font-weight:600;">${op.type === 'ENTREE' ? 'ENTRÉE (Encaissement)' : 'SORTIE (Décaissement)'}</span></td></tr>
    <tr><td>Motif</td><td>${op.motif}</td></tr>
    <tr><td>Mode de paiement</td><td>${op.modePaiement === 'ESPECES' ? '💵 Espèces' : op.modePaiement === 'ORANGE_MONEY' ? '📱 Orange Money' : op.modePaiement === 'MOOV_MONEY' ? '📱 Moov Money' : '🏦 Banque'}</td></tr>
    <tr><td>Date</td><td>${new Date(op.dateOperation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
    <tr><td>Référence</td><td>${op.reference || 'N/A'}</td></tr>
    ${op.notes ? `<tr><td>Notes</td><td>${op.notes}</td></tr>` : ''}
  </table>

  <p style="font-size:10px;color:#999;text-align:center;margin-top:12px;">
    Reçu établi pour la somme de <strong>${op.montant?.toLocaleString()} Francs CFA</strong>
  </p>

  <div style="text-align:right;margin-top:20px;font-size:10px;">
    <p>Fait le ${new Date().toLocaleDateString('fr-FR')}</p>
    <br/>
    <p style="border-top:1px solid #1a1a1a;width:150px;display:inline-block;padding-top:4px;">Signature</p>
  </div>

  <div class="footer">
    <p>Synchro ERP - Plus qu'un ERP, un Partenaire</p>
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    <p style="color:#CC5500;font-weight:500;margin-top:4px;">Construit par Manawa Techs © 2026</p>
  </div>

  <div class="no-print">
    <button onclick="window.print()">🖨️ Imprimer le reçu</button>
  </div>
</body>
</html>`

    const fenetre = window.open('', '_blank', 'width=500,height=700')
    if (fenetre) {
      fenetre.document.write(html)
      fenetre.document.close()
    }
  }

  const filtered = operations.filter(o => {
    const match = (o.motif || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (o.reference || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filterType === 'tous') return match
    if (filterType === 'entrees') return match && o.type === 'ENTREE'
    if (filterType === 'sorties') return match && o.type === 'SORTIE'
    return match
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>💵 Caisse & Paiements</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({operations.length})</span>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); if (showForm) { setEditingId(null); setForm({ type: 'ENTREE', montant: '', motif: '', modePaiement: 'ESPECES', reference: '', notes: '' }) } }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvelle Opération'}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Solde Actuel', value: `${solde.toLocaleString()} FCFA`, icon: '💰', color: solde >= 0 ? '#004D4D' : '#ef4444' },
            { label: 'Total Entrées', value: `${entrees.toLocaleString()} FCFA`, icon: '📥', color: '#10b981' },
            { label: 'Total Sorties', value: `${sorties.toLocaleString()} FCFA`, icon: '📤', color: '#ef4444' },
            { label: 'Nb Opérations', value: operations.length, icon: '📊', color: '#3b82f6' },
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
              {editingId ? '✏️ Modifier l\'opération' : form.type === 'ENTREE' ? '💰 Nouvelle Entrée' : '💸 Nouvelle Sortie'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{...inputStyle, background: 'white'}}>
                    <option value="ENTREE">💰 Entrée (Encaissement)</option>
                    <option value="SORTIE">💸 Sortie (Décaissement)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Montant (FCFA) *</label>
                  <input type="number" required value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} placeholder="Ex: 50000" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Motif *</label>
                  <input required value={form.motif} onChange={e => setForm({...form, motif: e.target.value})} placeholder="Ex: Vente de tomates" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Mode de paiement</label>
                  <select value={form.modePaiement} onChange={e => setForm({...form, modePaiement: e.target.value})} style={{...inputStyle, background: 'white'}}>
                    <option value="ESPECES">💵 Espèces</option>
                    <option value="ORANGE_MONEY">📱 Orange Money</option>
                    <option value="MOOV_MONEY">📱 Moov Money</option>
                    <option value="BANQUE">🏦 Banque</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Référence</label>
                  <input value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} placeholder="Auto-généré si vide" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Observations..." style={{...inputStyle, resize: 'vertical', minHeight: '50px'}} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres + Recherche */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher par motif ou référence..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="tous">Toutes les opérations</option>
            <option value="entrees">💰 Entrées</option>
            <option value="sorties">💸 Sorties</option>
          </select>
        </div>

        {/* Tableau */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Motif</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', color: '#666' }}>Montant</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Mode</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Réf.</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>💵</div>
                    Aucune opération trouvée
                  </td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>
                      {new Date(o.dateOperation).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{o.motif}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', fontSize: '14px', color: o.type === 'ENTREE' ? '#10b981' : '#ef4444' }}>
                      {o.type === 'ENTREE' ? '+' : '-'}{o.montant?.toLocaleString()} FCFA
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: o.type === 'ENTREE' ? '#ECFDF5' : '#FEF2F2', color: o.type === 'ENTREE' ? '#10b981' : '#ef4444' }}>
                        {o.type === 'ENTREE' ? '💰 Entrée' : '💸 Sortie'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>{o.modePaiement}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>{o.reference || '-'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => imprimerRecu(o)} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Imprimer le reçu">
                          🧾
                        </button>
                        <button onClick={() => handleEdit(o)} style={{ padding: '6px 10px', background: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Modifier">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(o.id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Supprimer">
                          🗑️
                        </button>
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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px',
  fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box'
}
