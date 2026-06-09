import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'general'
    const debut = searchParams.get('debut') 
    const fin = searchParams.get('fin')

    const dateDebut = debut ? new Date(debut) : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const dateFin = fin ? new Date(fin) : new Date()

    switch(type) {
      case 'ventes': {
        const ventes = await prisma.vente.findMany({
          where: {
            dateVente: { gte: dateDebut, lte: dateFin },
            statut: 'VALIDEE'
          },
          include: {
            membre: { select: { prenom: true, nom: true } },
            produits: { include: { produit: true } }
          },
          orderBy: { dateVente: 'desc' }
        })

        const total = ventes.reduce((sum, v) => sum + v.montantTotal, 0)
        const nombreVentes = ventes.length
        const panierMoyen = nombreVentes > 0 ? total / nombreVentes : 0

        return NextResponse.json({
          periode: { debut: dateDebut, fin: dateFin },
          resume: { total, nombreVentes, panierMoyen },
          ventes
        })
      }

      case 'benefices': {
        const ventes = await prisma.vente.aggregate({
          _sum: { montantTotal: true },
          where: { dateVente: { gte: dateDebut, lte: dateFin }, statut: 'VALIDEE' }
        })
        const achats = await prisma.achat.aggregate({
          _sum: { montantTotal: true },
          where: { dateAchat: { gte: dateDebut, lte: dateFin }, statut: 'VALIDEE' }
        })

        const totalVentes = ventes._sum.montantTotal || 0
        const totalAchats = achats._sum.montantTotal || 0
        const benefice = totalVentes - totalAchats
        const marge = totalVentes > 0 ? (benefice / totalVentes) * 100 : 0

        return NextResponse.json({
          periode: { debut: dateDebut, fin: dateFin },
          totalVentes,
          totalAchats,
          benefice,
          marge: Math.round(marge * 100) / 100
        })
      }

      case 'stock': {
        const produits = await prisma.produit.findMany({
          include: { categorie: true },
          orderBy: { quantiteStock: 'asc' }
        })

        const valeurStock = produits.reduce((sum, p) => sum + (p.prixUnitaire * p.quantiteStock), 0)
        const stockFaible = produits.filter(p => p.quantiteStock < 50).length
        const rupture = produits.filter(p => p.quantiteStock === 0).length

        return NextResponse.json({
          totalProduits: produits.length,
          valeurStock,
          stockFaible,
          rupture,
          produits
        })
      }

      default: {
        const [totalMembres, totalProduits, totalVentes, totalAchats] = await Promise.all([
          prisma.membre.count(),
          prisma.produit.count(),
          prisma.vente.count(),
          prisma.achat.count()
        ])

        return NextResponse.json({
          general: { totalMembres, totalProduits, totalVentes, totalAchats }
        })
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
