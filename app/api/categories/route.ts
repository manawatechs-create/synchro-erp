import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.categorieProduit.findMany({ orderBy: { nom: 'asc' } })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const categorie = await prisma.categorieProduit.create({ data: { nom: body.nom, description: body.description } })
    return NextResponse.json(categorie, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
