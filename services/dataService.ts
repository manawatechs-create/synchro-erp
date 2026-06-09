// Service de données centralisé - Simule une API réelle avec localStorage
// Remplacer par des appels API réels pour la production

const STORAGE_KEYS = {
  planteurs: 'data_planteurs',
  produits: 'data_produits',
  ventes: 'data_ventes',
  achats: 'data_achats',
  operations: 'data_operations',
  campagnes: 'data_campagnes',
  livraisons: 'data_livraisons',
  credits: 'data_credits',
  reunions: 'data_reunions',
  certifications: 'data_certifications',
  cotisations: 'data_cotisations',
  membres: 'data_membres',
}

// Données initiales
const INITIAL_DATA: Record<string, any[]> = {
  planteurs: [
    { id: 1, identifiant: 'PLT-2024-0001', nom: 'Diallo', prenom: 'Amadou', telephone: '+226 70 00 00 10', email: 'amadou@email.com', village: 'Koudougou', region: 'Centre-Ouest', departement: 'Boulkiemdé', sexe: 'M', dateNaissance: '1985-03-15', superficie: 5.5, typeCulture: 'Céréales', statut: 'ACTIF', dateAdhesion: '2023-06-15', notes: '' },
    { id: 2, identifiant: 'PLT-2024-0002', nom: 'Camara', prenom: 'Fatou', telephone: '+226 70 00 00 11', email: 'fatou@email.com', village: 'Réo', region: 'Centre-Ouest', departement: 'Sanguié', sexe: 'F', dateNaissance: '1990-07-20', superficie: 2.3, typeCulture: 'Maraîchage', statut: 'ACTIF', dateAdhesion: '2023-08-20', notes: '' },
    { id: 3, identifiant: 'PLT-2024-0003', nom: 'Koné', prenom: 'Ibrahim', telephone: '+226 70 00 00 12', email: 'ibrahim@email.com', village: 'Sapouy', region: 'Centre-Ouest', departement: 'Ziro', sexe: 'M', dateNaissance: '1978-11-08', superficie: 8.0, typeCulture: 'Arboriculture', statut: 'ACTIF', dateAdhesion: '2023-04-10', notes: '' },
    { id: 4, identifiant: 'PLT-2024-0004', nom: 'Ouédraogo', prenom: 'Aïcha', telephone: '+226 70 00 00 13', email: 'aicha@email.com', village: 'Koudougou', region: 'Centre-Ouest', departement: 'Boulkiemdé', sexe: 'F', dateNaissance: '1992-05-25', superficie: 3.7, typeCulture: 'Légumineuses', statut: 'ACTIF', dateAdhesion: '2024-01-05', notes: '' },
    { id: 5, identifiant: 'PLT-2024-0005', nom: 'Traoré', prenom: 'Moussa', telephone: '+226 70 00 00 14', email: 'moussa@email.com', village: 'Dédougou', region: 'Boucle du Mouhoun', departement: 'Mouhoun', sexe: 'M', dateNaissance: '1980-09-12', superficie: 12.0, typeCulture: 'Céréales', statut: 'ACTIF', dateAdhesion: '2022-11-30', notes: '' },
  ],
  produits: [
    { id: 1, nom: 'Mil', description: 'Mil local de qualité supérieure', prixUnitaire: 350, quantiteStock: 500, uniteMesure: 'kg', categorieId: 1, categorie: { id: 1, nom: 'Céréales' } },
    { id: 2, nom: 'Maïs', description: 'Maïs blanc pour consommation', prixUnitaire: 250, quantiteStock: 800, uniteMesure: 'kg', categorieId: 1, categorie: { id: 1, nom: 'Céréales' } },
    { id: 3, nom: 'Tomates', description: 'Tomates fraîches du jardin', prixUnitaire: 500, quantiteStock: 200, uniteMesure: 'kg', categorieId: 2, categorie: { id: 2, nom: 'Légumes' } },
    { id: 4, nom: 'Oignons', description: 'Oignons violets locaux', prixUnitaire: 400, quantiteStock: 300, uniteMesure: 'kg', categorieId: 2, categorie: { id: 2, nom: 'Légumes' } },
    { id: 5, nom: 'Mangues', description: 'Mangues greffées sucrées', prixUnitaire: 600, quantiteStock: 150, uniteMesure: 'kg', categorieId: 3, categorie: { id: 3, nom: 'Fruits' } },
  ],
  categories: [
    { id: 1, nom: 'Céréales', description: 'Mil, maïs, sorgho, riz' },
    { id: 2, nom: 'Légumes', description: 'Tomates, oignons, choux' },
    { id: 3, nom: 'Fruits', description: 'Mangues, bananes, papayes' },
    { id: 4, nom: 'Tubercules', description: 'Patates, ignames, manioc' },
  ],
  ventes: [
    { id: 1, dateVente: '2024-06-08', montantTotal: 150000, statut: 'VALIDEE', membreId: 1, membre: { prenom: 'Amadou', nom: 'Diallo' }, notes: 'Vente marché' },
    { id: 2, dateVente: '2024-06-07', montantTotal: 85000, statut: 'VALIDEE', membreId: 2, membre: { prenom: 'Fatou', nom: 'Camara' }, notes: '' },
    { id: 3, dateVente: '2024-06-06', montantTotal: 230000, statut: 'EN_ATTENTE', membreId: 3, membre: { prenom: 'Ibrahim', nom: 'Koné' }, notes: '' },
  ],
  achats: [
    { id: 1, dateAchat: '2024-06-05', montantTotal: 350000, statut: 'VALIDEE', membreId: 1, membre: { prenom: 'Amadou', nom: 'Diallo' }, notes: 'Engrais' },
    { id: 2, dateAchat: '2024-06-04', montantTotal: 125000, statut: 'VALIDEE', membreId: 2, membre: { prenom: 'Fatou', nom: 'Camara' }, notes: 'Semences' },
  ],
  operations: [
    { id: 1, type: 'ENTREE', montant: 150000, motif: 'Vente tomates', modePaiement: 'ESPECES', dateOperation: '2024-06-08', reference: 'OP-001' },
    { id: 2, type: 'SORTIE', montant: 50000, motif: 'Achat intrants', modePaiement: 'ORANGE_MONEY', dateOperation: '2024-06-07', reference: 'OP-002' },
    { id: 3, type: 'ENTREE', montant: 250000, motif: 'Vente mil', modePaiement: 'ESPECES', dateOperation: '2024-06-06', reference: 'OP-003' },
    { id: 4, type: 'SORTIE', montant: 35000, motif: 'Transport', modePaiement: 'MOOV_MONEY', dateOperation: '2024-06-05', reference: 'OP-004' },
    { id: 5, type: 'ENTREE', montant: 85000, motif: 'Vente oignons', modePaiement: 'ESPECES', dateOperation: '2024-06-04', reference: 'OP-005' },
  ],
  campagnes: [
    { id: 1, nom: 'Campagne 2024 - Saison Pluvieuse', saison: 'Pluvieuse', dateDebut: '2024-06-01', dateFin: '2024-10-31', statut: 'En cours', planteurs: 85, cultures: ['Mil', 'Maïs', 'Sorgho'], progression: 65 },
    { id: 2, nom: 'Campagne 2024 - Contre-saison', saison: 'Sèche', dateDebut: '2024-11-01', dateFin: '2025-03-31', statut: 'Planifiée', planteurs: 42, cultures: ['Tomates', 'Oignons'], progression: 0 },
  ],
  livraisons: [
    { id: 1, reference: 'LIV-2024-001', origine: 'Koudougou', destination: 'Ouagadougou', dateDepart: '2024-06-01', statut: 'Livrée', transporteur: 'TransCargo', produits: 'Tomates (500kg)', frais: 25000 },
    { id: 2, reference: 'LIV-2024-002', origine: 'Réo', destination: 'Koudougou', dateDepart: '2024-06-05', statut: 'En cours', transporteur: 'SpeedLog', produits: 'Mil (1 tonne)', frais: 45000 },
  ],
  credits: [
    { id: 1, planteur: 'Amadou Diallo', montant: 250000, taux: 5, duree: 12, mensualite: 21875, reste: 175000, statut: 'Actif', progression: 30 },
    { id: 2, planteur: 'Fatou Camara', montant: 150000, taux: 5, duree: 6, mensualite: 25625, reste: 51250, statut: 'Actif', progression: 66 },
    { id: 3, planteur: 'Ibrahim Koné', montant: 500000, taux: 7, duree: 24, mensualite: 22917, reste: 0, statut: 'Remboursé', progression: 100 },
  ],
  reunions: [
    { id: 1, titre: 'Assemblée Générale Annuelle', type: 'Assemblée Générale', date: '2024-06-15', lieu: 'Siège Coopérative - Koudougou', statut: 'Planifiée', participants: 85 },
    { id: 2, titre: 'Conseil d\'Administration', type: 'Conseil', date: '2024-06-20', lieu: 'Salle de réunion', statut: 'Planifiée', participants: 12 },
  ],
  certifications: [
    { id: 1, planteur: 'Amadou Diallo', type: 'Bio', organisme: 'ECOCERT', dateObtention: '2024-03-15', dateExpiration: '2025-03-15', statut: 'Valide', document: 'certif-bio-001.pdf' },
    { id: 2, planteur: 'Fatou Camara', type: 'Commerce Équitable', organisme: 'Fairtrade', dateObtention: '2024-01-20', dateExpiration: '2025-01-20', statut: 'Valide', document: 'fairtrade-002.pdf' },
  ],
  cotisations: [
    { id: 1, planteur: 'Amadou Diallo', type: 'Mutuelle', montant: 5000, frequence: 'Mensuel', date: '2024-06-01', statut: 'Payé' },
    { id: 2, planteur: 'Fatou Camara', type: 'Assurance', montant: 15000, frequence: 'Trimestriel', date: '2024-05-15', statut: 'Payé' },
  ],
}

class DataService {
  private static instance: DataService

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // Initialiser les données
  init() {
    Object.entries(INITIAL_DATA).forEach(([key, data]) => {
      const storageKey = (STORAGE_KEYS as any)[key] || `data_${key}`
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(data))
      }
    })
    // Initialiser les catégories
    if (!localStorage.getItem('data_categories')) {
      localStorage.setItem('data_categories', JSON.stringify(INITIAL_DATA.categories))
    }
  }

  // CRUD Générique
  private getCollection(key: string): any[] {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private saveCollection(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  getAll(key: string): any[] {
    return this.getCollection(key)
  }

  getById(key: string, id: number): any | null {
    const collection = this.getCollection(key)
    return collection.find(item => item.id === id) || null
  }

  create(key: string, item: any): any {
    const collection = this.getCollection(key)
    const newItem = { ...item, id: Date.now(), createdAt: new Date().toISOString() }
    collection.unshift(newItem)
    this.saveCollection(key, collection)
    return newItem
  }

  update(key: string, id: number, updates: any): any | null {
    const collection = this.getCollection(key)
    const index = collection.findIndex(item => item.id === id)
    if (index === -1) return null
    collection[index] = { ...collection[index], ...updates, updatedAt: new Date().toISOString() }
    this.saveCollection(key, collection)
    return collection[index]
  }

  delete(key: string, id: number): boolean {
    const collection = this.getCollection(key)
    const filtered = collection.filter(item => item.id !== id)
    if (filtered.length === collection.length) return false
    this.saveCollection(key, filtered)
    return true
  }

  // Méthodes spécifiques
  getPlanteurs() { return this.getAll('data_planteurs') }
  getProduits() { return this.getAll('data_produits') }
  getCategories() { return this.getAll('data_categories') }
  getVentes() { return this.getAll('data_ventes') }
  getAchats() { return this.getAll('data_achats') }
  getOperations() { return this.getAll('data_operations') }
  getCampagnes() { return this.getAll('data_campagnes') }
  getLivraisons() { return this.getAll('data_livraisons') }
  getCredits() { return this.getAll('data_credits') }
  getReunions() { return this.getAll('data_reunions') }
  getCertifications() { return this.getAll('data_certifications') }
  getCotisations() { return this.getAll('data_cotisations') }

  // Stats dashboard
  getStats() {
    const planteurs = this.getPlanteurs()
    const produits = this.getProduits()
    const ventes = this.getVentes()
    const achats = this.getAchats()
    const operations = this.getOperations()
    
    const debutMois = new Date()
    debutMois.setDate(1)
    debutMois.setHours(0, 0, 0, 0)
    
    const ventesMois = ventes
      .filter((v: any) => new Date(v.dateVente) >= debutMois && v.statut === 'VALIDEE')
      .reduce((s: number, v: any) => s + v.montantTotal, 0)
    
    const achatsMois = achats
      .filter((a: any) => new Date(a.dateAchat) >= debutMois && a.statut === 'VALIDEE')
      .reduce((s: number, a: any) => s + a.montantTotal, 0)

    const solde = operations.reduce((s: number, o: any) => s + (o.type === 'ENTREE' ? o.montant : -o.montant), 0)

    return {
      totalPlanteurs: planteurs.length,
      totalProduits: produits.length,
      ventesMois,
      achatsMois,
      soldeCaisse: solde,
      creditsActifs: this.getCredits().filter((c: any) => c.statut === 'Actif').length,
      campagnesEnCours: this.getCampagnes().filter((c: any) => c.statut === 'En cours').length,
    }
  }
}

export const dataService = DataService.getInstance()
export default dataService
