import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, motDePasse } = body
    
    // Authentification simplifiée pour le déploiement
    if (email === 'admin@coop.com' && motDePasse === 'admin2024') {
      return NextResponse.json({
        token: 'demo-token-2026',
        membre: { id: 1, nom: 'Admin', prenom: 'Principal', email: 'admin@coop.com', role: 'ADMIN' }
      })
    }
    
    if (email === 'gestionnaire@coop.com' && motDePasse === 'gest2024') {
      return NextResponse.json({
        token: 'demo-token-2026',
        membre: { id: 2, nom: 'Gestionnaire', prenom: 'Coop', email: 'gestionnaire@coop.com', role: 'GESTIONNAIRE' }
      })
    }
    
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
