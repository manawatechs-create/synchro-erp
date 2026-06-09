import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET - Lister tous les produits
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const produits = await prisma.produit.findMany({
      include: {
        categorie: true,
        cooperative: {
          select: {
            nom: true
          }
        }
      },
      orderBy: { nom: 'asc' }
    })

    return NextResponse.json(produits)

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'GESTIONNAIRE')) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const body = await request.json()
    const { nom, description, prixUnitaire, quantiteStock, uniteMesure, categorieId } = body

    // Trouver la coopérative de l'utilisateur
    const membre = await prisma.membre.findUnique({
      where: { id: decoded.userId }
    })

    if (!membre) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const produit = await prisma.produit.create({
      data: {
        nom,
        description,
        prixUnitaire: parseFloat(prixUnitaire),
        quantiteStock: parseInt(quantiteStock) || 0,
        uniteMesure,
        categorieId: parseInt(categorieId),
        cooperativeId: membre.cooperativeId
      },
      include: {
        categorie: true
      }
    })

    // Créer un mouvement de stock initial
    if (produit.quantiteStock > 0) {
      await prisma.mouvementStock.create({
        data: {
          type: 'ENTREE',
          quantite: produit.quantiteStock,
          produitId: produit.id,
          reference: 'STOCK_INITIAL',
          notes: 'Stock initial'
        }
      })
    }

    return NextResponse.json(produit, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
