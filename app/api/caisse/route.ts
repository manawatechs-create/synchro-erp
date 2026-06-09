import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    const operations = await prisma.operationCaisse.findMany({
      orderBy: { dateOperation: 'desc' },
      take: 100
    })
    return NextResponse.json(operations)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const operation = await prisma.operationCaisse.create({
      data: {
        caisseId: 1,
        type: body.type,
        montant: body.montant,
        motif: body.motif,
        modePaiement: body.modePaiement,
        reference: body.reference,
        notes: body.notes
      }
    })
    return NextResponse.json(operation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}
