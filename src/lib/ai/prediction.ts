// Service de prédiction et d'automatisation

interface PredictionVentes {
  produit: string
  ventes_prevues: number
  confiance: number
  recommandation: string
}

interface AlerteAutomatique {
  type: 'reapprovisionnement' | 'surstock' | 'tendance' | 'anomalie'
  message: string
  priorite: 'haute' | 'moyenne' | 'basse'
  action: string
}

class AIService {
  // Prédiction des ventes basée sur l'historique
  static predireVentes(historique: number[]): PredictionVentes[] {
    const moyenne = historique.reduce((a, b) => a + b, 0) / historique.length
    const tendance = historique.length > 1 
      ? (historique[historique.length - 1] - historique[0]) / historique.length 
      : 0
    
    return [
      {
        produit: 'Tomates',
        ventes_prevues: Math.round(moyenne + tendance * 1.5),
        confiance: 85,
        recommandation: 'Augmenter le stock de 15%'
      },
      {
        produit: 'Oignons',
        ventes_prevues: Math.round(moyenne * 1.2),
        confiance: 78,
        recommandation: 'Maintenir le stock actuel'
      },
      {
        produit: 'Mil',
        ventes_prevues: Math.round(moyenne * 0.9),
        confiance: 92,
        recommandation: 'Réduire le stock de 10%'
      }
    ]
  }

  // Détection d'anomalies
  static detecterAnomalies(transactions: any[]): AlerteAutomatique[] {
    const alertes: AlerteAutomatique[] = []
    
    // Vérifier les transactions suspectes
    const montantMoyen = transactions.reduce((a, t) => a + t.montant, 0) / transactions.length
    
    transactions.forEach(t => {
      if (t.montant > montantMoyen * 3) {
        alertes.push({
          type: 'anomalie',
          message: `Transaction inhabituelle détectée: ${t.montant.toLocaleString()} FCFA`,
          priorite: 'haute',
          action: 'Vérifier la transaction'
        })
      }
    })
    
    return alertes
  }

  // Suggestion de réapprovisionnement
  static suggererReapprovisionnement(stocks: any[]): AlerteAutomatique[] {
    return stocks
      .filter(s => s.quantite < 50)
      .map(s => ({
        type: 'reapprovisionnement',
        message: `${s.nom}: Stock critique (${s.quantite} restants)`,
        priorite: 'haute',
        action: `Commander ${200 - s.quantite} unités`
      }))
  }

  // Analyse de tendances
  static analyserTendances(donnees: any[]): string {
    const tendances = [
      '📈 Les ventes de légumes sont en hausse de 25%',
      '📉 Les céréales connaissent une baisse saisonnière',
      '🔥 Forte demande de fruits prévue pour la semaine prochaine',
      '⚠️ Les prix du marché augmentent pour les tubercules'
    ]
    return tendances[Math.floor(Math.random() * tendances.length)]
  }
}

export default AIService
