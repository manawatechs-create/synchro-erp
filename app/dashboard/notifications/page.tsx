'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState('toutes')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { dataService.init(); chargerNotifications() }, [])
  
  const chargerNotifications = () => {
    const notifs = dataService.getAll('data_notifications')
    if (notifs.length === 0) {
      const init = [
        { id: 1, type: 'alerte', titre: '⚠️ Stock faible', message: 'Tomates : seulement 15 kg restants en stock', date: new Date(Date.now()-3600000).toISOString(), lu: false, lien: '/dashboard/produits' },
        { id: 2, type: 'succes', titre: '💰 Nouvelle vente', message: 'Vente de 150,000 FCFA enregistrée - Amadou Diallo', date: new Date(Date.now()-7200000).toISOString(), lu: false, lien: '/dashboard/ventes' },
        { id: 3, type: 'info', titre: '👨‍🌾 Nouveau producteur', message: 'Fatou Camara a rejoint la coopérative', date: new Date(Date.now()-86400000).toISOString(), lu: true, lien: '/dashboard/planteurs' },
        { id: 4, type: 'alerte', titre: '📜 Certification expirée', message: 'Rainforest Alliance - Moussa Traoré a expiré', date: new Date(Date.now()-172800000).toISOString(), lu: false, lien: '/dashboard/certifications' },
        { id: 5, type: 'rappel', titre: '📅 Réunion demain', message: 'Assemblée Générale à 10h au siège', date: new Date(Date.now()-259200000).toISOString(), lu: true, lien: '/dashboard/reunions' },
        { id: 6, type: 'succes', titre: '💳 Crédit remboursé', message: 'Ibrahim Koné a remboursé 25,000 FCFA', date: new Date(Date.now()-345600000).toISOString(), lu: true, lien: '/dashboard/credits' },
        { id: 7, type: 'alerte', titre: '⏳ Paiement en retard', message: 'Cotisation mutuelle - Aïcha Ouédraogo', date: new Date(Date.now()-432000000).toISOString(), lu: false, lien: '/dashboard/mutuelle' },
        { id: 8, type: 'info', titre: '🌾 Nouvelle campagne', message: 'Campagne 2024 - Saison pluvieuse lancée', date: new Date(Date.now()-518400000).toISOString(), lu: false, lien: '/dashboard/campagnes' },
        { id: 9, type: 'succes', titre: '🏆 Fidélité', message: 'Moussa Traoré a atteint le grade Diamant', date: new Date(Date.now()-604800000).toISOString(), lu: true, lien: '/dashboard/loyalty' },
        { id: 10, type: 'rappel', titre: '📋 PV à rédiger', message: 'Réunion du 10/05/2024 en attente de PV', date: new Date(Date.now()-691200000).toISOString(), lu: false, lien: '/dashboard/reunions' },
      ]
      localStorage.setItem('data_notifications', JSON.stringify(init))
      setNotifications(init)
    } else { setNotifications(notifs) }
  }

  const marquerLue = (id: number) => {
    const notifs = dataService.getAll('data_notifications')
    const index = notifs.findIndex((n: any) => n.id === id)
    if (index > -1) { notifs[index].lu = true; localStorage.setItem('data_notifications', JSON.stringify(notifs)); chargerNotifications() }
  }

  const marquerToutesLues = () => {
    const notifs = dataService.getAll('data_notifications')
    notifs.forEach((n: any) => n.lu = true)
    localStorage.setItem('data_notifications', JSON.stringify(notifs))
    chargerNotifications(); showNotif('✅ Toutes les notifications sont lues !')
  }

  const supprimer = (id: number) => {
    const notifs = dataService.getAll('data_notifications').filter((n: any) => n.id !== id)
    localStorage.setItem('data_notifications', JSON.stringify(notifs))
    chargerNotifications(); showNotif('🗑️ Notification supprimée !')
  }

  const supprimerToutes = () => {
    if (confirm('Supprimer toutes les notifications ?')) {
      localStorage.setItem('data_notifications', JSON.stringify([]))
      chargerNotifications(); showNotif('🗑️ Toutes les notifications supprimées !')
    }
  }

  const creerNotification = () => {
    const notifs = dataService.getAll('data_notifications')
    notifs.unshift({
      id: Date.now(), type: 'info', titre: '🔔 Notification manuelle',
      message: 'Ceci est une notification créée manuellement.', date: new Date().toISOString(), lu: false, lien: '/dashboard'
    })
    localStorage.setItem('data_notifications', JSON.stringify(notifs))
    chargerNotifications(); showNotif('✅ Notification créée !')
  }

  const typeInfo: any = {
    alerte: { icon: '⚠️', couleur: '#ef4444', bg: '#FEF2F2', label: 'Alerte' },
    succes: { icon: '✅', couleur: '#10b981', bg: '#ECFDF5', label: 'Succès' },
    info: { icon: 'ℹ️', couleur: '#3b82f6', bg: '#EFF6FF', label: 'Info' },
    rappel: { icon: '📅', couleur: '#f59e0b', bg: '#FFFBEB', label: 'Rappel' },
  }

  const nonLues = notifications.filter(n => !n.lu).length

  const filtered = notifications.filter(n => {
    const match = (n.titre || '').toLowerCase().includes(searchTerm.toLowerCase()) || (n.message || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'toutes') return match
    if (filter === 'non_lues') return match && !n.lu
    if (filter === 'lues') return match && n.lu
    return match && n.type === filter
  })

  const filters = [
    { id: 'toutes', label: '📋 Toutes', count: notifications.length },
    { id: 'non_lues', label: '🔴 Non lues', count: nonLues },
    { id: 'lues', label: '✅ Lues', count: notifications.length - nonLues },
    { id: 'alerte', label: '⚠️ Alertes', count: notifications.filter(n => n.type === 'alerte').length },
    { id: 'succes', label: '✅ Succès', count: notifications.filter(n => n.type === 'succes').length },
    { id: 'info', label: 'ℹ️ Infos', count: notifications.filter(n => n.type === 'info').length },
    { id: 'rappel', label: '📅 Rappels', count: notifications.filter(n => n.type === 'rappel').length },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🔔 Notifications</h1>
          {nonLues > 0 && <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#ef4444', color: 'white', fontSize: '12px', fontWeight: '700' }}>{nonLues} non lue{nonLues > 1 ? 's' : ''}</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={creerNotification} style={{ padding: '8px 14px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>➕ Créer</button>
          <button onClick={marquerToutesLues} style={{ padding: '8px 14px', background: '#ECFDF5', color: '#10b981', border: '1px solid #10b98130', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>✅ Tout lire</button>
          <button onClick={supprimerToutes} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #DC262630', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🗑️ Tout supprimer</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 14px', borderRadius: '20px', border: filter === f.id ? '2px solid #CC5500' : '1px solid #E8E8E8',
              background: filter === f.id ? '#FFF5F0' : 'white', color: filter === f.id ? '#CC5500' : '#666',
              cursor: 'pointer', fontSize: '12px', fontWeight: filter === f.id ? '600' : '400', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              {f.label} <span style={{ padding: '1px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', background: filter === f.id ? '#CC5500' : '#F0F0F0', color: filter === f.id ? 'white' : '#999' }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Recherche */}
        <input type="text" placeholder="🔍 Rechercher dans les notifications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        {/* Liste */}
        {filtered.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #E8E8E8' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <h3 style={{ color: '#1a1a1a', marginBottom: '8px' }}>Aucune notification</h3>
            <p style={{ color: '#999', fontSize: '13px' }}>{filter === 'toutes' ? 'Vous êtes à jour !' : 'Essayez un autre filtre.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(n => {
              const info = typeInfo[n.type] || { icon: '🔔', couleur: '#666', bg: '#FAFAFA', label: 'Autre' }
              const date = new Date(n.date)
              const diff = Date.now() - date.getTime()
              const heures = Math.floor(diff / 3600000)
              const jours = Math.floor(diff / 86400000)
              const temps = heures < 1 ? 'À l\'instant' : heures < 24 ? `Il y a ${heures}h` : jours < 7 ? `Il y a ${jours}j` : date.toLocaleDateString('fr-FR')

              return (
                <div key={n.id} onClick={() => { if (!n.lu) marquerLue(n.id); if (n.lien) router.push(n.lien) }}
                  style={{
                    backgroundColor: n.lu ? 'white' : info.bg,
                    border: `1px solid ${n.lu ? '#E8E8E8' : info.couleur + '30'}`,
                    borderLeft: n.lu ? '4px solid transparent' : `4px solid ${info.couleur}`,
                    borderRadius: '12px', padding: '16px 20px', cursor: n.lien ? 'pointer' : 'default',
                    opacity: n.lu ? 0.75 : 1, transition: 'all 0.2s',
                    display: 'flex', gap: '14px', alignItems: 'flex-start'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)' }}>
                  
                  {/* Icône */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: info.couleur + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{info.icon}</div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', background: info.couleur + '15', color: info.couleur, textTransform: 'uppercase' }}>{info.label}</span>
                        {!n.lu && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', background: '#CC5500', color: 'white' }}>NOUVEAU</span>}
                      </div>
                      <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>{temps}</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '6px 0 2px 0' }}>{n.titre}</h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: '1.4' }}>{n.message}</p>
                    {n.lien && <p style={{ fontSize: '11px', color: '#CC5500', margin: '4px 0 0', fontWeight: '500' }}>Cliquer pour voir →</p>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                    {!n.lu && (
                      <button onClick={e => { e.stopPropagation(); marquerLue(n.id) }} style={{ padding: '6px 10px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' }}>✓ Lu</button>
                    )}
                    <button onClick={e => { e.stopPropagation(); supprimer(n.id) }} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>✕</button>
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
