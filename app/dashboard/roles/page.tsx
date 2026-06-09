'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MODULES, PREDEFINED_ROLES, getUserPermissions, hasPermission } from '../lib/permissions'

export default function RolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [notification, setNotification] = useState('')
  const [formData, setFormData] = useState({ nom: '', description: '', permissions: [] as string[] })
  const [userPermissions, setUserPermissions] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    setUserPermissions(getUserPermissions())
    
    // Charger les rôles existants
    const savedRoles = localStorage.getItem('customRoles')
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles))
    } else {
      setRoles(PREDEFINED_ROLES.map((r, i) => ({ ...r, id: i + 1 })))
    }
  }, [])

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const togglePermission = (permCode: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permCode)
        ? prev.permissions.filter(p => p !== permCode)
        : [...prev.permissions, permCode]
    }))
  }

  const toggleAllModule = (moduleKey: string) => {
    const modulePerms = ['view', 'create', 'edit', 'delete'].map(p => `${moduleKey}:${p}`)
    const allSelected = modulePerms.every(p => formData.permissions.includes(p))
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !modulePerms.includes(p))
        : [...new Set([...prev.permissions, ...modulePerms])]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRole = {
      id: editingRole ? editingRole.id : Date.now(),
      nom: formData.nom,
      description: formData.description,
      permissions: formData.permissions
    }
    
    let updatedRoles: any[]
    if (editingRole) {
      updatedRoles = roles.map(r => r.id === editingRole.id ? newRole : r)
    } else {
      updatedRoles = [...roles, newRole]
    }
    
    setRoles(updatedRoles)
    localStorage.setItem('customRoles', JSON.stringify(updatedRoles))
    showNotif(editingRole ? '✅ Rôle modifié !' : '✅ Rôle créé !')
    setShowForm(false)
    setEditingRole(null)
    setFormData({ nom: '', description: '', permissions: [] })
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setFormData({ nom: role.nom, description: role.description || '', permissions: role.permissions })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Supprimer ce rôle ?')) return
    const updated = roles.filter(r => r.id !== id)
    setRoles(updated)
    localStorage.setItem('customRoles', JSON.stringify(updated))
    showNotif('🗑️ Rôle supprimé !')
  }

  // Vérifier si l'utilisateur a la permission de gérer les rôles
  if (!hasPermission(userPermissions, 'roles', 'view')) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="erp-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#1a1a1a', marginBottom: '8px' }}>Accès refusé</h2>
          <p style={{ color: '#999' }}>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
          <button className="erp-btn-primary" style={{ marginTop: '20px' }} onClick={() => router.push('/dashboard')}>
            ← Retour au dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div className="erp-notification">{notification}</div>}
      
      <div className="erp-page-header">
        <div className="erp-page-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/dashboard')} className="erp-btn-ghost">←</button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>🔐 Rôles & Permissions</h1>
            <span style={{ color: '#999', fontSize: '13px' }}>({roles.length} rôles)</span>
          </div>
          {hasPermission(userPermissions, 'roles', 'create') && (
            <button className="erp-btn-primary" onClick={() => { setShowForm(!showForm); setEditingRole(null); setFormData({ nom: '', description: '', permissions: [] }) }}>
              {showForm ? '✕ Annuler' : '+ Nouveau Rôle'}
            </button>
          )}
        </div>
      </div>

      <div className="erp-page-content">
        {/* Formulaire */}
        {showForm && (
          <div className="erp-card" style={{ marginBottom: '24px', animation: 'slideInUp 0.3s ease' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#CC5500', marginBottom: '20px' }}>
              {editingRole ? '✏️ Modifier le rôle' : '➕ Nouveau rôle'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Nom du rôle *</label>
                  <input className="erp-input" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Ex: Agent de terrain" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Description</label>
                  <input className="erp-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description du rôle" />
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>Permissions par module</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {Object.values(MODULES).map(mod => (
                  <div key={mod.key} style={{ backgroundColor: '#FAFAFA', borderRadius: '10px', padding: '14px', border: '1px solid #E8E8E8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a' }}>
                        {mod.icon} {mod.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAllModule(mod.key)}
                        style={{
                          padding: '3px 10px', fontSize: '10px', fontWeight: '600',
                          backgroundColor: '#FFF5F0', color: '#CC5500',
                          border: '1px solid rgba(204,85,0,0.2)', borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Tout sélectionner
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {mod.permissions.map(perm => {
                        const permCode = `${mod.key}:${perm}`
                        const isSelected = formData.permissions.includes(permCode)
                        return (
                          <button
                            key={perm}
                            type="button"
                            onClick={() => togglePermission(permCode)}
                            style={{
                              padding: '5px 12px', fontSize: '11px', fontWeight: '600',
                              backgroundColor: isSelected ? '#CC5500' : 'white',
                              color: isSelected ? 'white' : '#666',
                              border: isSelected ? '1px solid #CC5500' : '1px solid #E8E8E8',
                              borderRadius: '6px', cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {perm === 'view' ? '👁️ Voir' : 
                             perm === 'create' ? '➕ Créer' :
                             perm === 'edit' ? '✏️ Modifier' : '🗑️ Supprimer'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="erp-btn-primary">
                  {editingRole ? '💾 Mettre à jour' : '💾 Créer le rôle'}
                </button>
                <button type="button" className="erp-btn-secondary" onClick={() => { setShowForm(false); setEditingRole(null) }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des rôles */}
        <div className="erp-grid-3">
          {roles.map(role => (
            <div key={role.id} className="erp-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>🔐 {role.nom}</h3>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{role.description}</p>
                </div>
                <span className="erp-badge erp-badge-primary" style={{ fontSize: '11px' }}>
                  {role.permissions.includes('all') ? 'Tous' : role.permissions.length + ' droits'}
                </span>
              </div>
              
              <div style={{ marginBottom: '16px', maxHeight: '120px', overflowY: 'auto' }}>
                {role.permissions.includes('all') ? (
                  <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>✅ Accès complet à tous les modules</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {[...new Set(role.permissions.map((p: string) => p.split(':')[0]))].map((modKey: string) => {
                      const mod = MODULES[modKey as keyof typeof MODULES]
                      return mod ? (
                        <span key={modKey} style={{
                          padding: '3px 8px', fontSize: '10px', fontWeight: '500',
                          backgroundColor: '#F0F7F7', color: '#004D4D',
                          borderRadius: '4px'
                        }}>
                          {mod.icon} {mod.label}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F0F0F0', paddingTop: '12px' }}>
                <button onClick={() => handleEdit(role)} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(role.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
