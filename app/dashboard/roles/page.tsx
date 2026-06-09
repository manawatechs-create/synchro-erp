'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function RolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [form, setForm] = useState({ nom: '', description: '', permissions: [] as string[] })

  const modules = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'planteurs', label: 'Producteurs', icon: '👨‍🌾' },
    { key: 'produits', label: 'Produits', icon: '📦' },
    { key: 'ventes', label: 'Ventes', icon: '💰' },
    { key: 'achats', label: 'Achats', icon: '🛒' },
    { key: 'caisse', label: 'Caisse', icon: '💵' },
    { key: 'factures', label: 'Factures', icon: '🧾' },
    { key: 'accounting', label: 'Comptabilité', icon: '💳' },
    { key: 'credits', label: 'Crédits', icon: '🏦' },
    { key: 'campagnes', label: 'Campagnes', icon: '🌾' },
    { key: 'logistique', label: 'Logistique', icon: '🚚' },
    { key: 'reunions', label: 'Réunions', icon: '📋' },
    { key: 'certifications', label: 'Certifications', icon: '📜' },
    { key: 'mutuelle', label: 'Mutuelle', icon: '🏥' },
    { key: 'loyalty', label: 'Fidélité', icon: '🏆' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
    { key: 'roles', label: 'Rôles', icon: '🔑' },
    { key: 'parametres', label: 'Paramètres', icon: '⚙️' },
    { key: 'exports', label: 'Exports', icon: '🖨️' },
  ]

  const permissionsList = [
    { key: 'view', label: '👁️ Voir', color: '#3b82f6' },
    { key: 'create', label: '➕ Créer', color: '#10b981' },
    { key: 'edit', label: '✏️ Modifier', color: '#f59e0b' },
    { key: 'delete', label: '🗑️ Supprimer', color: '#ef4444' },
  ]

  useEffect(() => { 
    dataService.init()
    chargerRoles()
  }, [])
  
  const chargerRoles = () => {
    const r = dataService.getAll('data_roles')
    if (r.length === 0) {
      const init = [
        { id: 1, nom: 'Administrateur', description: 'Accès complet à tous les modules', permissions: ['all'] },
        { id: 2, nom: 'Gestionnaire', description: 'Gestion quotidienne des opérations', permissions: ['dashboard:view','planteurs:all','produits:all','ventes:all','achats:all','caisse:all','factures:all','accounting:view','credits:view','campagnes:all','logistique:all','reunions:all','certifications:view','mutuelle:view','loyalty:view','analytics:view'] },
        { id: 3, nom: 'Comptable', description: 'Gestion financière et comptable', permissions: ['dashboard:view','caisse:all','factures:all','accounting:all','credits:view','analytics:view'] },
        { id: 4, nom: 'Agent de terrain', description: 'Saisie des données terrain', permissions: ['dashboard:view','planteurs:create','planteurs:edit','planteurs:view','produits:view','ventes:create','ventes:view','achats:create','achats:view','campagnes:create','campagnes:edit','campagnes:view'] },
        { id: 5, nom: 'Membre simple', description: 'Consultation uniquement', permissions: ['dashboard:view','planteurs:view','produits:view','ventes:view','achats:view'] },
      ]
      localStorage.setItem('data_roles', JSON.stringify(init))
      setRoles(init)
    } else { setRoles(r) }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const togglePermission = (permCode: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permCode) 
        ? prev.permissions.filter(p => p !== permCode)
        : [...prev.permissions, permCode]
    }))
  }

  const toggleAllModule = (moduleKey: string) => {
    const modulePerms = permissionsList.map(p => `${moduleKey}:${p.key}`)
    const allSelected = modulePerms.every(p => form.permissions.includes(p))
    setForm(prev => ({
      ...prev,
      permissions: allSelected 
        ? prev.permissions.filter(p => !modulePerms.includes(p))
        : [...new Set([...prev.permissions, ...modulePerms])]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom) { showNotif('⚠️ Le nom est obligatoire'); return }
    
    const role = { ...form }
    if (editingId) {
      dataService.update('data_roles', editingId, role)
      showNotif('✅ Rôle modifié !')
    } else {
      dataService.create('data_roles', role)
      showNotif('✅ Rôle créé !')
    }
    setShowForm(false); setEditingId(null)
    setForm({ nom: '', description: '', permissions: [] }); chargerRoles()
  }

  const handleEdit = (r: any) => {
    setEditingId(r.id)
    setForm({ nom: r.nom || '', description: r.description || '', permissions: r.permissions || [] })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce rôle ?')) { dataService.delete('data_roles', id); chargerRoles(); showNotif('🗑️ Rôle supprimé !') }
  }

  const getModulePerms = (permissions: string[], moduleKey: string) => {
    if (permissions.includes('all')) return 'Tous'
    const count = permissionsList.filter(p => permissions.includes(`${moduleKey}:${p.key}`)).length
    return count > 0 ? `${count}/4` : '-'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>🔑 Rôles & Permissions</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({roles.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ nom: '', description: '', permissions: [] }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouveau Rôle'}
        </button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Formulaire */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#6366f1', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>{editingId ? '✏️ Modifier le rôle' : '➕ Nouveau Rôle'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Nom du rôle *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={is} /></div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Permissions par module</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {modules.map(mod => (
                  <div key={mod.key} style={{ padding: '12px', background: '#FAFAFA', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '12px' }}>{mod.icon} {mod.label}</span>
                      <button type="button" onClick={() => toggleAllModule(mod.key)} style={{ padding: '3px 10px', fontSize: '10px', fontWeight: '600', background: '#F5F3FF', color: '#6366f1', border: '1px solid #6366f130', borderRadius: '4px', cursor: 'pointer' }}>Tout</button>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {permissionsList.map(perm => {
                        const permCode = `${mod.key}:${perm.key}`
                        const isSelected = form.permissions.includes(permCode)
                        return (
                          <button key={perm.key} type="button" onClick={() => togglePermission(permCode)}
                            style={{ padding: '4px 10px', fontSize: '10px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer',
                              background: isSelected ? perm.color : 'white', color: isSelected ? 'white' : '#666',
                              border: isSelected ? `1px solid ${perm.color}` : '1px solid #E8E8E8', transition: 'all 0.15s' }}>
                            {perm.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Créer le rôle'}</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des rôles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '14px' }}>
          {roles.map(role => (
            <div key={role.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E8E8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>🔐 {role.nom}</h3>
                  <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{role.description}</p>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: '#F5F3FF', color: '#6366f1' }}>
                  {role.permissions?.includes('all') ? 'Tous les droits' : `${role.permissions?.length || 0} permissions`}
                </span>
              </div>

              {/* Résumé permissions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px', marginBottom: '14px', maxHeight: '150px', overflowY: 'auto' }}>
                {role.permissions?.includes('all') ? (
                  <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', gridColumn: '1/-1' }}>✅ Accès complet à tous les modules</p>
                ) : (
                  modules.map(mod => {
                    const count = getModulePerms(role.permissions, mod.key)
                    if (count === '-' || count === '0/4') return null
                    return (
                      <div key={mod.key} style={{ padding: '4px 8px', background: count === '4/4' || count === 'Tous' ? '#ECFDF5' : '#FFFBEB', borderRadius: '4px', fontSize: '10px' }}>
                        <span>{mod.icon}</span> <span style={{ fontWeight: '500' }}>{mod.label}</span>
                        <span style={{ color: '#999', marginLeft: '4px' }}>({count})</span>
                      </div>
                    )
                  })
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #F0F0F0', paddingTop: '12px' }}>
                <button onClick={() => handleEdit(role)} style={{ flex: 1, padding: '8px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✏️ Modifier</button>
                <button onClick={() => handleDelete(role.id)} style={{ flex: 1, padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ Supprimer</button>
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔑</div>
              <p>Aucun rôle défini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
