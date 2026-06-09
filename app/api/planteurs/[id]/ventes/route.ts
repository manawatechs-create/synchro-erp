import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ventes = await prisma.vente.findMany({
      where: { planteurId: parseInt(params.id) },
      include: { produits: { include: { produit: true } } },
      orderBy: { dateVente: 'desc' }
    })
    return NextResponse.json(ventes)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
