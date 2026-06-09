'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AppContextType {
  theme: string
  couleurPrincipale: string
  couleurSecondaire: string
  police: string
  animations: boolean
  setTheme: (t: string) => void
  setCouleurPrincipale: (c: string) => void
  setCouleurSecondaire: (c: string) => void
  setPolice: (p: string) => void
  setAnimations: (a: boolean) => void
  applyTheme: () => void
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('clair')
  const [couleurPrincipale, setCouleurPrincipaleState] = useState('#CC5500')
  const [couleurSecondaire, setCouleurSecondaireState] = useState('#004D4D')
  const [police, setPoliceState] = useState('Inter')
  const [animations, setAnimationsState] = useState(true)

  useEffect(() => {
    // Charger les préférences sauvegardées
    const prefs = JSON.parse(localStorage.getItem('appPreferences') || '{}')
    if (prefs.theme) setThemeState(prefs.theme)
    if (prefs.couleurPrincipale) setCouleurPrincipaleState(prefs.couleurPrincipale)
    if (prefs.couleurSecondaire) setCouleurSecondaireState(prefs.couleurSecondaire)
    if (prefs.police) setPoliceState(prefs.police)
    if (prefs.animations !== undefined) setAnimationsState(prefs.animations)
  }, [])

  const applyTheme = () => {
    const root = document.documentElement
    
    // Appliquer le thème clair/sombre
    if (theme === 'sombre') {
      document.body.style.backgroundColor = '#0f172a'
      document.body.style.color = '#f1f5f9'
      root.style.setProperty('--bg', '#0f172a')
      root.style.setProperty('--bg-card', '#1e293b')
      root.style.setProperty('--bg-input', '#1e293b')
      root.style.setProperty('--text', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#94a3b8')
      root.style.setProperty('--text-muted', '#64748b')
      root.style.setProperty('--border', '#334155')
      root.style.setProperty('--border-light', '#1e293b')
    } else {
      document.body.style.backgroundColor = '#F8F9FA'
      document.body.style.color = '#1a1a1a'
      root.style.setProperty('--bg', '#F8F9FA')
      root.style.setProperty('--bg-card', '#FFFFFF')
      root.style.setProperty('--bg-input', '#FAFAFA')
      root.style.setProperty('--text', '#1a1a1a')
      root.style.setProperty('--text-secondary', '#666666')
      root.style.setProperty('--text-muted', '#999999')
      root.style.setProperty('--border', '#E8E8E8')
      root.style.setProperty('--border-light', '#F0F0F0')
    }
    
    // Appliquer les couleurs
    root.style.setProperty('--primary', couleurPrincipale)
    root.style.setProperty('--primary-light', couleurPrincipale + '15')
    root.style.setProperty('--secondary', couleurSecondaire)
    root.style.setProperty('--secondary-light', couleurSecondaire + '15')
    
    // Appliquer la police
    if (police && police !== 'Inter') {
      document.body.style.fontFamily = `'${police}', system-ui, -apple-system, sans-serif`
    } else {
      document.body.style.fontFamily = "system-ui, -apple-system, sans-serif"
    }
    
    // Appliquer les animations
    document.body.style.transition = animations ? 'all 0.3s ease' : 'none'
  }

  // Appliquer le thème à chaque changement
  useEffect(() => { applyTheme() }, [theme, couleurPrincipale, couleurSecondaire, police, animations])

  const setTheme = (t: string) => { setThemeState(t); savePrefs('theme', t) }
  const setCouleurPrincipale = (c: string) => { setCouleurPrincipaleState(c); savePrefs('couleurPrincipale', c) }
  const setCouleurSecondaire = (c: string) => { setCouleurSecondaireState(c); savePrefs('couleurSecondaire', c) }
  const setPolice = (p: string) => { setPoliceState(p); savePrefs('police', p) }
  const setAnimations = (a: boolean) => { setAnimationsState(a); savePrefs('animations', a) }

  const savePrefs = (key: string, value: any) => {
    const prefs = JSON.parse(localStorage.getItem('appPreferences') || '{}')
    prefs[key] = value
    localStorage.setItem('appPreferences', JSON.stringify(prefs))
  }

  return (
    <AppContext.Provider value={{
      theme, couleurPrincipale, couleurSecondaire, police, animations,
      setTheme, setCouleurPrincipale, setCouleurSecondaire, setPolice, setAnimations, applyTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
