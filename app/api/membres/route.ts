import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    const membres = await prisma.membre.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
        dateAdhesion: true
      },
      orderBy: { nom: 'asc' }
    })
    return NextResponse.json(membres)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(body.motDePasse || 'membre2024', 10)
    
    const membre = await prisma.membre.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        telephone: body.telephone || '',
        adresse: body.adresse || '',
        motDePasse: hashedPassword,
        cooperativeId: 1,
        role: body.role || 'MEMBRE'
      }
    })
    return NextResponse.json(membre, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}
