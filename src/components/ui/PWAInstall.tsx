'use client'

import { useState, useEffect } from 'react'

export default function PWAInstall() {
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Écouter l'événement d'installation PWA
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Vérifier l'état de la connexion
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    setIsOffline(!navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré !', registration.scope)
        })
        .catch((err) => {
          console.log('⚠️ Service Worker non enregistré :', err)
        })
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
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  const handleDismiss = () => {
    setShowInstall(false)
  }

  return (
    <>
      {/* Bannière d'installation */}
      {showInstall && !isInstalled && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'white', border: '2px solid #CC5500', borderRadius: '16px',
          padding: '16px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '14px',
          fontFamily: 'system-ui, sans-serif', maxWidth: '90vw',
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ fontSize: '32px' }}>📱</div>
          <div>
            <p style={{ fontWeight: '700', color: '#1a1a1a', margin: '0 0 2px 0', fontSize: '14px' }}>
              Installer Synchro ERP
            </p>
            <p style={{ color: '#999', margin: 0, fontSize: '12px' }}>
              Utilisez l'application sans connexion internet
            </p>
          </div>
          <button onClick={handleInstall} style={{
            padding: '10px 20px', backgroundColor: '#CC5500', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap'
          }}>
            📥 Installer
          </button>
          <button onClick={handleDismiss} style={{
            padding: '8px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#999', fontSize: '18px'
          }}>
            ✕
          </button>
        </div>
      )}

      {/* Indicateur hors-ligne */}
      {isOffline && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0',
          backgroundColor: '#f59e0b', color: 'white',
          textAlign: 'center', padding: '6px', fontSize: '12px',
          fontWeight: '600', zIndex: 9999, fontFamily: 'system-ui, sans-serif'
        }}>
          📡 Mode hors-ligne - Les données sont sauvegardées localement
        </div>
      )}

      {/* Indicateur en ligne après hors-ligne */}
      {!isOffline && isInstalled && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0',
          backgroundColor: '#10b981', color: 'white',
          textAlign: 'center', padding: '6px', fontSize: '12px',
          fontWeight: '600', zIndex: 9999, fontFamily: 'system-ui, sans-serif',
          animation: 'fadeOut 3s ease forwards'
        }}>
          ✅ Connecté - Données synchronisées
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
