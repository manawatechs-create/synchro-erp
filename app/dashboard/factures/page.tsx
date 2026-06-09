'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function FacturesPage() {
  const router = useRouter()
  const [factures, setFactures] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('toutes')
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { dataService.init(); chargerFactures() }, [])
  
  const chargerFactures = () => {
    const ventes = dataService.getVentes()
    setFactures(ventes.map((v: any) => ({
      ...v,
      numero: `FAC-${new Date(v.dateVente).getFullYear()}${String(new Date(v.dateVente).getMonth()+1).padStart(2,'0')}-${String(v.id).padStart(4,'0')}`,
      totalHT: Math.round(v.montantTotal / 1.18),
      tva: Math.round(v.montantTotal - v.montantTotal / 1.18),
      dateEcheance: new Date(new Date(v.dateVente).getTime() + 30*24*60*60*1000).toISOString().split('T')[0]
    })))
  }

  const handleStatus = (id: number, statut: string) => {
    dataService.update('data_ventes', id, { statut })
    chargerFactures()
    showNotif(`✅ Facture marquée comme "${statut === 'VALIDEE' ? 'Payée' : 'En attente'}" !`)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette facture ?')) {
      dataService.delete('data_ventes', id)
      chargerFactures()
      showNotif('🗑️ Facture supprimée !')
    }
  }

  const imprimerFacture = (f: any) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Facture ${f.numero} - Synchro ERP</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.6; padding: 20px; }
    
    .header { border-bottom: 3px solid #CC5500; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .header-left img { width: 60px; height: 60px; object-fit: contain; border-radius: 8px; }
    .header-left h1 { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0 0 2px 0; }
    .header-left p { font-size: 11px; color: #CC5500; font-weight: 600; margin: 0; font-style: italic; }
    .header-right { text-align: right; font-size: 11px; color: #666; }
    .header-right p { margin: 2px 0; }
    
    h2 { font-size: 18px; font-weight: 700; color: #CC5500; margin-bottom: 16px; }
    
    .info-box { background: #FAFAFA; border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; margin: 16px 0; display: flex; justify-content: space-between; }
    .info-col { flex: 1; }
    .info-label { font-size: 9px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 13px; font-weight: 600; color: #1a1a1a; }
    
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #FFF5F0; padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #CC5500; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #e8e8e8; }
    td { padding: 10px 12px; border: 1px solid #e8e8e8; font-size: 11px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    .total-section { text-align: right; margin-top: 16px; }
    .total-line { display: flex; justify-content: flex-end; gap: 20px; padding: 4px 0; font-size: 12px; }
    .total-ttc { font-size: 18px; font-weight: 700; color: #CC5500; }
    
    .footer { border-top: 2px solid #CC5500; padding-top: 16px; margin-top: 32px; font-size: 10px; color: #999; text-align: center; }
    .footer p { margin: 2px 0; }
    
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
    .signature { text-align: center; width: 45%; }
    .signature-line { border-top: 1px solid #1a1a1a; width: 80%; margin: 30px auto 8px; }
    
    .no-print { text-align: center; margin-top: 24px; padding: 16px; background: #FFF5F0; border-radius: 8px; }
    .no-print button { padding: 12px 28px; background: #CC5500; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
    
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <!-- EN-TÊTE -->
  <div class="header">
    <div class="header-left">
      <img src="/logo.png" alt="Synchro ERP" />
      <div>
        <h1>Synchro ERP</h1>
        <p>Plus qu'un ERP, un Partenaire</p>
      </div>
    </div>
    <div class="header-right">
      <p><strong>Coopérative Agricole</strong></p>
      <p>Marché Central, Koudougou, Burkina Faso</p>
      <p>Tél: +226 70 00 00 00</p>
      <p>Email: contact@cooperative.bf</p>
      <p>RCCM: BF-2024-001 | NIF: 123456789</p>
    </div>
  </div>

  <h2>🧾 FACTURE N° ${f.numero}</h2>

  <!-- INFOS -->
  <div class="info-box">
    <div class="info-col">
      <p class="info-label">Date de facture</p>
      <p class="info-value">${new Date(f.dateVente).toLocaleDateString('fr-FR')}</p>
      <br/>
      <p class="info-label">Date d'échéance</p>
      <p class="info-value">${new Date(f.dateEcheance).toLocaleDateString('fr-FR')}</p>
    </div>
    <div class="info-col">
      <p class="info-label">Client</p>
      <p class="info-value">${f.membre?.prenom || ''} ${f.membre?.nom || ''}</p>
      <br/>
      <p class="info-label">Statut</p>
      <p class="info-value" style="color: ${f.statut === 'VALIDEE' ? '#10b981' : '#f59e0b'}">${f.statut === 'VALIDEE' ? 'Payée' : 'En attente'}</p>
    </div>
  </div>

  <!-- PRODUITS -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-center">Quantité</th>
        <th class="text-right">Prix unitaire</th>
        <th class="text-right">Montant</th>
      </tr>
    </thead>
    <tbody>
      ${f.produits && f.produits.length > 0 ? f.produits.map((p: any) => `
        <tr>
          <td>${p.produit || 'Produit'}</td>
          <td class="text-center">${p.quantite || 1}</td>
          <td class="text-right">${(p.prixUnitaire || 0).toLocaleString()} FCFA</td>
          <td class="text-right" style="font-weight:600;">${(p.montant || 0).toLocaleString()} FCFA</td>
        </tr>
      `).join('') : `
        <tr>
          <td>Produits agricoles</td>
          <td class="text-center">1</td>
          <td class="text-right">${f.montantTotal?.toLocaleString()} FCFA</td>
          <td class="text-right" style="font-weight:600;">${f.montantTotal?.toLocaleString()} FCFA</td>
        </tr>
      `}
    </tbody>
  </table>

  <!-- TOTAUX -->
  <div class="total-section">
    <div class="total-line"><span>Total HT</span><span style="font-weight:600;">${f.totalHT?.toLocaleString()} FCFA</span></div>
    <div class="total-line"><span>TVA (18%)</span><span style="font-weight:600;">${f.tva?.toLocaleString()} FCFA</span></div>
    <div class="total-line"><span class="total-ttc">Total TTC</span><span class="total-ttc">${f.montantTotal?.toLocaleString()} FCFA</span></div>
  </div>

  <p style="font-size:11px;color:#999;margin-top:12px;">Arrêtée la présente facture à la somme de <strong>${f.montantTotal?.toLocaleString()} Francs CFA</strong>.</p>

  <!-- SIGNATURES -->
  <div class="signatures">
    <div class="signature">
      <div class="signature-line"></div>
      <p style="font-size:11px;">Le Client</p>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <p style="font-size:11px;">La Coopérative</p>
    </div>
  </div>

  <!-- PIED DE PAGE -->
  <div class="footer">
    <p>Synchro ERP - Plus qu'un ERP, un Partenaire</p>
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    <p>Coopérative Agricole - RCCM: BF-2024-001 - NIF: 123456789</p>
    <p style="color:#CC5500;font-weight:500;margin-top:4px;">Construit par Manawa Techs © 2026</p>
  </div>

  <!-- BOUTON IMPRIMER -->
  <div class="no-print">
    <button onclick="window.print()">🖨️ Imprimer la facture</button>
  </div>
</body>
</html>`

    const fenetre = window.open('', '_blank', 'width=900,height=700')
    if (fenetre) {
      fenetre.document.write(html)
      fenetre.document.close()
    }
  }

  const filtered = factures.filter(f => {
    const match = f.numero?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  `${f.membre?.prenom} ${f.membre?.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'toutes') return match
    if (filter === 'payees') return match && f.statut === 'VALIDEE'
    if (filter === 'en_attente') return match && f.statut !== 'VALIDEE'
    return match
  })

  const totalPaye = factures.filter(f => f.statut === 'VALIDEE').reduce((s, f) => s + (f.montantTotal || 0), 0)
  const totalAttente = factures.filter(f => f.statut !== 'VALIDEE').reduce((s, f) => s + (f.montantTotal || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🧾 Factures</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({factures.length})</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Payé', value: `${totalPaye.toLocaleString()} FCFA`, icon: '✅', color: '#10b981' },
            { label: 'En attente', value: `${totalAttente.toLocaleString()} FCFA`, icon: '⏳', color: '#f59e0b' },
            { label: 'Payées', value: factures.filter(f => f.statut === 'VALIDEE').length, icon: '🧾', color: '#004D4D' },
            { label: 'En attente', value: factures.filter(f => f.statut !== 'VALIDEE').length, icon: '📋', color: '#CC5500' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtres + Recherche */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher par N° facture ou client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="toutes">Toutes</option>
            <option value="payees">✅ Payées</option>
            <option value="en_attente">⏳ En attente</option>
          </select>
        </div>

        {/* Tableau */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>N° Facture</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Client</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#666' }}>Échéance</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', color: '#666' }}>HT</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', color: '#666' }}>TVA</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', color: '#666' }}>TTC</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Statut</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Aucune facture trouvée</td></tr>
              ) : (
                filtered.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#CC5500', fontFamily: 'monospace', fontSize: '12px' }}>{f.numero}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{f.membre?.prenom} {f.membre?.nom}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{new Date(f.dateVente).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: new Date(f.dateEcheance) < new Date() && f.statut !== 'VALIDEE' ? '#ef4444' : '#666' }}>
                      {new Date(f.dateEcheance).toLocaleDateString('fr-FR')}
                      {new Date(f.dateEcheance) < new Date() && f.statut !== 'VALIDEE' && <span style={{ display: 'block', fontSize: '10px', color: '#ef4444', fontWeight: '600' }}>En retard</span>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{f.totalHT?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#666' }}>{f.tva?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#CC5500' }}>{f.montantTotal?.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: f.statut === 'VALIDEE' ? '#ECFDF5' : '#FFFBEB', color: f.statut === 'VALIDEE' ? '#10b981' : '#f59e0b' }}>
                        {f.statut === 'VALIDEE' ? 'Payée' : 'En attente'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => imprimerFacture(f)} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Imprimer">
                          🖨️
                        </button>
                        {f.statut !== 'VALIDEE' && (
                          <button onClick={() => handleStatus(f.id, 'VALIDEE')} style={{ padding: '6px 10px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Marquer payée">
                            ✅
                          </button>
                        )}
                        {f.statut === 'VALIDEE' && (
                          <button onClick={() => handleStatus(f.id, 'EN_ATTENTE')} style={{ padding: '6px 10px', background: '#FFFBEB', color: '#f59e0b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }} title="Marquer en attente">
                            ⏳
                          </button>
                        )}
                        <button onClick={() => handleDelete(f.id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Supprimer">
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
