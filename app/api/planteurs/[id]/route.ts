import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planteur = await prisma.planteur.findUnique({
      where: { id: parseInt(params.id) }
    })
    if (!planteur) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(planteur)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const planteur = await prisma.planteur.update({
      where: { id: parseInt(params.id) },
      data: body
    })
    return NextResponse.json(planteur)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.planteur.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ message: 'Supprimé' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}
