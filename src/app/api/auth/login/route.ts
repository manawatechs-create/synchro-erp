import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePasswords, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, motDePasse } = body

    if (!email || !motDePasse) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Rechercher l'utilisateur
    const membre = await prisma.membre.findUnique({
      where: { email },
      include: {
        cooperative: true
      }
    })

    if (!membre) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValidPassword = await comparePasswords(motDePasse, membre.motDePasse)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Générer le token
    const token = generateToken(membre.id, membre.role)

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      membre: {
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        telephone: membre.telephone,
        role: membre.role,
        cooperativeId: membre.cooperativeId,
        cooperative: membre.cooperative.nom
      }
    })

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
