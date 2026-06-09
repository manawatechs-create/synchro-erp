'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'

export default function CertificationsPage() {
  const router = useRouter()
  const [certifications, setCertifications] = useState<any[]>([])
  const [planteurs, setPlanteurs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [activeTab, setActiveTab] = useState('liste')
  const [form, setForm] = useState({
    planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: ''
  })

  useEffect(() => { 
    dataService.init()
    chargerCertifications()
    setPlanteurs(dataService.getPlanteurs())
  }, [])
  
  const chargerCertifications = () => {
    const cert = dataService.getAll('data_certifications')
    if (cert.length === 0) {
      const init = [
        { id: 1, planteur: 'Amadou Diallo', planteurId: 1, type: 'Bio', organisme: 'ECOCERT', dateObtention: '2024-03-15', dateExpiration: '2025-03-15', statut: 'Valide', document: 'certif-bio-001.pdf', notes: '' },
        { id: 2, planteur: 'Fatou Camara', planteurId: 2, type: 'Commerce Équitable', organisme: 'Fairtrade', dateObtention: '2024-01-20', dateExpiration: '2025-01-20', statut: 'Valide', document: 'fairtrade-002.pdf', notes: '' },
        { id: 3, planteur: 'Ibrahim Koné', planteurId: 3, type: 'GlobalGAP', organisme: 'SGS', dateObtention: '2024-05-10', dateExpiration: '2025-05-10', statut: 'Valide', document: 'globalgap-003.pdf', notes: '' },
        { id: 4, planteur: 'Aïcha Ouédraogo', planteurId: 4, type: 'Bio', organisme: 'ECOCERT', dateObtention: '2023-11-01', dateExpiration: '2024-11-01', statut: 'Expire bientôt', document: '', notes: 'Renouvellement en cours' },
        { id: 5, planteur: 'Moussa Traoré', planteurId: 5, type: 'Rainforest Alliance', organisme: 'UTZ', dateObtention: '2023-06-15', dateExpiration: '2024-06-15', statut: 'Expirée', document: '', notes: '' },
      ]
      localStorage.setItem('data_certifications', JSON.stringify(init))
      setCertifications(init)
    } else {
      setCertifications(cert)
    }
  }
  
  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const getStatutAuto = (dateExp: string) => {
    if (!dateExp) return 'Valide'
    const exp = new Date(dateExp)
    const now = new Date()
    const diff = exp.getTime() - now.getTime()
    const jours = diff / (1000 * 60 * 60 * 24)
    if (jours < 0) return 'Expirée'
    if (jours < 90) return 'Expire bientôt'
    return 'Valide'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const planteur = planteurs.find(p => p.id.toString() === form.planteurId)
    const certification = {
      ...form,
      planteur: planteur ? `${planteur.prenom} ${planteur.nom}` : 'Inconnu',
      planteurId: parseInt(form.planteurId),
      statut: getStatutAuto(form.dateExpiration)
    }

    if (editingId) {
      dataService.update('data_certifications', editingId, certification)
      showNotif('✅ Certification modifiée !')
    } else {
      dataService.create('data_certifications', certification)
      showNotif('✅ Certification ajoutée !')
    }
    setShowForm(false); setEditingId(null)
    setForm({ planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: '' })
    chargerCertifications()
  }

  const handleEdit = (c: any) => {
    setEditingId(c.id)
    setForm({
      planteurId: c.planteurId?.toString() || '', type: c.type || 'Bio', organisme: c.organisme || '',
      dateObtention: c.dateObtention || '', dateExpiration: c.dateExpiration || '', document: c.document || '', notes: c.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette certification ?')) { dataService.delete('data_certifications', id); chargerCertifications(); showNotif('🗑️ Supprimée !') }
  }

  const handleRenew = (id: number) => {
    const cert = certifications.find(c => c.id === id)
    if (cert) {
      const newExp = new Date(cert.dateExpiration)
      newExp.setFullYear(newExp.getFullYear() + 1)
      dataService.update('data_certifications', id, { dateExpiration: newExp.toISOString().split('T')[0], statut: 'Valide' })
      chargerCertifications(); showNotif('✅ Certification renouvelée !')
    }
  }

  const imprimerCertificat = (c: any) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificat - Synchro ERP</title>
<style>@page{size:A4;margin:15mm}*{margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
.header{border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between}
.header h1{font-size:20px}.header p{font-size:10px;color:#CC5500;font-style:italic}
h2{color:#CC5500;margin-bottom:16px;text-align:center}
.info-box{background:#FAFAFA;border:1px solid #e8e8e8;border-radius:8px;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.info-box p{margin:4px 0}
.footer{border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center}
.no-print{text-align:center;margin-top:24px}.no-print button{padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
<div class="header"><div><h1>Synchro ERP</h1><p>Plus qu'un ERP, un Partenaire</p></div><div style="text-align:right;font-size:11px;color:#666"><p>Coopérative Agricole</p><p>RCCM: BF-2024-001</p></div></div>
<h2>📜 ATTESTATION DE CERTIFICATION</h2>
<div class="info-box"><div><p><strong>Producteur:</strong> ${c.planteur}</p><p><strong>Type:</strong> ${c.type}</p></div><div><p><strong>Organisme:</strong> ${c.organisme}</p><p><strong>Statut:</strong> <span style="color:${c.statut==='Valide'?'#10b981':c.statut==='Expire bientôt'?'#f59e0b':'#ef4444'}">${c.statut}</span></p></div><div><p><strong>Obtention:</strong> ${c.dateObtention}</p><p><strong>Expiration:</strong> ${c.dateExpiration}</p></div></div>
<p style="margin-top:16px">Nous certifions que le producteur <strong>${c.planteur}</strong> est titulaire de la certification <strong>${c.type}</strong> délivrée par <strong>${c.organisme}</strong>.</p>
<div class="footer"><p>Synchro ERP - Plus qu'un ERP, un Partenaire</p><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p><p style="color:#CC5500;margin-top:4px">Construit par Manawa Techs © 2026</p></div>
<div class="no-print"><button onclick="window.print()">🖨️ Imprimer</button></div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  const filtered = certifications.filter(c => {
    const match = (c.planteur || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    if (filterType) return match && c.type === filterType
    return match
  })

  const types = ['Bio', 'Commerce Équitable', 'GlobalGAP', 'Rainforest Alliance', 'Label Rouge', 'AOP/IGP', 'Autre']
  const typeIcons: Record<string, string> = { 'Bio': '🌿', 'Commerce Équitable': '🤝', 'GlobalGAP': '🌍', 'Rainforest Alliance': '🌳', 'Label Rouge': '🔴', 'AOP/IGP': '🏅', 'Autre': '📜' }
  const valides = certifications.filter(c => c.statut === 'Valide').length
  const expireBientot = certifications.filter(c => c.statut === 'Expire bientôt').length
  const expirees = certifications.filter(c => c.statut === 'Expirée').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {notification && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#004D4D', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 15px rgba(0,77,77,0.3)' }}>{notification}</div>}
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>📜 Certifications</h1>
          <span style={{ color: '#999', fontSize: '13px' }}>({certifications.length})</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ planteurId: '', type: 'Bio', organisme: '', dateObtention: '', dateExpiration: '', document: '', notes: '' }) }} 
          style={{ padding: '8px 16px', background: showForm ? '#666' : '#06b6d4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {showForm ? '✕ Annuler' : '+ Nouvelle Certification'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E8E8', padding: '0 24px', display: 'flex', gap: '4px' }}>
        {[{ id: 'liste', label: '📋 Liste' }, { id: 'types', label: '🏷️ Types' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400', color: activeTab === tab.id ? '#06b6d4' : '#666', borderBottom: activeTab === tab.id ? '3px solid #06b6d4' : '3px solid transparent' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: certifications.length, icon: '📜', color: '#06b6d4' },
            { label: 'Valides', value: valides, icon: '✅', color: '#10b981' },
            { label: 'Expire bientôt', value: expireBientot, icon: '⚠️', color: '#f59e0b' },
            { label: 'Expirées', value: expirees, icon: '❌', color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #E8E8E8', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ color: '#999', fontSize: '11px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E8E8', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#06b6d4', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>{editingId ? '✏️ Modifier' : '➕ Nouvelle Certification'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Producteur *</label><select required value={form.planteurId} onChange={e => setForm({...form, planteurId: e.target.value})} style={{...is, background: 'white'}}><option value="">Sélectionner</option>{planteurs.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}</select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Type *</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{...is, background: 'white'}}>{types.map(t => <option key={t} value={t}>{typeIcons[t] || ''} {t}</option>)}</select></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Organisme *</label><input required value={form.organisme} onChange={e => setForm({...form, organisme: e.target.value})} placeholder="ECOCERT, Fairtrade..." style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date obtention *</label><input type="date" required value={form.dateObtention} onChange={e => setForm({...form, dateObtention: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Date expiration</label><input type="date" value={form.dateExpiration} onChange={e => setForm({...form, dateExpiration: e.target.value})} style={is} /></div>
                <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Document</label><input value={form.document} onChange={e => setForm({...form, document: e.target.value})} placeholder="Nom du fichier" style={is} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '10px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '3px' }}>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={is} /></div>
              <div style={{ display: 'flex', gap: '8px' }}><button type="submit" style={{ padding: '10px 20px', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>{editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}</button><button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ padding: '10px 20px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button></div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: '1 1 300px', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: '10px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}><option value="">Tous types</option>{types.map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div>

        {/* Liste */}
        {activeTab === 'liste' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#FAFAFA' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Producteur</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Type</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Organisme</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Obtention</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px' }}>Expiration</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Statut</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px' }}>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Aucune certification</td></tr>
                ) : (
                  filtered.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>{c.planteur}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '16px' }}>{typeIcons[c.type] || ''}</span> {c.type}</td>
                      <td style={{ padding: '12px 16px' }}>{c.organisme}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px' }}>{c.dateObtention}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: c.statut === 'Expirée' ? '#ef4444' : c.statut === 'Expire bientôt' ? '#f59e0b' : '#666' }}>{c.dateExpiration}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.statut === 'Valide' ? '#ECFDF5' : c.statut === 'Expire bientôt' ? '#FFFBEB' : '#FEF2F2', color: c.statut === 'Valide' ? '#10b981' : c.statut === 'Expire bientôt' ? '#f59e0b' : '#ef4444' }}>{c.statut}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => imprimerCertificat(c)} style={{ padding: '6px 10px', background: '#FFF5F0', color: '#CC5500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🖨️</button>
                          {c.statut !== 'Valide' && <button onClick={() => handleRenew(c.id)} style={{ padding: '6px 10px', background: '#ECFDF5', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🔄</button>}
                          <button onClick={() => handleEdit(c)} style={{ padding: '6px 10px', background: '#F0F7F7', color: '#004D4D', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                          <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Types */}
        {activeTab === 'types' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {types.map(t => (
              <div key={t} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #E8E8E8' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{typeIcons[t] || '📜'}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 6px 0' }}>{t}</h3>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#F0F7F7', color: '#06b6d4' }}>{certifications.filter(c => c.type === t).length} certification(s)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const is: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E8E8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' }
