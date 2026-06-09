'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../services/dataService'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({ totalPlanteurs: 0, totalProduits: 0, ventesMois: 0, soldeCaisse: 0 })

  useEffect(() => {
    const d = localStorage.getItem('user'); if (d) setUser(JSON.parse(d))
    dataService.init(); setStats(dataService.getStats())
  }, [])

  const modules = [
    { icon: '👨‍🌾', label: 'Producteurs', path: '/dashboard/planteurs', color: '#CC5500', bg: '#FFF5F0' },
    { icon: '📦', label: 'Produits', path: '/dashboard/produits', color: '#004D4D', bg: '#F0F7F7' },
    { icon: '💰', label: 'Ventes', path: '/dashboard/ventes', color: '#10b981', bg: '#ECFDF5' },
    { icon: '🛒', label: 'Achats', path: '/dashboard/achats', color: '#f59e0b', bg: '#FFFBEB' },
    { icon: '💵', label: 'Caisse', path: '/dashboard/caisse', color: '#8b5cf6', bg: '#F5F3FF' },
    { icon: '🧾', label: 'Factures', path: '/dashboard/factures', color: '#ef4444', bg: '#FEF2F2' },
    { icon: '💳', label: 'Comptabilité', path: '/dashboard/accounting', color: '#06b6d4', bg: '#ECFEFF' },
    { icon: '🏦', label: 'Crédits', path: '/dashboard/credits', color: '#eab308', bg: '#FEFCE8' },
    { icon: '🌾', label: 'Campagnes', path: '/dashboard/campagnes', color: '#22c55e', bg: '#F0FDF4' },
    { icon: '🚚', label: 'Logistique', path: '/dashboard/logistique', color: '#f97316', bg: '#FFF7ED' },
    { icon: '📈', label: 'Analytics', path: '/dashboard/analytics', color: '#6366f1', bg: '#EEF2FF' },
    { icon: '📋', label: 'Réunions', path: '/dashboard/reunions', color: '#3b82f6', bg: '#EFF6FF' },
  ]

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* En-tête */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '24px 28px',
        marginBottom: '24px', border: '1px solid #E8E8E8', borderLeft: '4px solid #CC5500'
      }}>
        <p style={{ fontSize: '11px', color: '#CC5500', fontWeight: '600', letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase' }}>
          Synchro ERP • Construit par Manawa Techs © 2026
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
          👋 Bonjour, {user?.prenom || 'Utilisateur'} !
        </h1>
        <p style={{ color: '#999', margin: '4px 0 0', fontSize: '13px' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Producteurs', value: stats.totalPlanteurs, icon: '👨‍🌾', color: '#CC5500', bg: '#FFF5F0' },
          { label: 'Produits', value: stats.totalProduits, icon: '📦', color: '#004D4D', bg: '#F0F7F7' },
          { label: 'Ventes du mois', value: `${(stats.ventesMois || 0).toLocaleString()} FCFA`, icon: '💰', color: '#10b981', bg: '#ECFDF5' },
          { label: 'Solde Caisse', value: `${(stats.soldeCaisse || 0).toLocaleString()} FCFA`, icon: '💵', color: '#006666', bg: '#F5FAFA' },
        ].map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '10px',
            border: '1px solid #E8E8E8', borderLeft: `4px solid ${kpi.color}`,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>{kpi.icon}</div>
            <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: kpi.color, margin: '2px 0 0' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Modules
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        {modules.map((m, i) => (
          <button key={i} onClick={() => router.push(m.path)} style={{
            padding: '16px 12px', backgroundColor: m.bg,
            border: `1px solid ${m.color}20`, borderRadius: '10px',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 15px ${m.color}10` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{m.icon}</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>{m.label}</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px', borderTop: '1px solid #E8E8E8' }}>
        <p style={{ color: '#CCC', fontSize: '11px', margin: '0 0 4px' }}>© 2026 Synchro ERP • Tous droits réservés</p>
        <p style={{ color: '#CC5500', fontSize: '11px', fontWeight: '600', margin: 0 }}>Construit par <strong>Manawa Techs</strong></p>
      </div>
    </div>
  )
}
