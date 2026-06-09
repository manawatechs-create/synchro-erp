import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F0 0%, #F0F7F7 50%, #FAFAFA 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 60px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '26px',
          overflow: 'hidden', marginBottom: '28px',
          boxShadow: '0 16px 50px rgba(204, 85, 0, 0.25)',
          backgroundColor: '#FFF5F0', padding: '16px'
        }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px', letterSpacing: '-1.5px', maxWidth: '700px' }}>
          Synchro ERP
        </h1>
        <p style={{ fontSize: '18px', color: '#CC5500', fontWeight: '600', marginBottom: '8px', fontStyle: 'italic' }}>
          Plus qu&apos;un ERP, un Partenaire
        </p>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
          La solution de gestion intégrée pour les coopératives agricoles. Digitalisez, automatisez et optimisez l&apos;ensemble de vos opérations.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #CC5500, #A34400)',
            color: 'white', padding: '16px 40px',
            borderRadius: '12px', textDecoration: 'none', fontWeight: '700',
            fontSize: '16px', boxShadow: '0 8px 30px rgba(204,85,0,0.3)',
          }}>
            🔐 Se connecter
          </Link>
          <Link href="/register" style={{
            backgroundColor: 'white', color: '#CC5500',
            padding: '16px 40px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: '700',
            fontSize: '16px', border: '2px solid #CC5500',
          }}>
            ✅ S&apos;inscrire
          </Link>
        </div>
      </div>

      {/* Modules Section */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '40px' }}>
          Une solution complète pour votre coopérative
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            { icon: '👨‍🌾', title: 'Producteurs', desc: 'Recensement, identification unique, suivi des parcelles et des cultures' },
            { icon: '📦', title: 'Commercial', desc: 'Ventes, achats, facturation, stocks et catalogue produits' },
            { icon: '💰', title: 'Finance', desc: 'Caisse, comptabilité, crédits et financements' },
            { icon: '🌾', title: 'Campagnes', desc: 'Planification, suivi des saisons, récoltes et rendements' },
            { icon: '🚚', title: 'Logistique', desc: 'Suivi des livraisons, transporteurs et flux' },
            { icon: '🤝', title: 'Services', desc: 'Mutuelle, cotisations, fidélité et aides sociales' },
            { icon: '📜', title: 'Qualité', desc: 'Suivi des certifications, labels et normes' },
            { icon: '📊', title: 'Pilotage', desc: 'Tableaux de bord, KPIs, rapports et analyses' },
          ].map((f, i) => (
            <div key={i} style={{
              backgroundColor: 'white', padding: '28px 22px',
              borderRadius: '16px', border: '1px solid #E8E8E8',
              textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#999', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points forts */}
      <div style={{ backgroundColor: 'white', padding: '60px 20px', borderTop: '1px solid #E8E8E8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '40px' }}>
            Pourquoi choisir Synchro ERP ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              { icon: '📱', title: 'Accessible partout', desc: 'Fonctionne en ligne et hors-ligne. Installez l\'application sur votre téléphone.' },
              { icon: '🏢', title: 'Multi-coopératives', desc: 'Gérez plusieurs coopératives ou unions depuis une seule plateforme.' },
              { icon: '🔐', title: 'Sécurisé', desc: 'Rôles et permissions granulaires. Données protégées et sauvegardées.' },
              { icon: '📊', title: 'Aide à la décision', desc: 'Tableaux de bord et indicateurs en temps réel pour piloter votre activité.' },
              { icon: '🔄', title: 'Synchronisation', desc: 'Les données se synchronisent automatiquement dès le retour de connexion.' },
              { icon: '🌍', title: 'Adapté au terrain', desc: 'Conçu pour les zones à connectivité limitée. Fonctionne avec tous les appareils.' },
            ].map((pf, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '16px', backgroundColor: '#FAFAFA', borderRadius: '12px' }}>
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{pf.icon}</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>{pf.title}</h4>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0, lineHeight: '1.5' }}>{pf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 20px', borderTop: '1px solid #E8E8E8' }}>
        <p style={{ color: '#CCC', fontSize: '12px', margin: '0 0 8px 0' }}>
          © 2026 Synchro ERP • Tous droits réservés
        </p>
        <p style={{ color: '#CC5500', fontSize: '12px', fontWeight: '600', margin: 0 }}>
          Construit par <strong>Manawa Techs</strong>
        </p>
      </div>
    </div>
  )
}
