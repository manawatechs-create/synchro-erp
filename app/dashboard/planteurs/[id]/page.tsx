'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dataService from '../../../services/dataService'
import { imprimerCartePlanteur } from '../../../services/printService'
import { useApp } from '../../../context/AppContext'

export default function FichePlanteurPage() {
  const router = useRouter()
  const params = useParams()
  const { addNotification } = useApp()
  const [planteur, setPlanteur] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('infos')

  useEffect(() => {
    if (!params?.id) return
    const data = dataService.getById('data_planteurs', parseInt(params.id as string))
    if (data) {
      setPlanteur(data)
    }
    setLoading(false)
  }, [params?.id])

  const handlePrint = () => {
    if (planteur) {
      imprimerCartePlanteur(planteur)
      addNotification({ type: 'success', message: '🖨️ Impression de la fiche lancée !' })
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
      </div>
    )
  }

  if (!planteur) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ color: 'var(--text)' }}>Planteur non trouvé</h2>
        <button className="erp-btn-primary" style={{ marginTop: '16px' }} onClick={() => router.push('/dashboard/planteurs')}>← Retour à la liste</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #CC5500, #A34400)', color: 'white', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => router.push('/dashboard/planteurs')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>← Retour à la liste</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: '700' }}>
              {planteur.prenom?.charAt(0)}{planteur.nom?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 2px 0' }}>{planteur.prenom} {planteur.nom}</h1>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, fontFamily: 'monospace' }}>ID: {planteur.identifiant}</p>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: 'rgba(255,255,255,0.2)', marginTop: '6px', display: 'inline-block' }}>{planteur.statut}</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={handlePrint}
                style={{ padding: '10px 20px', background: 'white', color: '#CC5500', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                🖨️ Imprimer la fiche
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'infos', label: '📋 Informations' },
            { id: 'activite', label: '📊 Activité' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '400',
              color: activeTab === tab.id ? '#CC5500' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '3px solid #CC5500' : '3px solid transparent',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'infos' && (
          <div className="erp-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #FFF5F0' }}>🪪 Carte d'Identité du Planteur</h3>
            <div className="erp-grid-3">
              {[
                { label: 'Identifiant Unique', value: planteur.identifiant, icon: '🆔' },
                { label: 'Nom complet', value: `${planteur.prenom} ${planteur.nom}`, icon: '👤' },
                { label: 'Sexe', value: planteur.sexe === 'M' ? 'Masculin' : 'Féminin', icon: '⚧️' },
                { label: 'Date de naissance', value: planteur.dateNaissance || 'N/A', icon: '🎂' },
                { label: 'Téléphone', value: planteur.telephone, icon: '📱' },
                { label: 'Email', value: planteur.email || 'N/A', icon: '📧' },
                { label: 'Adresse', value: planteur.adresse || 'N/A', icon: '📍' },
                { label: 'Village', value: planteur.village, icon: '🏘️' },
                { label: 'Région', value: planteur.region || 'N/A', icon: '🗺️' },
                { label: 'Département', value: planteur.departement || 'N/A', icon: '🏛️' },
                { label: 'Superficie', value: planteur.superficie ? `${planteur.superficie} ha` : 'N/A', icon: '📐' },
                { label: 'Type de culture', value: planteur.typeCulture || 'N/A', icon: '🌾' },
                { label: 'Date d\'adhésion', value: new Date(planteur.dateAdhesion).toLocaleDateString('fr-FR'), icon: '📅' },
                { label: 'Statut', value: planteur.statut, icon: '📌' },
              ].map((info, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '20px' }}>{info.icon}</span>
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 2px 0' }}>{info.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'activite' && (
          <div className="erp-card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ color: 'var(--text)' }}>Activité du planteur</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Historique des ventes, achats et opérations liés à ce planteur.</p>
          </div>
        )}
      </div>
    </div>
  )
}
