import logService from './logService'

class DataService {
  private get(key: string): any[] { 
    if (typeof window === 'undefined') return []; 
    const d = localStorage.getItem(key); 
    return d ? JSON.parse(d) : [] 
  }
  private save(key: string, data: any[]) { 
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)) 
  }
  
  init() {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('data_planteurs')) localStorage.setItem('data_planteurs', JSON.stringify([
      { id: 1, identifiant: 'PLT-2024-0001', nom: 'Diallo', prenom: 'Amadou', telephone: '+226 70 00 00 10', village: 'Koudougou', region: 'Centre-Ouest', typeCulture: 'Céréales', superficie: 5.5, statut: 'ACTIF', dateAdhesion: '2023-06-15' },
      { id: 2, identifiant: 'PLT-2024-0002', nom: 'Camara', prenom: 'Fatou', telephone: '+226 70 00 00 11', village: 'Réo', region: 'Centre-Ouest', typeCulture: 'Maraîchage', superficie: 2.3, statut: 'ACTIF', dateAdhesion: '2023-08-20' },
      { id: 3, identifiant: 'PLT-2024-0003', nom: 'Koné', prenom: 'Ibrahim', telephone: '+226 70 00 00 12', village: 'Sapouy', region: 'Centre-Ouest', typeCulture: 'Arboriculture', superficie: 8.0, statut: 'ACTIF', dateAdhesion: '2023-04-10' },
    ]))
    if (!localStorage.getItem('data_produits')) localStorage.setItem('data_produits', JSON.stringify([
      { id: 1, nom: 'Mil', prixUnitaire: 350, quantiteStock: 500, uniteMesure: 'kg', categorie: { nom: 'Céréales' } },
      { id: 2, nom: 'Maïs', prixUnitaire: 250, quantiteStock: 800, uniteMesure: 'kg', categorie: { nom: 'Céréales' } },
      { id: 3, nom: 'Tomates', prixUnitaire: 500, quantiteStock: 200, uniteMesure: 'kg', categorie: { nom: 'Légumes' } },
      { id: 4, nom: 'Oignons', prixUnitaire: 400, quantiteStock: 300, uniteMesure: 'kg', categorie: { nom: 'Légumes' } },
    ]))
  }
  
  getPlanteurs() { return this.get('data_planteurs') }
  getProduits() { return this.get('data_produits') }
  getVentes() { return this.get('data_ventes') }
  getAchats() { return this.get('data_achats') }
  getOperations() { return this.get('data_operations') }
  getCategories() { return this.get('data_categories') }
  getCampagnes() { return this.get('data_campagnes') }
  getLivraisons() { return this.get('data_livraisons') }
  getCredits() { return this.get('data_credits') }
  getReunions() { return this.get('data_reunions') }
  getCotisations() { return this.get('data_cotisations') }
  getAll(key: string) { return this.get(key) }
  
  // CRUD avec logs
  create(key: string, item: any, moduleName?: string) {
    const c = this.get(key)
    const newItem = { ...item, id: Date.now() }
    c.unshift(newItem)
    this.save(key, c)
    
    // Logger l'action
    const module = moduleName || key.replace('data_', '')
    logService.log('CREATE', module, item.nom || item.titre || item.motif || `ID:${newItem.id}`, JSON.stringify(item).substring(0, 200))
    
    return newItem
  }
  
  update(key: string, id: number, updates: any, moduleName?: string) {
    const c = this.get(key)
    const i = c.findIndex((x: any) => x.id === id)
    if (i > -1) { 
      const old = c[i]
      c[i] = { ...c[i], ...updates }
      this.save(key, c)
      
      const module = moduleName || key.replace('data_', '')
      logService.log('UPDATE', module, updates.nom || updates.titre || old.nom || old.titre || `ID:${id}`, JSON.stringify(updates).substring(0, 200))
    }
  }
  
  delete(key: string, id: number, moduleName?: string) {
    const c = this.get(key)
    const item = c.find((x: any) => x.id === id)
    this.save(key, c.filter((x: any) => x.id !== id))
    
    if (item) {
      const module = moduleName || key.replace('data_', '')
      logService.log('DELETE', module, item.nom || item.titre || item.motif || `ID:${id}`)
    }
  }
  
  getStats() {
    return {
      totalPlanteurs: this.getPlanteurs().length,
      totalProduits: this.getProduits().length,
      ventesMois: this.getVentes().reduce((s: number, v: any) => s + (v.montantTotal || 0), 0),
      soldeCaisse: this.getOperations().reduce((s: number, o: any) => s + (o.type === 'ENTREE' ? (o.montant || 0) : -(o.montant || 0)), 0),
    }
  }
}

export const dataService = new DataService()
export default dataService
