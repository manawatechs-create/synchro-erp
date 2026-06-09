import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const achats = await prisma.achat.findMany({
      include: {
        membre: { select: { prenom: true, nom: true } },
        produits: { include: { produit: true } }
      },
      orderBy: { dateAchat: 'desc' }
    })
    return NextResponse.json(achats)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const achat = await prisma.achat.create({
      data: {
        membreId: body.membreId,
        cooperativeId: 1,
        montantTotal: body.montantTotal,
        notes: body.notes,
        produits: {
          create: body.produits.map((p: any) => ({
            produitId: p.produitId,
            quantite: p.quantite,
            prixUnitaire: p.prixUnitaire,
            montant: p.montant
          }))
        }
      },
      include: {
        membre: { select: { prenom: true, nom: true } },
        produits: { include: { produit: true } }
      }
    })

    // Augmenter les stocks
    for (const p of body.produits) {
      await prisma.produit.update({
        where: { id: p.produitId },
        data: { quantiteStock: { increment: p.quantite } }
      })
    }

    return NextResponse.json(achat, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}
