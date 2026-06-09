'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Topbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => { 
    const d = localStorage.getItem('user')
    if (d) setUser(JSON.parse(d)) 
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleProfileClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  const goToProfile = () => {
    router.push('/dashboard/parametres')
    setShowUserMenu(false)
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: '230px', right: 0, height: '56px',
      backgroundColor: 'white', borderBottom: '1px solid #E8E8E8',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', fontFamily: 'system-ui, sans-serif', zIndex: 100
    }}>
      {/* Logo + Slogan */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain' }} />
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>Synchro ERP</span>
        <span style={{ fontSize: '11px', color: '#CC5500', fontStyle: 'italic' }}>Plus qu&apos;un ERP, un Partenaire</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Notifications */}
        <button 
          onClick={() => router.push('/dashboard/notifications')} 
          style={iconBtnStyle} 
          title="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Séparateur */}
        <div style={{ width: '1px', height: '22px', backgroundColor: '#E8E8E8' }} />

        {/* Profil cliquable */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleProfileClick}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: '8px',
              backgroundColor: showUserMenu ? '#FFF5F0' : '#FAFAFA',
              border: showUserMenu ? '1px solid #CC5500' : '1px solid #E8E8E8',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { if (!showUserMenu) e.currentTarget.style.backgroundColor = '#F5F5F5' }}
            onMouseLeave={e => { if (!showUserMenu) e.currentTarget.style.backgroundColor = '#FAFAFA' }}
          >
            {/* Avatar */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #CC5500, #A34400)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '12px', fontWeight: '700'
            }}>
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', display: 'block', lineHeight: 1.2 }}>
                {user?.prenom} {user?.nom}
              </span>
              <span style={{ fontSize: '10px', color: '#999', textTransform: 'capitalize' }}>
                {user?.role?.toLowerCase() || 'utilisateur'}
              </span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Menu dropdown */}
          {showUserMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={() => setShowUserMenu(false)} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                width: '220px', backgroundColor: 'white',
                border: '1px solid #E8E8E8', borderRadius: '12px',
                padding: '6px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                zIndex: 300, animation: 'fadeIn 0.15s ease'
              }}>
                {/* Info utilisateur */}
                <div style={{ padding: '12px', borderBottom: '1px solid #F0F0F0', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #CC5500, #A34400)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '16px', fontWeight: '700'
                    }}>
                      {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a', margin: 0 }}>
                        {user?.prenom} {user?.nom}
                      </p>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{user?.email}</p>
                    </div>
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '3px 8px', borderRadius: '5px',
                    backgroundColor: '#FFF5F0', color: '#CC5500',
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase'
                  }}>
                    {user?.role}
                  </span>
                </div>

                {/* Menu items */}
                <button onClick={goToProfile} style={menuItemStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                  </svg>
                  Mon profil
                </button>
                <button onClick={() => { router.push('/dashboard/parametres'); setShowUserMenu(false) }} style={menuItemStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Paramètres
                </button>

                <div style={{ height: '1px', backgroundColor: '#F0F0F0', margin: '4px 0' }} />

                {/* Déconnexion avec icône animée */}
                <button onClick={handleLogout} style={{ ...menuItemStyle, color: '#ef4444' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}

const iconBtnStyle: React.CSSProperties = {
  width: '34px', height: '34px', borderRadius: '8px',
  backgroundColor: '#FAFAFA', border: '1px solid #E8E8E8',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s'
}

const menuItemStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', textAlign: 'left',
  backgroundColor: 'transparent', border: 'none', borderRadius: '8px',
  cursor: 'pointer', color: '#555', fontSize: '12px',
  display: 'flex', alignItems: 'center', gap: '10px',
  transition: 'all 0.15s', fontWeight: '500'
}
