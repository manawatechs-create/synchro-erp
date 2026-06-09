import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'
import { hashPassword, generateToken } from '../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, adresse, motDePasse } = body

    if (!email || !motDePasse || !nom || !prenom) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.membre.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

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

    const hashedPassword = await hashPassword(motDePasse)

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
    console.error('Erreur inscription:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
