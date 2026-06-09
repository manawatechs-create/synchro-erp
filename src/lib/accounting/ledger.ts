// Système de comptabilité

export interface EcritureComptable {
  id: string
  date: Date
  compte: string
  libelle: string
  debit: number
  credit: number
  piece: string
}

export interface Bilan {
  actif: { poste: string; montant: number }[]
  passif: { poste: string; montant: number }[]
  total: number
}

class ComptabiliteService {
  static getPlanComptable() {
    return [
      { code: '10', nom: 'Capital' },
      { code: '20', nom: 'Immobilisations' },
      { code: '30', nom: 'Stocks' },
      { code: '40', nom: 'Fournisseurs' },
      { code: '41', nom: 'Clients' },
      { code: '50', nom: 'Banque' },
      { code: '51', nom: 'Caisse' },
      { code: '60', nom: 'Achats' },
      { code: '70', nom: 'Ventes' },
      { code: '80', nom: 'Charges' },
    ]
  }

  static getGrandLivre(): EcritureComptable[] {
    return [
      { id: '1', date: new Date('2024-01-15'), compte: '70', libelle: 'Vente de tomates', debit: 0, credit: 150000, piece: 'FAC-202401-0001' },
      { id: '2', date: new Date('2024-01-16'), compte: '60', libelle: 'Achat engrais', debit: 85000, credit: 0, piece: 'ACH-202401-0001' },
      { id: '3', date: new Date('2024-01-17'), compte: '70', libelle: 'Vente de mil', debit: 0, credit: 230000, piece: 'FAC-202401-0002' },
      { id: '4', date: new Date('2024-01-18'), compte: '50', libelle: 'Dépôt bancaire', debit: 300000, credit: 0, piece: 'BQ-202401-0001' },
      { id: '5', date: new Date('2024-01-20'), compte: '80', libelle: 'Électricité', debit: 25000, credit: 0, piece: 'CH-202401-0001' },
    ]
  }

  static getBilan(): Bilan {
    return {
      actif: [
        { poste: 'Banque', montant: 2500000 },
        { poste: 'Caisse', montant: 500000 },
        { poste: 'Stocks', montant: 1800000 },
        { poste: 'Créances clients', montant: 750000 },
      ],
      passif: [
        { poste: 'Capital', montant: 3000000 },
        { poste: 'Dettes fournisseurs', montant: 450000 },
        { poste: 'Résultat', montant: 2100000 },
      ],
      total: 5550000
    }
  }

  static getCompteResultat() {
    return {
      produits: [
        { poste: 'Ventes de marchandises', montant: 4500000 },
        { poste: 'Produits accessoires', montant: 150000 },
      ],
      charges: [
        { poste: 'Achats', montant: 1800000 },
        { poste: 'Transport', montant: 250000 },
        { poste: 'Électricité', montant: 125000 },
        { poste: 'Salaires', montant: 800000 },
      ],
      totalProduits: 4650000,
      totalCharges: 2975000,
      resultat: 1675000
    }
  }

  static getTresorerie() {
    const entrees = [
      { mois: 'Jan', montant: 450000 },
      { mois: 'Fév', montant: 520000 },
      { mois: 'Mar', montant: 480000 },
    ]
    const sorties = [
      { mois: 'Jan', montant: 320000 },
      { mois: 'Fév', montant: 380000 },
      { mois: 'Mar', montant: 350000 },
    ]
    const solde = entrees.reduce((s, e) => s + e.montant, 0) - sorties.reduce((s, e) => s + e.montant, 0)
    
    return { entrees, sorties, solde }
  }
}

export default ComptabiliteService
