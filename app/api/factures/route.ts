import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'
import { generateNumeroFacture } from '../../lib/utils'

export async function GET(request: NextRequest) {
  try {
    const factures = await prisma.vente.findMany({
      include: {
        membre: {
          select: { nom: true, prenom: true, email: true, telephone: true }
        },
        produits: {
          include: {
            produit: true
          }
        }
      },
      orderBy: { dateVente: 'desc' },
      take: 50
    })

    const facturesFormatees = factures.map(f => ({
      id: f.id,
      numero: `FAC-${new Date(f.dateVente).getFullYear()}${String(new Date(f.dateVente).getMonth() + 1).padStart(2, '0')}-${String(f.id).padStart(4, '0')}`,
      date: f.dateVente,
      dateEcheance: new Date(new Date(f.dateVente).getTime() + 30 * 24 * 60 * 60 * 1000),
      client: {
        nom: `${f.membre.prenom} ${f.membre.nom}`,
        email: f.membre.email,
        telephone: f.membre.telephone
      },
      produits: f.produits.map(p => ({
        nom: p.produit.nom,
        quantite: p.quantite,
        unite: p.produit.uniteMesure,
        prixUnitaire: p.prixUnitaire,
        total: p.montant
      })),
      totalHT: f.montantTotal,
      tva: Math.round(f.montantTotal * 0.18),
      totalTTC: Math.round(f.montantTotal * 1.18),
      statut: f.statut
    }))

    return NextResponse.json(facturesFormatees)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
