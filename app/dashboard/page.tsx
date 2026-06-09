'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
    { icon: 'users', label: 'Producteurs', path: '/dashboard/planteurs', color: '#CC5500', bg: '#FFF5F0' },
    { icon: 'box', label: 'Produits', path: '/dashboard/produits', color: '#004D4D', bg: '#F0F7F7' },
    { icon: 'cart', label: 'Ventes', path: '/dashboard/ventes', color: '#10b981', bg: '#ECFDF5' },
    { icon: 'truck', label: 'Achats', path: '/dashboard/achats', color: '#f59e0b', bg: '#FFFBEB' },
    { icon: 'wallet', label: 'Caisse', path: '/dashboard/caisse', color: '#8b5cf6', bg: '#F5F3FF' },
    { icon: 'file', label: 'Factures', path: '/dashboard/factures', color: '#ef4444', bg: '#FEF2F2' },
    { icon: 'calculator', label: 'Comptabilité', path: '/dashboard/accounting', color: '#06b6d4', bg: '#ECFEFF' },
    { icon: 'coins', label: 'Crédits', path: '/dashboard/credits', color: '#eab308', bg: '#FEFCE8' },
    { icon: 'leaf', label: 'Campagnes', path: '/dashboard/campagnes', color: '#22c55e', bg: '#F0FDF4' },
    { icon: 'map-pin', label: 'Logistique', path: '/dashboard/logistique', color: '#f97316', bg: '#FFF7ED' },
    { icon: 'chart', label: 'Analytics', path: '/dashboard/analytics', color: '#6366f1', bg: '#EEF2FF' },
    { icon: 'calendar', label: 'Réunions', path: '/dashboard/reunions', color: '#3b82f6', bg: '#EFF6FF' },
  ]

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #CC5500, #004D4D)', borderRadius: 16, padding: '28px 32px', color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'contain', backgroundColor: 'white', padding: 8 }} />
        <div>
          <p style={{ fontSize: 10, opacity: 0.8, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>Synchro ERP • Construit par Manawa Techs © 2026</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>👋 Bonjour, {user?.prenom || 'Utilisateur'} !</h1>
          <p style={{ opacity: 0.9, margin: 0, fontSize: 14 }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Producteurs', value: stats.totalPlanteurs, icon: 'users', color: '#CC5500', bg: '#FFF5F0' },
          { label: 'Produits', value: stats.totalProduits, icon: 'box', color: '#004D4D', bg: '#F0F7F7' },
          { label: 'Ventes du mois', value: `${(stats.ventesMois || 0).toLocaleString()} FCFA`, icon: 'cart', color: '#10b981', bg: '#ECFDF5' },
          { label: 'Solde Caisse', value: `${(stats.soldeCaisse || 0).toLocaleString()} FCFA`, icon: 'wallet', color: '#006666', bg: '#F5FAFA' },
        ].map((kpi, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, border: '1px solid #E8E8E8', borderLeft: `4px solid ${kpi.color}`, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <Image src={`/icons/${kpi.icon}.svg`} alt="" width={32} height={32} style={{ marginBottom: 12 }} />
            <p style={{ color: '#999', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: kpi.color, margin: '4px 0 0' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 4, height: 18, background: '#CC5500', borderRadius: 2 }}></span>Modules
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
        {modules.map((m, i) => (
          <button key={i} onClick={() => router.push(m.path)} style={{ padding: '16px 12px', backgroundColor: m.bg, border: `1px solid ${m.color}20`, borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${m.color}15` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <Image src={`/icons/${m.icon}.svg`} alt="" width={28} height={28} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{m.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
