import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les alertes de stock faible
    const stockFaible = await prisma.produit.findMany({
      where: { quantiteStock: { lt: 50 } },
      select: { nom: true, quantiteStock: true, uniteMesure: true }
    })

    const notifications: any[] = []

    // Alertes stock
    stockFaible.forEach(produit => {
      notifications.push({
        id: `stock-${produit.nom}`,
        type: 'alerte',
        titre: '⚠️ Stock faible',
        message: `${produit.nom} : ${produit.quantiteStock} ${produit.uniteMesure} restant(s)`,
        date: new Date().toISOString(),
        lu: false,
        lien: '/dashboard/stock-avance'
      })
    })

    // Dernières ventes
    const dernieresVentes = await prisma.vente.findMany({
      take: 5,
      orderBy: { dateVente: 'desc' },
      include: { membre: { select: { prenom: true, nom: true } } }
    })

    dernieresVentes.forEach(vente => {
      notifications.push({
        id: `vente-${vente.id}`,
        type: 'succes',
        titre: '💰 Nouvelle vente',
        message: `${vente.montantTotal.toLocaleString()} FCFA - ${vente.membre.prenom} ${vente.membre.nom}`,
        date: vente.dateVente.toISOString(),
        lu: false,
        lien: '/dashboard/ventes'
      })
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
