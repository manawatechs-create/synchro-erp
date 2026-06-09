'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AppState {
  theme: string
  couleurPrincipale: string
  couleurSecondaire: string
  police: string
  animations: boolean
  sidebarCollapsed: boolean
  notifications: any[]
  user: any
  setTheme: (t: string) => void
  setCouleurPrincipale: (c: string) => void
  setCouleurSecondaire: (c: string) => void
  setPolice: (p: string) => void
  setAnimations: (a: boolean) => void
  toggleSidebar: () => void
  addNotification: (n: any) => void
  applyTheme: () => void
}

const AppContext = createContext<AppState>({} as AppState)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('clair')
  const [couleurPrincipale, setCouleurPrincipaleState] = useState('#CC5500')
  const [couleurSecondaire, setCouleurSecondaireState] = useState('#004D4D')
  const [police, setPoliceState] = useState('Inter')
  const [animations, setAnimationsState] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Charger les préférences
    const saved = localStorage.getItem('appPreferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      if (prefs.theme) setThemeState(prefs.theme)
      if (prefs.couleurPrincipale) setCouleurPrincipaleState(prefs.couleurPrincipale)
      if (prefs.couleurSecondaire) setCouleurSecondaireState(prefs.couleurSecondaire)
      if (prefs.police) setPoliceState(prefs.police)
      if (prefs.animations !== undefined) setAnimationsState(prefs.animations)
    }
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const applyTheme = useCallback(() => {
    const root = document.documentElement
    
    if (theme === 'sombre') {
      document.body.style.backgroundColor = '#0f172a'
      document.body.style.color = '#f1f5f9'
      root.style.setProperty('--bg', '#0f172a')
      root.style.setProperty('--bg-card', '#1e293b')
      root.style.setProperty('--text', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#94a3b8')
      root.style.setProperty('--border', '#334155')
    } else {
      document.body.style.backgroundColor = '#F8F9FA'
      document.body.style.color = '#1a1a1a'
      root.style.setProperty('--bg', '#F8F9FA')
      root.style.setProperty('--bg-card', '#FFFFFF')
      root.style.setProperty('--text', '#1a1a1a')
      root.style.setProperty('--text-secondary', '#666666')
      root.style.setProperty('--border', '#E8E8E8')
    }
    
    root.style.setProperty('--primary', couleurPrincipale)
    root.style.setProperty('--primary-light', couleurPrincipale + '15')
    root.style.setProperty('--secondary', couleurSecondaire)
    root.style.setProperty('--secondary-light', couleurSecondaire + '15')
    
    if (police !== 'Inter') {
      document.body.style.fontFamily = `'${police}', system-ui, sans-serif`
    }
    
    document.body.style.transition = animations ? 'all 0.3s ease' : 'none'
  }, [theme, couleurPrincipale, couleurSecondaire, police, animations])

  useEffect(() => { applyTheme() }, [applyTheme])

  const setTheme = (t: string) => {
    setThemeState(t)
    savePreferences({ theme: t })
  }
  const setCouleurPrincipale = (c: string) => {
    setCouleurPrincipaleState(c)
    savePreferences({ couleurPrincipale: c })
  }
  const setCouleurSecondaire = (c: string) => {
    setCouleurSecondaireState(c)
    savePreferences({ couleurSecondaire: c })
  }
  const setPolice = (p: string) => {
    setPoliceState(p)
    savePreferences({ police: p })
  }
  const setAnimations = (a: boolean) => {
    setAnimationsState(a)
    savePreferences({ animations: a })
  }
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)
  const addNotification = (n: any) => {
    const notif = { id: Date.now(), ...n, date: new Date().toISOString() }
    setNotifications(prev => [notif, ...prev])
    setTimeout(() => setNotifications(prev => prev.filter(n2 => n2.id !== notif.id)), 3000)
  }

  const savePreferences = (partial: any) => {
    const current = JSON.parse(localStorage.getItem('appPreferences') || '{}')
    localStorage.setItem('appPreferences', JSON.stringify({ ...current, ...partial }))
  }

  return (
    <AppContext.Provider value={{
      theme, couleurPrincipale, couleurSecondaire, police, animations,
      sidebarCollapsed, notifications, user,
      setTheme, setCouleurPrincipale, setCouleurSecondaire, setPolice,
      setAnimations, toggleSidebar, addNotification, applyTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
