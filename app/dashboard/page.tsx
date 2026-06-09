'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../services/dataService'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const router = useRouter()
  const { couleurPrincipale } = useApp()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({
    totalPlanteurs: 0, totalProduits: 0, ventesMois: 0, achatsMois: 0,
    soldeCaisse: 0, creditsActifs: 0, campagnesEnCours: 0
  })
  const [loading, setLoading] = useState(true)
  const [operations, setOperations] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token || !userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    setTimeout(() => {
      setStats(dataService.getStats())
      setOperations(dataService.getOperations().slice(0, 5))
      setLoading(false)
    }, 400)
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #FFEDE5', borderTopColor: '#CC5500', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Chargement de Synchro ERP...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* En-tête */}
      <div style={{
        background: `linear-gradient(135deg, ${couleurPrincipale} 0%, #004D4D 100%)`,
        borderRadius: '18px', padding: '30px 36px', marginBottom: '28px', color: 'white',
        display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap'
      }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'contain', backgroundColor: 'white', padding: '8px' }} />
        <div>
          <p style={{ fontSize: '11px', opacity: 0.8, letterSpacing: '2.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Synchro ERP • Construit par Manawa Techs © 2026
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0' }}>
            👋 Bonjour, {user?.prenom} {user?.nom} !
          </h1>
          <p style={{ opacity: 0.9, margin: 0, fontSize: '15px' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="erp-grid-4" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Planteurs', value: stats.totalPlanteurs, icon: '👨‍🌾', color: '#CC5500', bg: '#FFF5F0', path: '/dashboard/planteurs' },
          { label: 'Produits', value: stats.totalProduits, icon: '📦', color: '#004D4D', bg: '#F0F7F7', path: '/dashboard/produits' },
          { label: 'Ventes du mois', value: `${(stats.ventesMois || 0).toLocaleString()} FCFA`, icon: '💰', color: '#10b981', bg: '#ECFDF5', path: '/dashboard/ventes' },
          { label: 'Solde Caisse', value: `${(stats.soldeCaisse || 0).toLocaleString()} FCFA`, icon: '💵', color: '#006666', bg: '#F5FAFA', path: '/dashboard/caisse' },
        ].map((kpi, i) => (
          <div key={i} className="erp-stat" style={{ borderLeftColor: kpi.color, cursor: 'pointer' }} onClick={() => router.push(kpi.path)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{kpi.icon}</div>
            </div>
            <p style={{ color: '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '12px 0 6px' }}>{kpi.label}</p>
            <p style={{ fontSize: '26px', fontWeight: '700', color: kpi.color, margin: 0 }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Actions rapides + Activité */}
      <div className="erp-grid-2">
        <div className="erp-card">
          <div className="erp-section-title">⚡ Actions Rapides</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { icon: '👨‍🌾', label: 'Nouveau Planteur', path: '/dashboard/planteurs' },
              { icon: '💰', label: 'Nouvelle Vente', path: '/dashboard/ventes' },
              { icon: '💵', label: 'Opération Caisse', path: '/dashboard/caisse' },
              { icon: '🌾', label: 'Campagne', path: '/dashboard/campagnes' },
              { icon: '🏦', label: 'Crédit', path: '/dashboard/credits' },
              { icon: '📋', label: 'Réunion', path: '/dashboard/reunions' },
            ].map((s, i) => (
              <button key={i} onClick={() => router.push(s.path)} style={{
                padding: '16px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)',
                borderRadius: '10px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: '500',
                color: 'var(--text)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = couleurPrincipale; e.currentTarget.style.backgroundColor = couleurPrincipale + '10' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-input)' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>{s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-section-title">💵 Dernières Opérations</div>
          {operations.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '40px', fontSize: '13px' }}>Aucune opération récente</p>
          ) : (
            operations.map((op: any) => (
              <div key={op.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{op.type === 'ENTREE' ? '💰' : '💸'}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>{op.motif}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{op.dateOperation} • {op.modePaiement}</p>
                  </div>
                </div>
                <span style={{ fontWeight: '700', fontSize: '14px', color: op.type === 'ENTREE' ? '#10b981' : '#ef4444' }}>
                  {op.type === 'ENTREE' ? '+' : '-'}{op.montant?.toLocaleString()} FCFA
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '36px', padding: '16px', borderTop: '1px solid var(--border)' }}>
        <p style={{ color: '#CCC', fontSize: '11px', margin: '0 0 4px 0' }}>
          © 2026 Synchro ERP • Tous droits réservés
        </p>
        <p style={{ color: '#CC5500', fontSize: '12px', fontWeight: '600', margin: 0 }}>
          Construit par <span style={{ fontWeight: '700' }}>Manawa Techs</span>
        </p>
      </div>
    </div>
  )
}
