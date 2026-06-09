import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const produit = await prisma.produit.update({
      where: { id: parseInt(params.id) },
      data: {
        nom: body.nom,
        description: body.description,
        prixUnitaire: parseFloat(body.prixUnitaire),
        quantiteStock: parseInt(body.quantiteStock),
        uniteMesure: body.uniteMesure,
        categorieId: parseInt(body.categorieId)
      },
      include: { categorie: true }
    })
    return NextResponse.json(produit)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.produit.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ message: 'Supprimé' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}
