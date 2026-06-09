import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    const produits = await prisma.produit.findMany({
      include: { categorie: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(produits)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const produit = await prisma.produit.create({
      data: {
        nom: body.nom,
        description: body.description || '',
        prixUnitaire: parseFloat(body.prixUnitaire),
        quantiteStock: parseInt(body.quantiteStock),
        uniteMesure: body.uniteMesure || 'kg',
        categorieId: parseInt(body.categorieId),
        cooperativeId: 1
      },
      include: { categorie: true }
    })
    return NextResponse.json(produit, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}
