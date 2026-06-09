// Formatage de date
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatage de montant
export function formatMontant(montant: number, devise: string = 'FCFA'): string {
  return `${montant.toLocaleString('fr-FR')} ${devise}`
}

// Génération de numéro de facture
export function generateNumeroFacture(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `FAC-${year}${month}-${random}`
}

// Génération de code-barres simple
export function generateCodeBarres(prefix: string = 'COOP'): string {
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return `${prefix}-${random}`
}

// Statuts avec couleurs
export const STATUTS = {
  EN_ATTENTE: { label: 'En attente', color: '#fef3c7', textColor: '#92400e' },
  VALIDEE: { label: 'Validée', color: '#dcfce7', textColor: '#166534' },
  ANNULEE: { label: 'Annulée', color: '#fee2e2', textColor: '#dc2626' },
  EN_COURS: { label: 'En cours', color: '#dbeafe', textColor: '#1e40af' },
  LIVREE: { label: 'Livrée', color: '#dcfce7', textColor: '#166534' },
  PAYEE: { label: 'Payée', color: '#dcfce7', textColor: '#166534' },
  IMPAYEE: { label: 'Impayée', color: '#fee2e2', textColor: '#dc2626' },
}

// Taux de change (simulé)
export const TAUX_CHANGE = {
  FCFA: 1,
  EUR: 655.957,
  USD: 603.5,
}

export function convertirDevise(montant: number, de: string, vers: string): number {
  const montantFCFA = montant * TAUX_CHANGE[de as keyof typeof TAUX_CHANGE]
  return montantFCFA / TAUX_CHANGE[vers as keyof typeof TAUX_CHANGE]
}
