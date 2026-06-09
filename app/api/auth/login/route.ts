import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, motDePasse } = body

  const users: Record<string, any> = {
    'admin@coop.com': { id: 1, nom: 'Admin', prenom: 'Principal', email: 'admin@coop.com', role: 'ADMIN', cooperativeId: 1 },
    'gestionnaire@coop.com': { id: 2, nom: 'Gestionnaire', prenom: 'Coopérative', email: 'gestionnaire@coop.com', role: 'GESTIONNAIRE', cooperativeId: 1 },
    'membre@coop.com': { id: 3, nom: 'Membre', prenom: 'Actif', email: 'membre@coop.com', role: 'MEMBRE', cooperativeId: 1 },
  }
  const passwords: Record<string, string> = {
    'admin@coop.com': 'admin2024',
    'gestionnaire@coop.com': 'gest2024',
    'membre@coop.com': 'membre2024'
  }

  if (users[email] && passwords[email] === motDePasse) {
    return NextResponse.json({ token: 'token-' + Date.now(), membre: users[email] })
  }
  return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
}
