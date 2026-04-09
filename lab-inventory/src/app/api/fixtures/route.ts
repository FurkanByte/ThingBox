import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      include: { location: true, category: true }
    })
    return NextResponse.json(fixtures)
  } catch (error) {
    return NextResponse.json({ error: 'Demirbaşlar getirilirken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, locationId, categoryId } = body

    if (!name || !locationId) {
      return NextResponse.json({ error: 'Demirbaş adı ve konumu zorunludur.' }, { status: 400 })
    }

    const fixture = await prisma.fixture.create({
      data: {
        name,
        description,
        locationId,
        categoryId: categoryId || null
      }
    })

    await prisma.auditLog.create({
      data: {
        action: 'FIXTURE_CREATED',
        targetId: fixture.id,
        targetType: 'FIXTURE',
        details: `${name} adlı demirbaş eklendi.`
      }
    })

    return NextResponse.json(fixture, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Demirbaş eklenirken hata oluştu.' }, { status: 500 })
  }
}
