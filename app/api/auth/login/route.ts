import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'cooperative_secret_key_2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, motDePasse } = body

    console.log('Tentative de connexion:', email)

    const membre = await prisma.membre.findUnique({
      where: { email: email }
    })

    if (!membre) {
      console.log('Utilisateur non trouvé:', email)
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    const valid = await bcrypt.compare(motDePasse, membre.motDePasse)
    
    if (!valid) {
      console.log('Mot de passe incorrect pour:', email)
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: membre.id, role: membre.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('Connexion réussie:', email)

    return NextResponse.json({
      message: 'Connexion réussie',
      token: token,
      membre: {
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        role: membre.role,
        cooperativeId: membre.cooperativeId,
      }
    })

  } catch (error: any) {
    console.error('Erreur login:', error.message)
    return NextResponse.json({ 
      error: 'Erreur serveur: ' + error.message 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
