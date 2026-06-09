// Configuration des graphiques pour le dashboard analytique

export const chartColors = {
  primary: '#166534',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
}

export function generateChartData(period: string) {
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  
  return {
    ventes: {
      labels: mois,
      datasets: [
        {
          label: 'Ventes 2024',
          data: mois.map(() => Math.floor(Math.random() * 500000) + 100000),
          color: chartColors.primary,
        },
        {
          label: 'Ventes 2023',
          data: mois.map(() => Math.floor(Math.random() * 400000) + 80000),
          color: chartColors.secondary,
        }
      ]
    },
    produitsPopulaires: [
      { nom: 'Tomates', ventes: 450, pourcentage: 30, color: chartColors.danger },
      { nom: 'Oignons', ventes: 380, pourcentage: 25, color: chartColors.warning },
      { nom: 'Mil', ventes: 290, pourcentage: 19, color: chartColors.primary },
      { nom: 'Mangues', ventes: 220, pourcentage: 15, color: chartColors.success },
      { nom: 'Autres', ventes: 160, pourcentage: 11, color: chartColors.purple },
    ],
    repartitionVentes: {
      labels: ['Céréales', 'Légumes', 'Fruits', 'Tubercules', 'Légumineuses'],
      data: [35, 28, 20, 12, 5],
      colors: [chartColors.primary, chartColors.success, chartColors.warning, chartColors.purple, chartColors.pink]
    },
    evolution: {
      labels: mois,
      chiffreAffaires: mois.map(() => Math.floor(Math.random() * 800000) + 200000),
      benefices: mois.map(() => Math.floor(Math.random() * 300000) + 50000),
    },
    kpis: [
      { titre: 'Chiffre d\'Affaires', valeur: '2,450,000 FCFA', evolution: '+12%', positif: true },
      { titre: 'Panier Moyen', valeur: '45,000 FCFA', evolution: '+5%', positif: true },
      { titre: 'Taux de Conversion', valeur: '68%', evolution: '-3%', positif: false },
      { titre: 'Satisfaction Client', valeur: '4.8/5', evolution: '+0.2', positif: true },
    ]
  }
}

export function exportToCSV(data: any, filename: string) {
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  const headers = Object.keys(data[0])
  const rows = data.map(obj => headers.map(h => obj[h]).join(','))
  return [headers.join(','), ...rows].join('\n')
}
