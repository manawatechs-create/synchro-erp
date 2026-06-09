// Définition de tous les modules et leurs permissions
export const MODULES = {
  dashboard: {
    key: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    permissions: ['view']
  },
  planteurs: {
    key: 'planteurs',
    label: 'Planteurs',
    icon: '👨‍🌾',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  produits: {
    key: 'produits',
    label: 'Produits',
    icon: '📦',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  ventes: {
    key: 'ventes',
    label: 'Ventes',
    icon: '💰',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  achats: {
    key: 'achats',
    label: 'Achats',
    icon: '🛒',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  factures: {
    key: 'factures',
    label: 'Factures',
    icon: '🧾',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  caisse: {
    key: 'caisse',
    label: 'Caisse',
    icon: '💵',
    permissions: ['view', 'create', 'edit']
  },
  comptabilite: {
    key: 'comptabilite',
    label: 'Comptabilité',
    icon: '💳',
    permissions: ['view', 'edit']
  },
  credits: {
    key: 'credits',
    label: 'Crédits',
    icon: '🏦',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  campagnes: {
    key: 'campagnes',
    label: 'Campagnes',
    icon: '🌾',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  logistique: {
    key: 'logistique',
    label: 'Logistique',
    icon: '📦',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  analytics: {
    key: 'analytics',
    label: 'Analytics',
    icon: '📈',
    permissions: ['view']
  },
  reunions: {
    key: 'reunions',
    label: 'Réunions',
    icon: '📋',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  certifications: {
    key: 'certifications',
    label: 'Certifications',
    icon: '📜',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  mutuelle: {
    key: 'mutuelle',
    label: 'Mutuelle',
    icon: '🏥',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  membres: {
    key: 'membres',
    label: 'Utilisateurs',
    icon: '👥',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  roles: {
    key: 'roles',
    label: 'Rôles & Permissions',
    icon: '🔐',
    permissions: ['view', 'create', 'edit', 'delete']
  },
  parametres: {
    key: 'parametres',
    label: 'Paramètres',
    icon: '⚙️',
    permissions: ['view', 'edit']
  }
} as const

export type ModuleKey = keyof typeof MODULES
export type Permission = 'view' | 'create' | 'edit' | 'delete'

// Vérifier si un utilisateur a une permission spécifique
export function hasPermission(userPermissions: string[], moduleKey: string, permission: string): boolean {
  // Admin a tous les droits
  if (userPermissions.includes('all')) return true
  
  // Vérifier la permission spécifique
  const permCode = `${moduleKey}:${permission}`
  return userPermissions.includes(permCode) || userPermissions.includes(`${moduleKey}:all`)
}

// Récupérer les permissions de l'utilisateur connecté
export function getUserPermissions(): string[] {
  if (typeof window === 'undefined') return []
  const userData = localStorage.getItem('user')
  if (!userData) return []
  
  const user = JSON.parse(userData)
  
  // Si l'utilisateur a un rôle avec des permissions
  if (user.role === 'ADMIN') return ['all']
  if (user.permissions) return user.permissions
  
  // Permissions par défaut selon le rôle
  const rolePermissions: Record<string, string[]> = {
    'ADMIN': ['all'],
    'GESTIONNAIRE': [
      'dashboard:view', 'planteurs:all', 'produits:all', 'ventes:all',
      'achats:all', 'factures:all', 'caisse:all', 'comptabilite:view',
      'credits:view', 'campagnes:all', 'logistique:all', 'analytics:view',
      'reunions:all', 'certifications:view', 'mutuelle:view'
    ],
    'COMPTABLE': [
      'dashboard:view', 'factures:all', 'caisse:all', 'comptabilite:all',
      'credits:view', 'analytics:view'
    ],
    'MEMBRE': [
      'dashboard:view', 'planteurs:view', 'produits:view',
      'ventes:view', 'achats:view'
    ],
    'AUDITEUR': [
      'dashboard:view', 'planteurs:view', 'produits:view', 'ventes:view',
      'achats:view', 'factures:view', 'caisse:view', 'comptabilite:view',
      'credits:view', 'campagnes:view', 'analytics:view'
    ]
  }
  
  return rolePermissions[user.role] || []
}

// Rôles prédéfinis avec leurs permissions
export const PREDEFINED_ROLES = [
  {
    nom: 'Administrateur',
    description: 'Accès complet à tous les modules',
    permissions: ['all']
  },
  {
    nom: 'Gestionnaire',
    description: 'Gestion quotidienne des opérations',
    permissions: [
      'dashboard:view', 'planteurs:all', 'produits:all', 'ventes:all',
      'achats:all', 'factures:all', 'caisse:all', 'comptabilite:view',
      'credits:view', 'campagnes:all', 'logistique:all', 'analytics:view',
      'reunions:all', 'certifications:view', 'mutuelle:view'
    ]
  },
  {
    nom: 'Comptable',
    description: 'Gestion financière et comptable',
    permissions: [
      'dashboard:view', 'factures:all', 'caisse:all', 'comptabilite:all',
      'credits:view', 'analytics:view', 'ventes:view', 'achats:view'
    ]
  },
  {
    nom: 'Agent de terrain',
    description: 'Saisie des données terrain',
    permissions: [
      'dashboard:view', 'planteurs:create', 'planteurs:edit', 'planteurs:view',
      'produits:view', 'ventes:create', 'ventes:view', 'achats:create',
      'achats:view', 'campagnes:create', 'campagnes:edit', 'campagnes:view',
      'reunions:view', 'certifications:view'
    ]
  },
  {
    nom: 'Membre simple',
    description: 'Consultation uniquement',
    permissions: [
      'dashboard:view', 'planteurs:view', 'produits:view',
      'ventes:view', 'achats:view'
    ]
  }
]
