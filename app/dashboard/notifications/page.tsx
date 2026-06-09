'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'

export default function NotificationsPage() {
  const router = useRouter()
  const { couleurPrincipale, addNotification } = useApp()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState('toutes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des notifications
    const demoNotifications = [
      { id: 1, type: 'alerte', titre: 'Stock faible', message: 'Tomates : seulement 15 kg restants', date: new Date(Date.now() - 3600000).toISOString(), lu: false, lien: '/dashboard/produits' },
      { id: 2, type: 'succes', titre: 'Vente enregistrée', message: '150,000 FCFA - Amadou Diallo', date: new Date(Date.now() - 7200000).toISOString(), lu: false, lien: '/dashboard/ventes' },
      { id: 3, type: 'info', titre: 'Nouveau planteur', message: 'Fatou Camara a rejoint la coopérative', date: new Date(Date.now() - 86400000).toISOString(), lu: true, lien: '/dashboard/planteurs' },
      { id: 4, type: 'alerte', titre: 'Certification expirée', message: 'Rainforest Alliance - Moussa Traoré', date: new Date(Date.now() - 172800000).toISOString(), lu: false, lien: '/dashboard/certifications' },
      { id: 5, type: 'rappel', titre: 'Réunion demain', message: 'Assemblée Générale à 10h au siège', date: new Date(Date.now() - 259200000).toISOString(), lu: true, lien: '/dashboard/reunions' },
      { id: 6, type: 'succes', titre: 'Crédit remboursé', message: 'Ibrahim Koné a remboursé 25,000 FCFA', date: new Date(Date.now() - 345600000).toISOString(), lu: true, lien: '/dashboard/credits' },
      { id: 7, type: 'info', titre: 'Nouvelle campagne', message: 'Campagne 2024 - Saison pluvieuse lancée', date: new Date(Date.now() - 432000000).toISOString(), lu: false, lien: '/dashboard/campagnes' },
      { id: 8, type: 'alerte', titre: 'Paiement en retard', message: 'Cotisation mutuelle - Aïcha Ouédraogo', date: new Date(Date.now() - 518400000).toISOString(), lu: false, lien: '/dashboard/mutuelle' },
    ]
    
    setTimeout(() => {
      setNotifications(demoNotifications)
      setLoading(false)
    }, 500)
  }, [])

  const marquerLue = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  }

  const marquerToutesLues = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
    addNotification({ type: 'success', message: 'Toutes les notifications sont marquées comme lues' })
  }

  const supprimer = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const supprimerToutes = () => {
    setNotifications([])
    addNotification({ type: 'success', message: 'Toutes les notifications ont été supprimées' })
  }

  const filtered = filter === 'toutes' 
    ? notifications 
    : filter === 'non_lues' 
      ? notifications.filter(n => !n.lu)
      : notifications.filter(n => n.type === filter)

  const nonLues = notifications.filter(n => !n.lu).length

  const typeInfo: any = {
    alerte: { icon: '⚠️', couleur: '#ef4444', bg: '#FEF2F2', label: 'Alerte' },
    succes: { icon: '✅', couleur: '#10b981', bg: '#ECFDF5', label: 'Succès' },
    info: { icon: 'ℹ️', couleur: '#3b82f6', bg: '#EFF6FF', label: 'Info' },
    rappel: { icon: '📅', couleur: '#f59e0b', bg: '#FFFBEB', label: 'Rappel' },
  }

  const filters = [
    { id: 'toutes', label: 'Toutes', count: notifications.length },
    { id: 'non_lues', label: 'Non lues', count: nonLues },
    { id: 'alerte', label: '⚠️ Alertes', count: notifications.filter(n => n.type === 'alerte').length },
    { id: 'succes', label: '✅ Succès', count: notifications.filter(n => n.type === 'succes').length },
    { id: 'info', label: 'ℹ️ Infos', count: notifications.filter(n => n.type === 'info').length },
    { id: 'rappel', label: '📅 Rappels', count: notifications.filter(n => n.type === 'rappel').length },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>🔔 Centre de Notifications</h1>
            {nonLues > 0 && (
              <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: '#ef4444', color: 'white', fontSize: '12px', fontWeight: '700' }}>
                {nonLues} non lue{nonLues > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="erp-btn-secondary" onClick={marquerToutesLues} style={{ fontSize: '12px' }}>
              ✅ Tout marquer lu
            </button>
            <button className="erp-btn-danger" onClick={supprimerToutes} style={{ fontSize: '12px' }}>
              🗑️ Tout supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="erp-page-content">
        {/* Filtres rapides */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 16px', borderRadius: '20px', border: filter === f.id ? `2px solid ${couleurPrincipale}` : '1px solid var(--border)',
              backgroundColor: filter === f.id ? couleurPrincipale + '10' : 'var(--bg-card)',
              color: filter === f.id ? couleurPrincipale : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '12px', fontWeight: filter === f.id ? '600' : '400',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px'
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

        {/* Liste des notifications */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: couleurPrincipale, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
            Chargement des notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="erp-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
              {filter === 'toutes' ? 'Aucune notification' : 'Aucune notification pour ce filtre'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {filter === 'toutes' ? 'Vous êtes à jour ! Toutes les notifications ont été traitées.' : 'Essayez un autre filtre.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(notif => {
              const info = typeInfo[notif.type]
              const date = new Date(notif.date)
              const now = new Date()
              const diff = now.getTime() - date.getTime()
              const heures = Math.floor(diff / 3600000)
              const jours = Math.floor(diff / 86400000)
              const tempsRelatif = heures < 1 ? 'À l\'instant' 
                : heures < 24 ? `Il y a ${heures}h` 
                : jours < 7 ? `Il y a ${jours}j` 
                : date.toLocaleDateString('fr-FR')

              return (
                <div key={notif.id} onClick={() => { marquerLue(notif.id); if (notif.lien) router.push(notif.lien) }}
                  style={{
                    backgroundColor: notif.lu ? 'var(--bg-card)' : info.bg,
                    border: `1px solid ${notif.lu ? 'var(--border)' : info.couleur + '30'}`,
                    borderRadius: '12px', padding: '16px 20px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    borderLeft: notif.lu ? '4px solid transparent' : `4px solid ${info.couleur}`,
                    opacity: notif.lu ? 0.7 : 1,
                    display: 'flex', gap: '14px', alignItems: 'flex-start'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  {/* Icône type */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    backgroundColor: info.couleur + '15', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0
                  }}>
                    {info.icon}
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <span style={{
                          padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
                          fontWeight: '600', backgroundColor: info.couleur + '15',
                          color: info.couleur, textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                          {info.label}
                        </span>
                        {!notif.lu && (
                          <span style={{
                            marginLeft: '8px', padding: '2px 8px', borderRadius: '4px',
                            fontSize: '10px', fontWeight: '700', backgroundColor: couleurPrincipale,
                            color: 'white'
                          }}>
                            NOUVEAU
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {tempsRelatif}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: '6px 0 2px 0' }}>
                      {notif.titre}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                      {notif.message}
                    </p>
                    {notif.lien && (
                      <p style={{ fontSize: '11px', color: couleurPrincipale, margin: '6px 0 0', fontWeight: '500' }}>
                        Cliquer pour voir les détails →
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                    {!notif.lu && (
                      <button onClick={(e) => { e.stopPropagation(); marquerLue(notif.id) }}
                        style={{ padding: '6px 10px', backgroundColor: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                        ✓ Lu
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); supprimer(notif.id) }}
                      style={{ padding: '6px 10px', backgroundColor: '#FEF2F2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
