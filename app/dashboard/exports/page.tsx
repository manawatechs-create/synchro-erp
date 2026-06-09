'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'
import { imprimerCarteProducteur, imprimerFacture, imprimerRecu, imprimerBonLivraison, imprimerEcheancier, imprimerPV, imprimerRapport, imprimerAttestation } from '../../services/printService'

export default function ExportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('impressions')
  const [notification, setNotification] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [ventes, setVentes] = useState<any[]>([])
  const [operations, setOperations] = useState<any[]>([])
  const [livraisons, setLivraisons] = useState<any[]>([])
  const [credits, setCredits] = useState<any[]>([])
  const [reunions, setReunions] = useState<any[]>([])
  const [selPlanteur, setSelPlanteur] = useState('')
  const [selVente, setSelVente] = useState('')
  const [selOperation, setSelOperation] = useState('')
  const [selLivraison, setSelLivraison] = useState('')
  const [selCredit, setSelCredit] = useState('')
  const [selReunion, setSelReunion] = useState('')

  useEffect(() => { 
    dataService.init()
    setPlanteurs(dataService.getPlanteurs()); setVentes(dataService.getVentes())
    setOperations(dataService.getOperations()); setLivraisons(dataService.getLivraisons())
    setCredits(dataService.getCredits()); setReunions(dataService.getReunions())
  }, [])

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const handlePrint = (type: string) => {
    setLoading(type)
    setTimeout(() => {
      setLoading(null)
      try {
        const p = planteurs.find(x => x.id.toString() === selPlanteur)
        const v = ventes.find(x => x.id.toString() === selVente)
        const o = operations.find(x => x.id.toString() === selOperation)
        const l = livraisons.find(x => x.id.toString() === selLivraison)
        const c = credits.find(x => x.id.toString() === selCredit)
        const r = reunions.find(x => x.id.toString() === selReunion)
        
        switch(type) {
          case 'carte': if(p) imprimerCarteProducteur(p); else showNotif('⚠️ Sélectionnez un producteur'); return
          case 'facture': if(v) imprimerFacture(v); else showNotif('⚠️ Sélectionnez une vente'); return
          case 'recu': if(o) imprimerRecu(o); else showNotif('⚠️ Sélectionnez une opération'); return
          case 'bon': if(l) imprimerBonLivraison(l); else showNotif('⚠️ Sélectionnez une livraison'); return
          case 'echeancier': if(c) imprimerEcheancier(c); else showNotif('⚠️ Sélectionnez un crédit'); return
          case 'pv': if(r) imprimerPV(r); else showNotif('⚠️ Sélectionnez une réunion'); return
          case 'rapport': imprimerRapport(dataService.getStats()); break
          case 'attestation': if(p) imprimerAttestation(p); else showNotif('⚠️ Sélectionnez un producteur'); return
        }
        showNotif(`🖨️ Document imprimé !`)
      } catch(e) { showNotif('❌ Erreur lors de l\'impression') }
    }, 500)
  }

  const handleExport = (mod: string, format: string) => {
    setLoading(`${mod}-${format}`)
    setTimeout(() => { setLoading(null); showNotif(`✅ ${mod} exporté en ${format.toUpperCase()} !`) }, 1000)
  }

  const impressions = [
    { id: 'carte', titre: '🪪 Carte producteur', desc: 'Fiche d\'identité', options: planteurs, value: selPlanteur, setter: setSelPlanteur, placeholder: 'Sélectionner un producteur', display: (x: any) => `${x.prenom} ${x.nom} - ${x.identifiant}` },
    { id: 'facture', titre: '🧾 Facture', desc: 'Facture détaillée', options: ventes, value: selVente, setter: setSelVente, placeholder: 'Sélectionner une vente', display: (x: any) => `Vente N°${x.id} - ${x.montantTotal?.toLocaleString()} FCFA` },
    { id: 'recu', titre: '💰 Reçu de paiement', desc: 'Reçu de caisse', options: operations, value: selOperation, setter: setSelOperation, placeholder: 'Sélectionner une opération', display: (x: any) => `${x.type} - ${x.motif} - ${x.montant?.toLocaleString()} FCFA` },
    { id: 'bon', titre: '📋 Bon de livraison', desc: 'Bon de livraison', options: livraisons, value: selLivraison, setter: setSelLivraison, placeholder: 'Sélectionner une livraison', display: (x: any) => `${x.reference} - ${x.origine}→${x.destination}` },
    { id: 'echeancier', titre: '🏦 Échéancier crédit', desc: 'Calendrier', options: credits, value: selCredit, setter: setSelCredit, placeholder: 'Sélectionner un crédit', display: (x: any) => `${x.planteur} - ${x.montant?.toLocaleString()} FCFA` },
    { id: 'pv', titre: '📋 Procès-verbal', desc: 'PV de réunion', options: reunions, value: selReunion, setter: setSelReunion, placeholder: 'Sélectionner une réunion', display: (x: any) => `${x.titre} - ${x.date}` },
    { id: 'rapport', titre: '📊 Rapport mensuel', desc: 'Statistiques', options: null as any, value: '', setter: () => {}, placeholder: '', display: () => '' },
    { id: 'attestation', titre: '📜 Attestation', desc: 'Adhésion', options: planteurs, value: selPlanteur, setter: setSelPlanteur, placeholder: 'Sélectionner un producteur', display: (x: any) => `${x.prenom} ${x.nom}` },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>🖨️ Exports & Impressions</h1>
      </div>
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: 4 }}>
        {[{ id: 'impressions', label: '🖨️ Impressions' }, { id: 'exports', label: '📥 Exports' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? '#CC5500' : '#666', borderBottom: activeTab === tab.id ? '3px solid #CC5500' : '3px solid transparent' }}>{tab.label}</button>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {activeTab === 'impressions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14 }}>
            {impressions.map(imp => (
              <div key={imp.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: imp.options ? 12 : 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{imp.titre.split(' ')[0]}</div>
                  <div><h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{imp.titre}</h4><p style={{ fontSize: 11, color: '#999', margin: 0 }}>{imp.desc}</p></div>
                </div>
                {imp.options && (
                  <select value={imp.value} onChange={e => imp.setter(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}>
                    <option value="">{imp.placeholder}</option>
                    {imp.options.map((opt: any) => <option key={opt.id} value={opt.id}>{imp.display(opt)}</option>)}
                  </select>
                )}
                <button onClick={() => handlePrint(imp.id)} disabled={loading === imp.id || (imp.options && !imp.value)}
                  style={{ width: '100%', padding: 12, background: (imp.options && !imp.value) ? '#ccc' : '#CC5500', color: 'white', border: 'none', borderRadius: 8, cursor: (imp.options && !imp.value) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: (imp.options && !imp.value) ? 0.5 : 1 }}>
                  {loading === imp.id ? '⏳ Préparation...' : '🖨️ Imprimer'}
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'exports' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {[{ titre: '👨‍🌾 Producteurs', icon: '👨‍🌾' }, { titre: '📦 Produits', icon: '📦' }, { titre: '💰 Ventes', icon: '💰' }, { titre: '💵 Caisse', icon: '💵' }].map(mod => (
              <div key={mod.titre} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}><span style={{ fontSize: 28 }}>{mod.icon}</span><h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{mod.titre}</h4></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleExport(mod.titre, 'excel')} style={{ flex: 1, padding: 10, background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>📥 Excel</button>
                  <button onClick={() => handleExport(mod.titre, 'csv')} style={{ flex: 1, padding: 10, background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>📥 CSV</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
