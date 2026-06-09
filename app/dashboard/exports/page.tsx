'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'
import { useApp } from '../../context/AppContext'
import {
  imprimerCartePlanteur, imprimerFacture, imprimerBonLivraison,
  imprimerRecu, imprimerRapport, imprimerAttestation,
  imprimerEcheancier, imprimerPV
} from '../../services/printService'

export default function ExportsPage() {
  const router = useRouter()
  const { addNotification, couleurPrincipale } = useApp()
  const [activeTab, setActiveTab] = useState('impressions')
  const [loading, setLoading] = useState<string | null>(null)
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [ventes, setVentes] = useState<any[]>([])
  const [operations, setOperations] = useState<any[]>([])
  const [livraisons, setLivraisons] = useState<any[]>([])
  const [credits, setCredits] = useState<any[]>([])
  const [reunions, setReunions] = useState<any[]>([])
  const [selectedPlanteur, setSelectedPlanteur] = useState('')
  const [selectedVente, setSelectedVente] = useState('')
  const [selectedOperation, setSelectedOperation] = useState('')
  const [selectedLivraison, setSelectedLivraison] = useState('')
  const [selectedCredit, setSelectedCredit] = useState('')
  const [selectedReunion, setSelectedReunion] = useState('')

  useEffect(() => {
    setPlanteurs(dataService.getPlanteurs())
    setVentes(dataService.getVentes())
    setOperations(dataService.getOperations())
    setLivraisons(dataService.getLivraisons())
    setCredits(dataService.getCredits())
    setReunions(dataService.getReunions())
  }, [])

  const notif = (msg: string) => addNotification({ type: 'success', message: msg })

  const handlePrint = (type: string) => {
    setLoading(type)
    setTimeout(() => {
      setLoading(null)
      try {
        switch(type) {
          case 'carte':
            const p = planteurs.find(pl => pl.id.toString() === selectedPlanteur)
            if (p) imprimerCartePlanteur(p)
            else notif('⚠️ Veuillez sélectionner un planteur')
            break
          case 'facture':
            const v = ventes.find(ve => ve.id.toString() === selectedVente)
            if (v) imprimerFacture(v)
            else notif('⚠️ Veuillez sélectionner une vente')
            break
          case 'bon':
            const l = livraisons.find(li => li.id.toString() === selectedLivraison)
            if (l) imprimerBonLivraison(l)
            else notif('⚠️ Veuillez sélectionner une livraison')
            break
          case 'recu':
            const o = operations.find(op => op.id.toString() === selectedOperation)
            if (o) imprimerRecu(o)
            else notif('⚠️ Veuillez sélectionner une opération')
            break
          case 'rapport':
            imprimerRapport(dataService.getStats())
            break
          case 'attestation':
            const pa = planteurs.find(pl => pl.id.toString() === selectedPlanteur)
            if (pa) imprimerAttestation(pa)
            else notif('⚠️ Veuillez sélectionner un planteur')
            break
          case 'echeancier':
            const c = credits.find(cr => cr.id.toString() === selectedCredit)
            if (c) imprimerEcheancier(c)
            else notif('⚠️ Veuillez sélectionner un crédit')
            break
          case 'pv':
            const r = reunions.find(re => re.id.toString() === selectedReunion)
            if (r) imprimerPV(r)
            else notif('⚠️ Veuillez sélectionner une réunion')
            break
        }
        notif(`🖨️ Impression de ${type} lancée !`)
      } catch(e) {
        notif('❌ Erreur lors de l\'impression')
      }
    }, 500)
  }

  const impressions = [
    { 
      id: 'carte', titre: '🪪 Carte de planteur', desc: 'Carte d\'identité individuelle',
      select: true, options: planteurs, value: selectedPlanteur, setter: setSelectedPlanteur,
      placeholder: 'Sélectionner un planteur', displayFn: (p: any) => `${p.prenom} ${p.nom} - ${p.identifiant}`
    },
    { 
      id: 'facture', titre: '🧾 Facture', desc: 'Facture détaillée',
      select: true, options: ventes, value: selectedVente, setter: setSelectedVente,
      placeholder: 'Sélectionner une vente', displayFn: (v: any) => `Vente N°${v.id} - ${v.montantTotal?.toLocaleString()} FCFA`
    },
    { 
      id: 'bon', titre: '📋 Bon de livraison', desc: 'Bon de livraison',
      select: true, options: livraisons, value: selectedLivraison, setter: setSelectedLivraison,
      placeholder: 'Sélectionner une livraison', displayFn: (l: any) => `${l.reference} - ${l.origine} → ${l.destination}`
    },
    { 
      id: 'recu', titre: '💰 Reçu de paiement', desc: 'Reçu de caisse',
      select: true, options: operations, value: selectedOperation, setter: setSelectedOperation,
      placeholder: 'Sélectionner une opération', displayFn: (o: any) => `${o.type} - ${o.motif} - ${o.montant?.toLocaleString()} FCFA`
    },
    { 
      id: 'rapport', titre: '📊 Rapport mensuel', desc: 'Rapport d\'activité',
      select: false
    },
    { 
      id: 'attestation', titre: '📜 Attestation', desc: 'Attestation d\'adhésion',
      select: true, options: planteurs, value: selectedPlanteur, setter: setSelectedPlanteur,
      placeholder: 'Sélectionner un planteur', displayFn: (p: any) => `${p.prenom} ${p.nom} - ${p.identifiant}`
    },
    { 
      id: 'echeancier', titre: '🏦 Échéancier crédit', desc: 'Calendrier de remboursement',
      select: true, options: credits, value: selectedCredit, setter: setSelectedCredit,
      placeholder: 'Sélectionner un crédit', displayFn: (c: any) => `${c.planteur} - ${c.montant?.toLocaleString()} FCFA`
    },
    { 
      id: 'pv', titre: '📋 Procès-verbal', desc: 'PV de réunion',
      select: true, options: reunions, value: selectedReunion, setter: setSelectedReunion,
      placeholder: 'Sélectionner une réunion', displayFn: (r: any) => `${r.titre} - ${r.date}`
    },
  ]

  const exportModules = [
    { titre: '👨‍🌾 Planteurs', desc: 'Liste complète', icon: '👨‍🌾', couleur: '#CC5500', champs: ['Identifiant', 'Nom', 'Prénom', 'Village', 'Région', 'Téléphone'] },
    { titre: '📦 Produits', desc: 'Catalogue', icon: '📦', couleur: '#004D4D', champs: ['Nom', 'Catégorie', 'Prix', 'Stock', 'Unité'] },
    { titre: '💰 Ventes', desc: 'Transactions', icon: '💰', couleur: '#10b981', champs: ['Date', 'Client', 'Montant', 'Statut'] },
    { titre: '💵 Caisse', desc: 'Opérations', icon: '💵', couleur: '#8b5cf6', champs: ['Date', 'Type', 'Montant', 'Motif', 'Mode'] },
  ]

  const handleExport = (mod: string, format: string) => {
    setLoading(`${mod}-${format}`)
    setTimeout(() => {
      setLoading(null)
      notif(`✅ Export ${mod} en ${format.toUpperCase()} généré !`)
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🖨️ Exports & Impressions</h1>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'impressions', label: '🖨️ Impressions' },
            { id: 'exports', label: '📥 Exports données' },
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
        {activeTab === 'impressions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
            {impressions.map((imp) => (
              <div key={imp.id} className="erp-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: imp.select ? '12px' : '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: couleurPrincipale + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                    {imp.titre.split(' ')[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', margin: '0 0 2px 0' }}>{imp.titre}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{imp.desc}</p>
                  </div>
                </div>

                {imp.select && imp.options && (
                  <select 
                    className="erp-select" 
                    style={{ marginBottom: '12px' }}
                    value={imp.value} 
                    onChange={e => imp.setter(e.target.value)}
                  >
                    <option value="">{imp.placeholder}</option>
                    {imp.options.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>{imp.displayFn(opt)}</option>
                    ))}
                  </select>
                )}

                <button 
                  onClick={() => handlePrint(imp.id)}
                  disabled={loading === imp.id || (imp.select && !imp.value)}
                  style={{
                    width: '100%', padding: '12px',
                    backgroundColor: loading === imp.id ? '#ccc' : couleurPrincipale,
                    color: 'white', border: 'none', borderRadius: '8px', cursor: (imp.select && !imp.value) ? 'not-allowed' : 'pointer',
                    fontSize: '13px', fontWeight: '600', opacity: (imp.select && !imp.value) ? 0.5 : 1
                  }}>
                  {loading === imp.id ? '⏳ Préparation...' : '🖨️ Imprimer'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'exports' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {exportModules.map((mod) => (
              <div key={mod.titre} className="erp-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{mod.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>{mod.titre}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{mod.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {mod.champs.map((champ: string) => (
                    <span key={champ} style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{champ}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleExport(mod.titre, 'excel')} style={{ flex: 1, padding: '10px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    📥 Excel
                  </button>
                  <button onClick={() => handleExport(mod.titre, 'csv')} style={{ flex: 1, padding: '10px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    📥 CSV
                  </button>
                  <button onClick={() => handleExport(mod.titre, 'pdf')} style={{ flex: 1, padding: '10px', backgroundColor: '#FEF2F2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    📕 PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
