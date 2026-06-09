'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Topbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: '240px', right: 0, height: '56px',
      backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E8E8',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
    }}>
      {/* Marque + Slogan */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="Synchro ERP" style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'contain' }} />
        <div>
          <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '700' }}>Synchro ERP</span>
          <span style={{ fontSize: '11px', color: '#CC5500', marginLeft: '10px', fontWeight: '500', fontStyle: 'italic' }}>
            Plus qu'un ERP, un Partenaire
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => router.push('/dashboard/caisse')} style={iconBtnStyle} title="Caisse">
          <Image src="/icons/wallet.svg" alt="" width={18} height={18} />
        </button>
        <button onClick={() => router.push('/dashboard/notifications')} style={{ ...iconBtnStyle, position: 'relative' }} title="Notifications">
          <Image src="/icons/bell.svg" alt="" width={18} height={18} />
          <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
        </button>

        <div style={{ width: '1px', height: '22px', backgroundColor: '#E8E8E8', margin: '0 4px' }} />

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', backgroundColor: '#FAFAFA', border: '1px solid #E8E8E8', borderRadius: '8px', cursor: 'pointer' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: '#CC5500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700' }}>
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#555' }}>{user?.prenom}</span>
          </button>
          {showUserMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0 }} onClick={() => setShowUserMenu(false)} />
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px', backgroundColor: 'white', border: '1px solid #E8E8E8', borderRadius: '10px', padding: '6px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', zIndex: 300 }}>
                <button onClick={() => { router.push('/dashboard'); setShowUserMenu(false); }} style={menuItemStyle}>📊 Dashboard</button>
                <button onClick={() => { router.push('/dashboard/parametres'); setShowUserMenu(false); }} style={menuItemStyle}>⚙️ Paramètres</button>
                <div style={{ height: '1px', backgroundColor: '#F0F0F0', margin: '4px 0' }} />
                <button onClick={() => { handleLogout(); setShowUserMenu(false); }} style={{ ...menuItemStyle, color: '#ef4444' }}>
                  <Image src="/icons/logout.svg" alt="" width={14} height={14} /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

const iconBtnStyle: React.CSSProperties = {
  width: '34px', height: '34px', borderRadius: '8px',
  backgroundColor: '#FAFAFA', border: '1px solid #E8E8E8',
  cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
}

const menuItemStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', textAlign: 'left',
  backgroundColor: 'transparent', border: 'none', borderRadius: '6px',
  cursor: 'pointer', color: '#555', fontSize: '12px',
  display: 'flex', alignItems: 'center', gap: '8px',
}
