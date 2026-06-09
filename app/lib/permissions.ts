// Système de permissions - Synchro ERP

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['all'],
  GESTIONNAIRE: [
    'dashboard:view', 'planteurs:all', 'produits:all',
    'ventes:all', 'achats:all', 'caisse:all', 'factures:all',
    'accounting:view', 'credits:view', 'campagnes:all',
    'logistique:all', 'reunions:all', 'certifications:view',
    'mutuelle:view', 'loyalty:view', 'analytics:view',
  ],
  COMPTABLE: [
    'dashboard:view', 'caisse:all', 'factures:all',
    'accounting:all', 'credits:view', 'analytics:view',
  ],
  MEMBRE: [
    'dashboard:view', 'planteurs:view', 'produits:view',
    'ventes:view', 'achats:view',
  ],
}

export function hasPermission(moduleKey: string, action: string): boolean {
  if (typeof window === 'undefined') return false
  const userData = localStorage.getItem('user')
  if (!userData) return false
  const user = JSON.parse(userData)
  const permissions = ROLE_PERMISSIONS[user.role] || []
  if (permissions.includes('all')) return true
  return permissions.includes(`${moduleKey}:${action}`) || permissions.includes(`${moduleKey}:all`)
}

export function canViewModule(moduleKey: string): boolean {
  return hasPermission(moduleKey, 'view')
}

export function getUserRole(): string {
  if (typeof window === 'undefined') return 'MEMBRE'
  const userData = localStorage.getItem('user')
  if (!userData) return 'MEMBRE'
  const user = JSON.parse(userData)
  return user.role || 'MEMBRE'
}
