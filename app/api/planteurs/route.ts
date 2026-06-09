import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const planteurs = await prisma.planteur.findMany({
      orderBy: { nom: 'asc' }
    })
    return NextResponse.json(planteurs)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const planteur = await prisma.planteur.create({
      data: {
        identifiant: body.identifiant,
        nom: body.nom,
        prenom: body.prenom,
        telephone: body.telephone,
        email: body.email || '',
        adresse: body.adresse || '',
        village: body.village,
        region: body.region || '',
        departement: body.departement || '',
        sexe: body.sexe || 'M',
        dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
        superficie: body.superficie || null,
        typeCulture: body.typeCulture || '',
        cooperativeId: 1
      }
    })
    return NextResponse.json(planteur, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}
