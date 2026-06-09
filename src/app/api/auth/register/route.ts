import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, adresse, motDePasse } = body

    // Validation basique
    if (!email || !motDePasse || !nom || !prenom) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.membre.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Trouver ou créer une coopérative par défaut
    let cooperative = await prisma.cooperative.findFirst()
    
    if (!cooperative) {
      cooperative = await prisma.cooperative.create({
        data: {
          nom: "Coopérative Agricole du Faso",
          adresse: "123 Rue de l'Agriculture, Ouagadougou",
          telephone: "+226 70 00 00 00",
          email: "contact@coop-agricole.bf"
        }
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(motDePasse)

    // Créer le membre
    const membre = await prisma.membre.create({
      data: {
        nom,
        prenom,
        email,
        telephone: telephone || '',
        adresse: adresse || '',
        motDePasse: hashedPassword,
        cooperativeId: cooperative.id,
        role: 'MEMBRE'
      }
    })

    // Générer le token
    const token = generateToken(membre.id, membre.role)

    return NextResponse.json({
      message: 'Inscription réussie',
      token,
      membre: {
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        role: membre.role,
        cooperativeId: membre.cooperativeId
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
