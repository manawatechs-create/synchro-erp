'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import logService from '../../services/logService'

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [filter, setFilter] = useState('tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { chargerLogs() }, [])
  const chargerLogs = () => {
    setLogs(logService.getLogs())
    setStats(logService.getStats())
  }

  const handleExport = () => {
    const csv = logService.exportLogs()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `logs-synchro-erp-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    showNotif('📥 Logs exportés en CSV !')
  }

  const handleClear = () => {
    if (confirm('⚠️ Supprimer tous les logs ?')) { logService.clearLogs(); chargerLogs(); showNotif('🗑️ Logs supprimés !') }
  }

  const filtered = logs.filter(l => {
    const match = `${l.utilisateur} ${l.module} ${l.element}`.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'tous') return match
    if (filter === 'create') return match && l.action === 'CREATE'
    if (filter === 'update') return match && l.action === 'UPDATE'
    if (filter === 'delete') return match && l.action === 'DELETE'
    if (filter === 'today') return match && l.timestamp.startsWith(new Date().toISOString().split('T')[0])
    return match
  })

  const genererLogsTest = () => {
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'READ']
    const modules = ['Producteurs', 'Produits', 'Ventes', 'Achats', 'Caisse', 'Crédits']
    const elements = ['Amadou Diallo', 'Tomates', 'Vente N°1', 'Achat engrais', 'Opération caisse', 'Crédit 250k']
    for (let i = 0; i < 20; i++) {
      logService.log(actions[Math.floor(Math.random()*actions.length)], modules[Math.floor(Math.random()*modules.length)], elements[Math.floor(Math.random()*elements.length)], 'Log de test')
    }
    chargerLogs(); showNotif('✅ 20 logs générés !')
  }

  const actionColors: Record<string, string> = { CREATE: '#10b981', UPDATE: '#f59e0b', DELETE: '#ef4444', READ: '#3b82f6' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>📝 Logs d'Activité</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({logs.length})</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={genererLogsTest} style={{ padding: '8px 14px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🧪 Générer logs test</button>
          <button onClick={handleExport} style={{ padding: '8px 14px', background: '#ECFDF5', color: '#10b981', border: '1px solid #10b98130', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>📥 Export CSV</button>
          <button onClick={handleClear} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #DC262630', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🗑️ Vider</button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Logs', value: stats.total || 0, icon: '📝', color: '#CC5500' },
            { label: 'Aujourd\'hui', value: stats.aujourdhui || 0, icon: '📅', color: '#004D4D' },
            { label: 'Créations', value: stats.creations || 0, icon: '➕', color: '#10b981' },
            { label: 'Modifications', value: stats.modifications || 0, icon: '✏️', color: '#f59e0b' },
            { label: 'Suppressions', value: stats.suppressions || 0, icon: '🗑️', color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '10px 14px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #E8E8E8', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer' }}>
            <option value="tous">📋 Tous</option><option value="today">📅 Aujourd'hui</option>
            <option value="create">➕ Créations</option><option value="update">✏️ Modifications</option><option value="delete">🗑️ Suppressions</option>
          </select>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#FAFAFA', borderBottom: '2px solid #E8E8E8' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#666' }}>Date/Heure</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#666' }}>Utilisateur</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#666' }}>Rôle</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#666' }}>Action</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#666' }}>Module</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#666' }}>Élément</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>Aucun log trouvé
                  <br /><button onClick={genererLogsTest} style={{ color: '#CC5500', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '8px' }}>🧪 Générer des logs de test</button>
                </td></tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '10px 14px', fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>{new Date(l.timestamp).toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '10px 14px', fontWeight: '600', fontSize: '12px' }}>{l.utilisateur}</td>
                    <td style={{ padding: '10px 14px', fontSize: '11px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', background: '#FFF5F0', color: '#CC5500' }}>{l.role}</span></td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: actionColors[l.action]+'15', color: actionColors[l.action] }}>{l.action === 'CREATE' ? '➕ Création' : l.action === 'UPDATE' ? '✏️ Modification' : l.action === 'DELETE' ? '🗑️ Suppression' : '👁️ Lecture'}</span></td>
                    <td style={{ padding: '10px 14px', fontSize: '12px' }}>{l.module}</td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', fontWeight: '500' }}>{l.element}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
