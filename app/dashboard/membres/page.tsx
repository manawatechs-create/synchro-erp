'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function MembresPage() {
  const router = useRouter()
  const [membres, setMembres] = useState<any[]>([])
  const [notification, setNotification] = useState('')
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  useEffect(() => { dataService.init(); chargerMembres() }, [])
  
  const chargerMembres = () => {
    const m = dataService.getAll('data_membres')
    if (m.length === 0) {
      const init = [
        { id: 1, nom: 'Admin', prenom: 'Principal', email: 'admin@coop.com', role: 'ADMIN', telephone: '+226 70 00 00 00', dateCreation: '2024-01-01' },
        { id: 2, nom: 'Gestionnaire', prenom: 'Coopérative', email: 'gestionnaire@coop.com', role: 'GESTIONNAIRE', telephone: '+226 70 00 00 01', dateCreation: '2024-01-01' },
        { id: 3, nom: 'Membre', prenom: 'Actif', email: 'membre@coop.com', role: 'MEMBRE', telephone: '+226 70 00 00 02', dateCreation: '2024-01-01' },
      ]
      localStorage.setItem('data_membres', JSON.stringify(init))
      setMembres(init)
    } else { setMembres(m) }
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cet utilisateur ?')) { dataService.delete('data_membres', id); chargerMembres(); showNotif('🗑️ Supprimé !') }
  }

  const roleColors: Record<string, string> = {
    ADMIN: '#CC5500', GESTIONNAIRE: '#004D4D', COMPTABLE: '#06b6d4', MEMBRE: '#10b981'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>👥 Utilisateurs</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({membres.length})</span>
        </div>
        <button onClick={() => router.push('/register')} style={{ padding: '8px 16px', background: '#CC5500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          ➕ Créer un utilisateur
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Utilisateur</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Email</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Téléphone</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Rôle</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Action</th></tr></thead>
            <tbody>
              {membres.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{m.prenom} {m.nom}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{m.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{m.telephone || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: (roleColors[m.role] || '#666') + '15', color: roleColors[m.role] || '#666' }}>{m.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(m.id)} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
