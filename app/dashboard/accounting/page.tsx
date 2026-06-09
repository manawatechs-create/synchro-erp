'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'
import { useApp } from '../../context/AppContext'

export default function AccountingPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [activeTab, setActiveTab] = useState('bilan')
  const [showForm, setShowForm] = useState(false)
  const [ecritures, setEcritures] = useState<any[]>([])
  const [ventes, setVentes] = useState<any[]>([])
  const [achats, setAchats] = useState<any[]>([])
  const [operations, setOperations] = useState<any[]>([])

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    compte: '70',
    libelle: '',
    debit: '',
    credit: '',
    piece: ''
  })

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = () => {
    const ecrituresData = dataService.getAll('data_ecritures')
    if (ecrituresData.length === 0) {
      const init = [
        { id: 1, date: '2024-06-08', compte: '70', libelle: 'Vente de tomates', debit: 0, credit: 150000, piece: 'FAC-001' },
        { id: 2, date: '2024-06-07', compte: '60', libelle: 'Achat engrais', debit: 85000, credit: 0, piece: 'ACH-001' },
        { id: 3, date: '2024-06-06', compte: '70', libelle: 'Vente de mil', debit: 0, credit: 230000, piece: 'FAC-002' },
        { id: 4, date: '2024-06-05', compte: '50', libelle: 'Dépôt bancaire', debit: 300000, credit: 0, piece: 'BQ-001' },
        { id: 5, date: '2024-06-04', compte: '80', libelle: 'Frais transport', debit: 25000, credit: 0, piece: 'CH-001' },
        { id: 6, date: '2024-06-03', compte: '70', libelle: 'Vente oignons', debit: 0, credit: 85000, piece: 'FAC-003' },
        { id: 7, date: '2024-06-02', compte: '60', libelle: 'Achat semences', debit: 45000, credit: 0, piece: 'ACH-002' },
        { id: 8, date: '2024-06-01', compte: '80', libelle: 'Électricité', debit: 15000, credit: 0, piece: 'CH-002' },
      ]
      localStorage.setItem('data_ecritures', JSON.stringify(init))
      setEcritures(init)
    } else {
      setEcritures(ecrituresData)
    }
    setVentes(dataService.getVentes())
    setAchats(dataService.getAchats())
    setOperations(dataService.getOperations())
  }

  const handleAddEcriture = (e: React.FormEvent) => {
    e.preventDefault()
    const nouvelle = {
      id: Date.now(),
      date: formData.date,
      compte: formData.compte,
      libelle: formData.libelle,
      debit: parseFloat(formData.debit) || 0,
      credit: parseFloat(formData.credit) || 0,
      piece: formData.piece
    }
    dataService.create('data_ecritures', nouvelle)
    addNotification({ type: 'success', message: '✅ Écriture enregistrée !' })
    setShowForm(false)
    setFormData({ date: new Date().toISOString().split('T')[0], compte: '70', libelle: '', debit: '', credit: '', piece: '' })
    chargerDonnees()
  }

  // Calculs comptables
  const totalDebit = ecritures.reduce((s, e) => s + (e.debit || 0), 0)
  const totalCredit = ecritures.reduce((s, e) => s + (e.credit || 0), 0)
  
  const totalVentes = ventes.filter(v => v.statut === 'VALIDEE').reduce((s, v) => s + (v.montantTotal || 0), 0)
  const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)
  const soldeCaisse = operations.reduce((s, o) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0)
  const benefice = totalVentes - totalAchats

  const planComptable = [
    { code: '10', nom: 'Capital' },
    { code: '20', nom: 'Immobilisations' },
    { code: '30', nom: 'Stocks' },
    { code: '40', nom: 'Fournisseurs' },
    { code: '41', nom: 'Clients' },
    { code: '50', nom: 'Banque' },
    { code: '51', nom: 'Caisse' },
    { code: '60', nom: 'Achats' },
    { code: '70', nom: 'Ventes' },
    { code: '80', nom: 'Charges' },
  ]

  const getCompteNom = (code: string) => planComptable.find(c => c.code === code)?.nom || code

  // Bilan
  const actif = [
    { poste: 'Banque', montant: soldeCaisse * 0.7 },
    { poste: 'Caisse', montant: soldeCaisse * 0.3 },
    { poste: 'Stocks', montant: totalAchats * 0.4 },
    { poste: 'Créances clients', montant: totalVentes * 0.15 },
  ]
  const passif = [
    { poste: 'Capital', montant: 3000000 },
    { poste: 'Réserves', montant: 500000 },
    { poste: 'Résultat', montant: benefice },
    { poste: 'Dettes fournisseurs', montant: totalAchats * 0.2 },
  ]
  const totalActif = actif.reduce((s, a) => s + a.montant, 0)
  const totalPassif = passif.reduce((s, p) => s + p.montant, 0)

  // Compte de résultat
  const produits = [
    { poste: 'Ventes de marchandises', montant: totalVentes },
    { poste: 'Produits accessoires', montant: totalVentes * 0.05 },
  ]
  const charges = [
    { poste: 'Achats', montant: totalAchats },
    { poste: 'Transport', montant: totalAchats * 0.08 },
    { poste: 'Salaires', montant: 800000 },
    { poste: 'Électricité/Eau', montant: 125000 },
  ]
  const totalProduits = produits.reduce((s, p) => s + p.montant, 0)
  const totalCharges = charges.reduce((s, c) => s + c.montant, 0)
  const resultat = totalProduits - totalCharges

  const tabs = [
    { id: 'bilan', label: '📊 Bilan', icon: '📊' },
    { id: 'resultat', label: '💰 Compte de Résultat', icon: '💰' },
    { id: 'grand-livre', label: '📚 Grand Livre', icon: '📚' },
    { id: 'tresorerie', label: '💵 Trésorerie', icon: '💵' },
    { id: 'ecritures', label: '📝 Écritures', icon: '📝' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>💳 Comptabilité</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({ecritures.length} écritures)</span>
          </div>
          <button className="erp-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouvelle Écriture'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px', minWidth: 'max-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400',
              color: activeTab === tab.id ? couleurPrincipale : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? `3px solid ${couleurPrincipale}` : '3px solid transparent',
              whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="erp-page-content">
        {/* Formulaire écriture */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '20px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>➕ Nouvelle Écriture Comptable</h3>
            <form onSubmit={handleAddEcriture}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Date *</label>
                  <input className="erp-input" type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Compte *</label>
                  <select className="erp-select" value={formData.compte} onChange={e => setFormData({...formData, compte: e.target.value})}>
                    {planComptable.map(c => <option key={c.code} value={c.code}>{c.code} - {c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Libellé *</label>
                  <input className="erp-input" required value={formData.libelle} onChange={e => setFormData({...formData, libelle: e.target.value})} placeholder="Description" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Débit (FCFA)</label>
                  <input className="erp-input" type="number" value={formData.debit} onChange={e => setFormData({...formData, debit: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Crédit (FCFA)</label>
                  <input className="erp-input" type="number" value={formData.credit} onChange={e => setFormData({...formData, credit: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Pièce justificative</label>
                  <input className="erp-input" value={formData.piece} onChange={e => setFormData({...formData, piece: e.target.value})} placeholder="N° pièce" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">💾 Enregistrer l'écriture</button>
                <button type="button" className="erp-btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* BILAN */}
        {activeTab === 'bilan' && (
          <div>
            <div className="erp-grid-4" style={{ marginBottom: '20px' }}>
              {[
                { label: 'Total Actif', value: `${totalActif.toLocaleString()} FCFA`, color: '#CC5500' },
                { label: 'Total Passif', value: `${totalPassif.toLocaleString()} FCFA`, color: '#004D4D' },
                { label: 'Écart', value: `${(totalActif - totalPassif).toLocaleString()} FCFA`, color: totalActif === totalPassif ? '#10b981' : '#ef4444' },
                { label: 'Équilibré', value: totalActif === totalPassif ? '✅ Oui' : '❌ Non', color: totalActif === totalPassif ? '#10b981' : '#ef4444' },
              ].map((s, i) => (
                <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
                  <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: s.color, margin: '6px 0 0' }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              <div className="erp-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#CC5500', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #FFF5F0' }}>📈 ACTIF</h3>
                {actif.map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{a.poste}</span>
                    <span style={{ fontWeight: '700', color: '#CC5500' }}>{a.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', fontSize: '15px', borderTop: '2px solid #E8E8E8', marginTop: '4px' }}>
                  <span>TOTAL ACTIF</span>
                  <span style={{ color: '#CC5500' }}>{totalActif.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="erp-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#004D4D', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #F0F7F7' }}>📉 PASSIF</h3>
                {passif.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.poste}</span>
                    <span style={{ fontWeight: '700', color: '#004D4D' }}>{p.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', fontSize: '15px', borderTop: '2px solid #E8E8E8', marginTop: '4px' }}>
                  <span>TOTAL PASSIF</span>
                  <span style={{ color: '#004D4D' }}>{totalPassif.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPTE DE RÉSULTAT */}
        {activeTab === 'resultat' && (
          <div>
            <div className="erp-grid-3" style={{ marginBottom: '20px' }}>
              {[
                { label: 'Total Produits', value: `${totalProduits.toLocaleString()} FCFA`, color: '#10b981' },
                { label: 'Total Charges', value: `${totalCharges.toLocaleString()} FCFA`, color: '#ef4444' },
                { label: 'Résultat Net', value: `${resultat.toLocaleString()} FCFA`, color: resultat >= 0 ? '#10b981' : '#ef4444' },
              ].map((s, i) => (
                <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
                  <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '6px 0 0' }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              <div className="erp-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #ECFDF5' }}>📈 PRODUITS</h3>
                {produits.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span>{p.poste}</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>{p.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', fontSize: '15px', borderTop: '2px solid #E8E8E8' }}>
                  <span>TOTAL PRODUITS</span>
                  <span style={{ color: '#10b981' }}>{totalProduits.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="erp-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #FEF2F2' }}>📉 CHARGES</h3>
                {charges.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span>{c.poste}</span>
                    <span style={{ fontWeight: '700', color: '#ef4444' }}>{c.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', fontSize: '15px', borderTop: '2px solid #E8E8E8' }}>
                  <span>TOTAL CHARGES</span>
                  <span style={{ color: '#ef4444' }}>{totalCharges.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: resultat >= 0 ? '#ECFDF5' : '#FEF2F2', borderRadius: '12px' }}>
              <span style={{ fontSize: '20px', fontWeight: '700', color: resultat >= 0 ? '#10b981' : '#ef4444' }}>
                Résultat Net: {resultat.toLocaleString()} FCFA {resultat >= 0 ? '✅ Bénéfice' : '❌ Perte'}
              </span>
            </div>
          </div>
        )}

        {/* GRAND LIVRE */}
        {activeTab === 'grand-livre' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table" style={{ border: 'none' }}>
                <thead><tr><th>Date</th><th>Compte</th><th>Libellé</th><th style={{ textAlign: 'right' }}>Débit</th><th style={{ textAlign: 'right' }}>Crédit</th><th>Pièce</th></tr></thead>
                <tbody>
                  {ecritures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td><span style={{ padding: '3px 8px', backgroundColor: '#FFF5F0', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#CC5500' }}>{e.compte} - {getCompteNom(e.compte)}</span></td>
                      <td>{e.libelle}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                      <td style={{ color: '#999', fontSize: '12px' }}>{e.piece || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#FAFAFA', fontWeight: '700', borderTop: '2px solid #E8E8E8' }}>
                    <td colSpan={3} style={{ textAlign: 'right', padding: '12px 16px' }}>TOTAUX</td>
                    <td style={{ textAlign: 'right', padding: '12px 16px', color: '#ef4444' }}>{totalDebit.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '12px 16px', color: '#10b981' }}>{totalCredit.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TRÉSORERIE */}
        {activeTab === 'tresorerie' && (
          <div>
            <div className="erp-grid-3" style={{ marginBottom: '20px' }}>
              {[
                { label: 'Solde Caisse', value: `${soldeCaisse.toLocaleString()} FCFA`, color: soldeCaisse >= 0 ? '#10b981' : '#ef4444' },
                { label: 'Entrées', value: `${operations.filter(o => o.type === 'ENTREE').reduce((s, o) => s + (o.montant || 0), 0).toLocaleString()} FCFA`, color: '#CC5500' },
                { label: 'Sorties', value: `${operations.filter(o => o.type === 'SORTIE').reduce((s, o) => s + (o.montant || 0), 0).toLocaleString()} FCFA`, color: '#004D4D' },
              ].map((s, i) => (
                <div key={i} className="erp-stat" style={{ borderLeftColor: s.color }}>
                  <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '6px 0 0' }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="erp-card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>📊 Flux de Trésorerie</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '20px' }}>
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((mois, i) => {
                  const h = 40 + Math.random() * 50
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '100%', maxWidth: '50px', height: `${h}%`, background: h > 70 ? 'linear-gradient(180deg, #CC5500, #E8661A)' : 'linear-gradient(180deg, #004D4D, #006666)', borderRadius: '6px 6px 0 0' }}></div>
                      <span style={{ fontSize: '10px', color: '#999' }}>{mois}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ÉCRITURES */}
        {activeTab === 'ecritures' && (
          <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table" style={{ border: 'none' }}>
                <thead><tr><th>Date</th><th>Compte</th><th>Libellé</th><th style={{ textAlign: 'right' }}>Débit</th><th style={{ textAlign: 'right' }}>Crédit</th><th>Pièce</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                <tbody>
                  {ecritures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td><span style={{ padding: '3px 8px', backgroundColor: '#FFF5F0', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#CC5500' }}>{e.compte}</span></td>
                      <td>{e.libelle}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                      <td style={{ color: '#999', fontSize: '12px' }}>{e.piece || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => { dataService.delete('data_ecritures', e.id); chargerDonnees(); addNotification({ type: 'success', message: '🗑️ Écriture supprimée' }) }}
                          style={{ padding: '5px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
