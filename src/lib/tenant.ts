// Gestion du multi-tenant
export function getTenantFromRequest(request: Request): number | null {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]
  
  // Mapping des sous-domaines vers les IDs tenant
  const tenantMap: Record<string, number> = {
    'koudougou': 1,
    'reo': 2,
    'dedougou': 3,
  }
  
  return tenantMap[subdomain] || 1 // Par défaut tenant 1
}

export function getTenantFromLocalStorage(): number {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('tenantId') || '1')
  }
  return 1
}
