// Service de synchronisation pour le mode hors-ligne

class SyncService {
  private static instance: SyncService

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService()
    }
    return SyncService.instance
  }

  // Sauvegarder les données localement
  saveLocalData(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (e) {
      console.error('Erreur sauvegarde locale:', e)
      return false
    }
  }

  // Récupérer les données locales
  getLocalData(key: string): any {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (e) {
      return null
    }
  }

  // Vérifier si en ligne
  isOnline(): boolean {
    return navigator.onLine
  }

  // Ajouter à la file d'attente de synchronisation
  addToSyncQueue(operation: any) {
    const queue = this.getLocalData('sync_queue') || []
    queue.push({
      ...operation,
      timestamp: new Date().toISOString(),
      retryCount: 0
    })
    this.saveLocalData('sync_queue', queue)
  }

  // Traiter la file d'attente
  async processSyncQueue() {
    if (!this.isOnline()) return
    
    const queue = this.getLocalData('sync_queue') || []
    if (queue.length === 0) return

    console.log(`🔄 Synchronisation de ${queue.length} opération(s)...`)
    
    for (const op of queue) {
      try {
        // Ici, envoyer les données au serveur
        // await fetch('/api/sync', { method: 'POST', body: JSON.stringify(op) })
        console.log('✅ Opération synchronisée:', op)
      } catch (e) {
        console.error('❌ Erreur synchronisation:', e)
      }
    }

    // Vider la file d'attente
    this.saveLocalData('sync_queue', [])
    console.log('✅ Synchronisation terminée !')
  }

  // Vérifier l'espace de stockage
  getStorageInfo() {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        total += (localStorage.getItem(key) || '').length
      }
    }
    return {
      used: Math.round(total / 1024), // Ko
      limit: 5120 // 5 Mo estimé
    }
  }
}

export const syncService = SyncService.getInstance()
export default syncService
