// Système de notifications
interface Notification {
  id: string
  type: 'alerte' | 'info' | 'succes' | 'rappel'
  titre: string
  message: string
  date: Date
  lu: boolean
  lien?: string
}

class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  ajouter(notification: Omit<Notification, 'id' | 'date' | 'lu'>) {
    const nouvelle: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      lu: false
    }
    this.notifications.unshift(nouvelle)
    this.sauvegarder()
    return nouvelle
  }

  getToutes(): Notification[] {
    return this.notifications
  }

  getNonLues(): Notification[] {
    return this.notifications.filter(n => !n.lu)
  }

  getCount(): number {
    return this.getNonLues().length
  }

  marquerLue(id: string) {
    const notif = this.notifications.find(n => n.id === id)
    if (notif) {
      notif.lu = true
      this.sauvegarder()
    }
  }

  toutMarquerLue() {
    this.notifications.forEach(n => n.lu = true)
    this.sauvegarder()
  }

  supprimer(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.sauvegarder()
  }

  // Notifications automatiques
  verifierStockFaible(produits: any[]) {
    produits.forEach(produit => {
      if (produit.quantiteStock < 50) {
        this.ajouter({
          type: 'alerte',
          titre: '⚠️ Stock faible',
          message: `${produit.nom} : seulement ${produit.quantiteStock} ${produit.uniteMesure} restant(s)`,
          lien: '/dashboard/stock-avance'
        })
      }
    })
  }

  nouvelleVente(montant: number, client: string) {
    this.ajouter({
      type: 'succes',
      titre: '💰 Nouvelle vente',
      message: `Vente de ${montant.toLocaleString()} FCFA - ${client}`,
      lien: '/dashboard/ventes'
    })
  }

  anniversaireMembre(nom: string) {
    this.ajouter({
      type: 'info',
      titre: '🎂 Anniversaire',
      message: `Aujourd'hui c'est l'anniversaire de ${nom} !`,
      lien: '/dashboard/membres'
    })
  }

  private sauvegarder() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(this.notifications))
    }
  }

  charger() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notifications')
      if (saved) {
        this.notifications = JSON.parse(saved)
      }
    }
  }
}

export const notificationService = NotificationService.getInstance()
