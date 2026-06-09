'use client'
import { useState, useEffect } from 'react'

export default function PWAInstall() {
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const handleOnline = () => {
      setIsOffline(false)
      setShowOfflineBanner(true)
      setTimeout(() => setShowOfflineBanner(false), 2000)
    }
    const handleOffline = () => {
      setIsOffline(true)
      setShowOfflineBanner(true)
    }
    
    setIsOffline(!navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('✅ Service Worker enregistré'))
        .catch(err => console.log('⚠️ Service Worker:', err))
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  return (
    <>
      {/* Indicateur connexion - Petit et discret */}
      {showOfflineBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
          backgroundColor: isOffline ? '#f59e0b' : '#10b981',
          zIndex: 9999, transition: 'all 0.3s',
          animation: isOffline ? 'none' : 'fadeOut 2s ease forwards'
        }}>
          <div style={{
            position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: isOffline ? '#f59e0b' : '#10b981',
            color: 'white', padding: '2px 10px', borderRadius: '0 0 6px 6px',
            fontSize: '10px', fontWeight: '600', whiteSpace: 'nowrap'
          }}>
            {isOffline ? '📡 Hors-ligne' : '✅ En ligne'}
          </div>
        </div>
      )}

      {/* Bannière d'installation - Plus compacte */}
      {showInstall && !isInstalled && (
        <div style={{
          position: 'fixed', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'white', border: '1px solid #CC5500', borderRadius: '20px',
          padding: '8px 16px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'system-ui, sans-serif',
          animation: 'slideUp 0.3s ease'
        }}>
          <img src="/logo.png" alt="Synchro ERP" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>Installer l&apos;application</span>
          <button onClick={handleInstall} style={{
            padding: '5px 14px', backgroundColor: '#CC5500', color: 'white',
            border: 'none', borderRadius: '15px', cursor: 'pointer',
            fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap'
          }}>
            📥 Installer
          </button>
          <button onClick={() => setShowInstall(false)} style={{
            padding: '2px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#999', fontSize: '14px'
          }}>
            ✕
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
