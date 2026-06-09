'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '@/services/dataService'
import { imprimerFacture } from '@/services/printService'
import { useApp } from '@/context/AppContext'

export default function FacturesPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [factures, setFactures] = useState<any[]>([])
  const [filter, setFilter] = useState('toutes')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    chargerFactures()
  }, [])

  const chargerFactures = () => {
    const ventes = dataService.getVentes()
    // Transformer les ventes en factures formatées
    const facturesData = ventes.map((v: any) => ({
      id: v.id,
      numero: `FAC-${new Date(v.dateVente).getFullYear()}${String(new Date(v.dateVente).getMonth() + 1).padStart(2, '0')}-${String(v.id).padStart(4, '0')}`,
      date: v.dateVente,
      dateEcheance: new Date(new Date(v.dateVente).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client: v.membre?.prenom + ' ' + v.membre?.nom || 'Client',
      clientEmail: v.membre?.email || '',
      clientTel: v.membre?.telephone || '',
      produits: [{ nom: 'Produits agricoles', quantite: 1, prixUnitaire: v.montantTotal, total: v.montantTotal }],
      totalHT: Math.round(v.montantTotal / 1.18),
      tva: Math.round(v.montantTotal - v.montantTotal / 1.18),
      totalTTC: v.montantTotal,
      statut: v.statut === 'VALIDEE' ? 'Payée' : 'En attente',
      notes: v.notes || ''
    }))
    setFactures(facturesData)
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    const venteStatus = newStatus === 'Payée' ? 'VALIDEE' : 'EN_ATTENTE'
    dataService.update('data_ventes', id, { statut: venteStatus })
    chargerFactures()
    addNotification({ type: 'success', message: `✅ Facture marquée comme "${newStatus}" !` })
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette facture ?')) {
      dataService.delete('data_ventes', id)
      chargerFactures()
      addNotification({ type: 'success', message: '🗑️ Facture supprimée !' })
    }
  }

  const filteredFactures = factures.filter(f => {
    const matchSearch = f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filter === 'toutes' || 
                        (filter === 'payees' && f.statut === 'Payée') ||
                        (filter === 'en_attente' && f.statut === 'En attente') ||
                        (filter === 'annulees' && f.statut === 'Annulée')
    return matchSearch && matchFilter
  })

  const totalTTC = filteredFactures.filter(f => f.statut === 'Payée').reduce((s, f) => s + (f.totalTTC || 0), 0)
  const totalEnAttente = filteredFactures.filter(f => f.statut === 'En attente').reduce((s, f) => s + (f.totalTTC || 0), 0)
  const nbPayees = factures.filter(f => f.statut === 'Payée').length
  const nbEnAttente = factures.filter(f => f.statut === 'En attente').length

  const filters = [
    { id: 'toutes', label: 'Toutes', count: factures.length },
    { id: 'payees', label: '✅ Payées', count: nbPayees },
    { id: 'en_attente', label: '⏳ En attente', count: nbEnAttente },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🧾 Gestion des Factures</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({factures.length})</span>
          </div>
        </div>
      </div>

      <div className="erp-page-content">
        {/* KPIs */}
        <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Total Payé', value: `${totalTTC.toLocaleString()} FCFA`, icon: '✅', color: '#10b981' },
            { label: 'En attente', value: `${totalEnAttente.toLocaleString()} FCFA`, icon: '⏳', color: '#f59e0b' },
            { label: 'Factures payées', value: nbPayees, icon: '🧾', color: '#004D4D' },
            { label: 'Factures en attente', value: nbEnAttente, icon: '📋', color: '#CC5500' },
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

        {/* Filtres et recherche */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            className="erp-input"
            style={{ flex: '1 1 300px' }}
            placeholder="🔍 Rechercher par N° facture ou client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '8px 16px', borderRadius: '8px',
                border: filter === f.id ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
                backgroundColor: filter === f.id ? couleurPrincipale + '10' : 'var(--bg-card)',
                color: filter === f.id ? couleurPrincipale : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '12px', fontWeight: filter === f.id ? '600' : '400',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                {f.label}
                <span style={{
                  padding: '1px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700',
                  backgroundColor: filter === f.id ? couleurPrincipale : 'var(--bg-input)',
                  color: filter === f.id ? 'white' : 'var(--text-muted)'
                }}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tableau des factures */}
        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Échéance</th>
                  <th style={{ textAlign: 'right' }}>Total HT</th>
                  <th style={{ textAlign: 'right' }}>TVA</th>
                  <th style={{ textAlign: 'right' }}>Total TTC</th>
                  <th style={{ textAlign: 'center' }}>Statut</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧾</div>
                      <p>Aucune facture trouvée</p>
                    </td>
                  </tr>
                ) : (
                  filteredFactures.map(f => (
                    <tr key={f.id} style={{ backgroundColor: f.statut === 'En attente' ? '#FFFDF5' : 'transparent' }}>
                      <td style={{ fontWeight: '600', color: '#CC5500', fontFamily: 'monospace', fontSize: '12px' }}>{f.numero}</td>
                      <td>
                        <div>
                          <p style={{ fontWeight: '600', color: 'var(--text)', margin: 0 }}>{f.client}</p>
                          {f.clientTel && <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>📱 {f.clientTel}</p>}
                        </div>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(f.date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ fontSize: '12px', color: f.statut === 'En attente' && new Date(f.dateEcheance) < new Date() ? '#ef4444' : 'var(--text-secondary)' }}>
                        {new Date(f.dateEcheance).toLocaleDateString('fr-FR')}
                        {f.statut === 'En attente' && new Date(f.dateEcheance) < new Date() && (
                          <span style={{ display: 'block', fontSize: '10px', color: '#ef4444', fontWeight: '600' }}>En retard</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>{f.totalHT?.toLocaleString()} FCFA</td>
                      <td style={{ textAlign: 'right', color: '#666' }}>{f.tva?.toLocaleString()} FCFA</td>
                      <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '14px', color: '#CC5500' }}>{f.totalTTC?.toLocaleString()} FCFA</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`erp-badge ${f.statut === 'Payée' ? 'erp-badge-success' : f.statut === 'En attente' ? 'erp-badge-warning' : 'erp-badge-danger'}`}>
                          {f.statut}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button onClick={() => imprimerFacture(f)}
                            style={{ padding: '6px 10px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                            title="Imprimer la facture">
                            🖨️
                          </button>
                          {f.statut === 'En attente' && (
                            <button onClick={() => handleStatusChange(f.id, 'Payée')}
                              style={{ padding: '6px 10px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                              title="Marquer comme payée">
                              ✅
                            </button>
                          )}
                          {f.statut === 'Payée' && (
                            <button onClick={() => handleStatusChange(f.id, 'En attente')}
                              style={{ padding: '6px 10px', backgroundColor: '#FFFBEB', color: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                              title="Marquer comme en attente">
                              ⏳
                            </button>
                          )}
                          <button onClick={() => handleDelete(f.id)}
                            style={{ padding: '6px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                            title="Supprimer">
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
    </div>
  )
}
