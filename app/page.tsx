'use client'

import Link from 'next/link'

export default function Home() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  const modules = [
    { icon: '👨‍🌾', title: 'Producteurs', desc: 'Gestion complète des producteurs avec fiches détaillées, identifiants uniques et suivi des cultures' },
    { icon: '📦', title: 'Produits', desc: 'Catalogue produits avec gestion des stocks, prix, catégories et alertes de réapprovisionnement' },
    { icon: '💰', title: 'Ventes', desc: 'Enregistrement des ventes multi-produits avec calcul automatique et mise à jour des stocks' },
    { icon: '🛒', title: 'Achats', desc: 'Gestion des approvisionnements avec suivi fournisseurs et intégration caisse' },
    { icon: '💵', title: 'Caisse', desc: 'Caisse digitale multi-modes (espèces, Orange Money, Moov Money) avec reçus' },
    { icon: '🧾', title: 'Factures', desc: 'Facturation professionnelle avec calcul TVA, HT, TTC et impression' },
    { icon: '💳', title: 'Comptabilité', desc: 'Bilan, compte de résultat, grand livre et trésorerie en temps réel' },
    { icon: '🏦', title: 'Crédits', desc: 'Micro-crédit avec échéanciers, remboursements et suivi des encours' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8F9FA', minHeight: '100vh' }}>
      
      {/* HERO */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E8E8E8',
        padding: '80px 20px 60px',
        textAlign: 'center'
      }}>
        <img 
          src="/logo.png" 
          alt="Synchro ERP" 
          style={{ 
            width: '90px', height: '90px', borderRadius: '18px', marginBottom: '24px',
            boxShadow: '0 4px 15px rgba(204,85,0,0.15)', padding: '10px', backgroundColor: '#FFF5F0'
          }} 
        />
        <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '-1px' }}>
          Synchro ERP
        </h1>
        <p style={{ fontSize: '16px', color: '#CC5500', fontWeight: '600', fontStyle: 'italic', marginBottom: '4px' }}>
          Plus qu&apos;un ERP, un Partenaire
        </p>
        <p style={{ fontSize: '14px', color: '#999', maxWidth: '550px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          La solution de gestion intégrée pour les coopératives agricoles.
          Digitalisez, automatisez et optimisez l&apos;ensemble de vos opérations.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            backgroundColor: '#CC5500', color: 'white',
            padding: '14px 32px', borderRadius: '8px',
            textDecoration: 'none', fontWeight: '600', fontSize: '15px',
            transition: 'all 0.2s'
          }}>
            🔐 Se connecter
          </Link>
          <Link href="/register" style={{
            backgroundColor: 'white', color: '#CC5500',
            padding: '14px 32px', borderRadius: '8px',
            textDecoration: 'none', fontWeight: '600', fontSize: '15px',
            border: '2px solid #CC5500', transition: 'all 0.2s'
          }}>
            ✅ S&apos;inscrire
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ 
        maxWidth: '900px', margin: '-25px auto 0', 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '12px', padding: '0 20px', position: 'relative', zIndex: 10 
      }}>
        {[
          { value: '19', label: 'Modules', icon: '📦', color: '#CC5500', bg: '#FFF5F0' },
          { value: '8', label: 'Documents Pro', icon: '📄', color: '#004D4D', bg: '#F0F7F7' },
          { value: 'PWA', label: 'Hors-ligne', icon: '📱', color: '#10b981', bg: '#ECFDF5' },
          { value: '100%', label: 'Fonctionnel', icon: '✅', color: '#8b5cf6', bg: '#F5F3FF' },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: 'white', borderRadius: '10px', padding: '16px',
            textAlign: 'center', border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
            <p style={{ fontSize: '20px', fontWeight: '800', color: s.color, margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: '10px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
          🚀 Modules du Système
        </h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '28px', fontSize: '13px' }}>
          19 modules intégrés pour gérer l&apos;ensemble de votre coopérative
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {modules.map((m, i) => (
            <div key={i} 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundColor: 'white', borderRadius: '10px', padding: '18px',
                border: '1px solid #E8E8E8', display: 'flex', gap: '12px',
                alignItems: 'flex-start', transition: 'all 0.2s', cursor: 'default'
              }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{m.icon}</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 3px' }}>{m.title}</h3>
                <p style={{ fontSize: '11px', color: '#999', margin: 0, lineHeight: '1.5' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POINTS FORTS */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #E8E8E8', borderBottom: '1px solid #E8E8E8', padding: '50px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '28px' }}>
            ⚡ Pourquoi choisir Synchro ERP ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {[
              { icon: '📱', title: 'Accessible partout', desc: 'Fonctionne en ligne et hors-ligne. Installez l\'application sur votre téléphone.' },
              { icon: '🏢', title: 'Multi-coopératives', desc: 'Gérez plusieurs coopératives depuis une seule plateforme.' },
              { icon: '🔐', title: 'Sécurisé', desc: 'Rôles et permissions granulaires. Données protégées.' },
              { icon: '📊', title: 'Aide à la décision', desc: 'Tableaux de bord et indicateurs en temps réel.' },
              { icon: '🔄', title: 'Synchronisation', desc: 'Données synchronisées automatiquement.' },
              { icon: '🌍', title: 'Adapté au terrain', desc: 'Conçu pour les zones à connectivité limitée.' },
            ].map((pf, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#FAFAFA', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{pf.icon}</div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>{pf.title}</h4>
                <p style={{ fontSize: '11px', color: '#999', margin: 0, lineHeight: '1.4' }}>{pf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '28px 20px', backgroundColor: 'white' }}>
        <p style={{ color: '#CCC', fontSize: '11px', margin: '0 0 6px' }}>
          © 2026 Synchro ERP • Tous droits réservés
        </p>
        <p style={{ color: '#CC5500', fontSize: '12px', fontWeight: '600', margin: 0 }}>
          Construit par <strong>Manawa Techs</strong>
        </p>
      </div>
    </div>
  )
}
