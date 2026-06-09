'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dataService from '../../../services/dataService'

export default function FichePlanteurPage() {
  const router = useRouter()
  const params = useParams()
  const [planteur, setPlanteur] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService.init()
    const planteurs = dataService.getPlanteurs()
    const found = planteurs.find((p: any) => p.id.toString() === params?.id)
    setPlanteur(found || null)
    setLoading(false)
  }, [params?.id])

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ color: '#999' }}>Chargement...</p>
    </div>
  }

  if (!planteur) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: '#1a1a1a', marginBottom: 8 }}>Producteur non trouvé</h2>
        <p style={{ color: '#999', marginBottom: 20 }}>Ce producteur n&apos;existe pas ou a été supprimé.</p>
        <button onClick={() => router.push('/dashboard/planteurs')} style={{ padding: '10px 24px', background: '#CC5500', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          ← Retour à la liste
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #CC5500, #A34400)', color: 'white', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => router.push('/dashboard/planteurs')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>
            ← Retour à la liste
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: '700' }}>
              {planteur.prenom?.charAt(0)}{planteur.nom?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 2px 0' }}>{planteur.prenom} {planteur.nom}</h1>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, fontFamily: 'monospace' }}>ID: {planteur.identifiant}</p>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: 'rgba(255,255,255,0.2)', marginTop: '6px', display: 'inline-block' }}>{planteur.statut}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8E8E8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #FFF5F0' }}>
            🪪 Informations du Producteur
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Identifiant Unique', value: planteur.identifiant, icon: '🆔' },
              { label: 'Nom complet', value: `${planteur.prenom} ${planteur.nom}`, icon: '👤' },
              { label: 'Sexe', value: planteur.sexe === 'M' ? 'Masculin' : planteur.sexe === 'F' ? 'Féminin' : 'N/A', icon: '⚧️' },
              { label: 'Téléphone', value: planteur.telephone, icon: '📱' },
              { label: 'Email', value: planteur.email || 'Non renseigné', icon: '📧' },
              { label: 'Adresse', value: planteur.adresse || 'Non renseignée', icon: '📍' },
              { label: 'Village', value: planteur.village, icon: '🏘️' },
              { label: 'Région', value: planteur.region || 'N/A', icon: '🗺️' },
              { label: 'Département', value: planteur.departement || 'N/A', icon: '🏛️' },
              { label: 'Superficie', value: planteur.superficie ? `${planteur.superficie} hectares` : 'N/A', icon: '📐' },
              { label: 'Type de culture', value: planteur.typeCulture || 'N/A', icon: '🌾' },
              { label: 'Date d\'adhésion', value: new Date(planteur.dateAdhesion).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), icon: '📅' },
              { label: 'Statut', value: planteur.statut, icon: '📌' },
              { label: 'Notes', value: planteur.notes || 'Aucune note', icon: '📝' },
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
                <span style={{ fontSize: '20px' }}>{info.icon}</span>
                <div>
                  <p style={{ fontSize: '10px', color: '#999', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 2px 0' }}>{info.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => router.push('/dashboard/planteurs')} style={{ padding: '10px 24px', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            ← Retour
          </button>
        </div>
      </div>
    </div>
  )
}
