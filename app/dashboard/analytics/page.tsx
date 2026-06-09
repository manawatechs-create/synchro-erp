'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function AnalyticsPage() {
  const router = useRouter()
  const [ventes, setVentes] = useState<any[]>([])
  const [achats, setAchats] = useState<any[]>([])
  const [operations, setOperations] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [period, setPeriod] = useState('2024')
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { 
    dataService.init()
    setVentes(dataService.getVentes())
    setAchats(dataService.getAchats())
    setOperations(dataService.getOperations())
    setPlanteurs(dataService.getPlanteurs())
    setProduits(dataService.getProduits())
  }, [])

  // Calculs
  const totalVentes = ventes.filter(v => v.statut === 'VALIDEE').reduce((s, v) => s + (v.montantTotal || 0), 0)
  const totalAchats = achats.filter(a => a.statut === 'VALIDEE').reduce((s, a) => s + (a.montantTotal || 0), 0)
  const solde = operations.reduce((s: number, o: any) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0)
  const benefice = totalVentes - totalAchats
  const nbVentes = ventes.length
  const nbPlanteurs = planteurs.length
  const nbProduits = produits.length

  // Données mensuelles simulées
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  const ventesMensuelles = mois.map(() => Math.floor(Math.random() * 500000) + 100000)
  const achatsMensuels = mois.map(() => Math.floor(Math.random() * 300000) + 50000)
  const maxVente = Math.max(...ventesMensuelles)

  // Top produits
  const topProduits = produits.slice(0, 5).map(p => ({
    nom: p.nom,
    ventes: Math.floor(Math.random() * 50) + 10,
    couleur: ['#CC5500', '#004D4D', '#10b981', '#f59e0b', '#8b5cf6'][produits.indexOf(p) % 5]
  })).sort((a, b) => b.ventes - a.ventes)

  // Répartition par type
  const repartition = [
    { label: 'Céréales', value: 35, color: '#CC5500' },
    { label: 'Légumes', value: 28, color: '#10b981' },
    { label: 'Fruits', value: 20, color: '#f59e0b' },
    { label: 'Tubercules', value: 12, color: '#8b5cf6' },
    { label: 'Autres', value: 5, color: '#3b82f6' },
  ]

  const imprimerRapport = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rapport Analytics - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px;text-align:center}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.kpi{background:#FAFAFA;border-radius:8px;padding:16px;text-align:center;border:1px solid #e8e8e8}
.kpi-value{font-size:20px;font-weight:700}.kpi-label{font-size:9px;color:#999;text-transform:uppercase}
table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#FFF5F0;padding:10px;text-align:left;font-size:10px;color:#CC5500;border:1px solid #e8e8e8}td{padding:10px;border:1px solid #e8e8e8}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>📈 Rapport Analytics</h2>
<div class="kpi-grid">
<div class="kpi"><p class="kpi-label">Ventes totales</p><p class="kpi-value" style="color:#10b981">${totalVentes.toLocaleString()} FCFA</p></div>
<div class="kpi"><p class="kpi-label">Achats totaux</p><p class="kpi-value" style="color:#ef4444">${totalAchats.toLocaleString()} FCFA</p></div>
<div class="kpi"><p class="kpi-label">Bénéfice</p><p class="kpi-value" style="color:${benefice>=0?'#10b981':'#ef4444'}">${benefice.toLocaleString()} FCFA</p></div>
<div class="kpi"><p class="kpi-label">Producteurs</p><p class="kpi-value" style="color:#CC5500">${nbPlanteurs}</p></div>
</div>
<h3>🏆 Top Produits</h3>
<table><thead><tr><th>Produit</th><th style="text-align:right">Ventes</th></tr></thead><tbody>${topProduits.map(p => `<tr><td>${p.nom}</td><td style="text-align:right;font-weight:600;color:${p.couleur}">${p.ventes}</td></tr>`).join('')}</tbody></table>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer le rapport</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>📈 Analytics</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            <option value="2024">2024</option><option value="2023">2023</option>
          </select>
          <button onClick={imprimerRapport} style={{ padding: '8px 16px', background: '#FFF5F0', color: '#CC5500', border: '1px solid #CC550030', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🖨️ Rapport</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Ventes Totales', value: `${totalVentes.toLocaleString()} FCFA`, icon: '💰', color: '#10b981', bg: '#ECFDF5' },
            { label: 'Achats Totaux', value: `${totalAchats.toLocaleString()} FCFA`, icon: '🛒', color: '#ef4444', bg: '#FEF2F2' },
            { label: 'Bénéfice Net', value: `${benefice.toLocaleString()} FCFA`, icon: '📈', color: benefice >= 0 ? '#10b981' : '#ef4444', bg: benefice >= 0 ? '#ECFDF5' : '#FEF2F2' },
            { label: 'Producteurs', value: nbPlanteurs, icon: '👨‍🌾', color: '#CC5500', bg: '#FFF5F0' },
          ].map((kpi, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${kpi.color}`, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{kpi.icon}</div>
              </div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '12px 0 4px' }}>{kpi.label}</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: kpi.color, margin: 0 }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* Graphique Ventes Mensuelles */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>📊 Ventes Mensuelles {period}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', paddingTop: '20px' }}>
              {ventesMensuelles.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '9px', color: '#999' }}>{val.toLocaleString()}</span>
                  <div style={{ 
                    width: '100%', maxWidth: '40px', 
                    height: `${(val / maxVente) * 150}px`,
                    background: `linear-gradient(180deg, #CC5500, #E8661A)`,
                    borderRadius: '4px 4px 0 0', opacity: 0.85, transition: 'height 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.85' }}
                  title={`${val.toLocaleString()} FCFA`}
                  ></div>
                  <span style={{ fontSize: '10px', color: '#999' }}>{mois[i]}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '11px', color: '#666' }}>
              <span>🟠 Ventes</span><span style={{ fontWeight: '600' }}>Total: {ventesMensuelles.reduce((a, b) => a + b, 0).toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Top Produits */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>🏆 Produits les plus vendus</h3>
            {topProduits.map((p, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ fontWeight: '500' }}>{p.nom}</span>
                  <span style={{ color: '#999', fontSize: '12px' }}>{p.ventes} ventes</span>
                </div>
                <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(p.ventes / topProduits[0].ventes) * 100}%`, 
                    height: '100%', background: p.couleur, borderRadius: '4px', transition: 'width 0.5s' 
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Répartition */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>🍩 Répartition par Catégorie</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {repartition.map((r, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: `conic-gradient(${r.color} ${r.value * 3.6}deg, #f0f0f0 0deg)`,
                    margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: r.color }}>
                      {r.value}%
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: '500' }}>{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>📋 Résumé d'Activité</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Ventes', value: nbVentes, icon: '💰', color: '#10b981' },
                { label: 'Produits en stock', value: nbProduits, icon: '📦', color: '#CC5500' },
                { label: 'Producteurs', value: nbPlanteurs, icon: '👨‍🌾', color: '#004D4D' },
                { label: 'Panier moyen', value: `${nbVentes > 0 ? Math.round(totalVentes / nbVentes).toLocaleString() : 0} FCFA`, icon: '🛒', color: '#8b5cf6' },
                { label: 'Marge bénéficiaire', value: `${totalVentes > 0 ? Math.round((benefice / totalVentes) * 100) : 0}%`, icon: '📈', color: benefice >= 0 ? '#10b981' : '#ef4444' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#FAFAFA', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
