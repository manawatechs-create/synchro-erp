import { NextRequest, NextResponse } from 'next/server'

const TAUX = {
  FCFA: { EUR: 0.001524, USD: 0.001657, FCFA: 1 },
  EUR: { FCFA: 655.957, USD: 1.087, EUR: 1 },
  USD: { FCFA: 603.5, EUR: 0.92, USD: 1 }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    taux: TAUX,
    date: new Date().toISOString(),
    source: 'Banque Centrale (simulé)'
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { montant, de, vers } = body
  
  if (!TAUX[de as keyof typeof TAUX] || !TAUX[vers as keyof typeof TAUX]) {
    return NextResponse.json({ error: 'Devise non supportée' }, { status: 400 })
  }
  
  const resultat = montant * TAUX[de as keyof typeof TAUX][vers as keyof typeof TAUX]
  
  return NextResponse.json({
    montant_original: montant,
    devise_originale: de,
    montant_converti: Math.round(resultat * 100) / 100,
    devise_cible: vers,
    taux: TAUX[de as keyof typeof TAUX][vers as keyof typeof TAUX]
  })
}
