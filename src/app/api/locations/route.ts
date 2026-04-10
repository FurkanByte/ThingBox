import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: { fixtures: true, materials: true }
        }
      }
    })
    return NextResponse.json(locations)
  } catch (error) {
    return NextResponse.json({ error: 'Konumlar getirilirken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.canManageSystem && !session?.isAdmin) {
      return NextResponse.json({ error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const body = await request.json()
    const { name, parentId } = body

    if (!name) {
      return NextResponse.json({ error: 'Konum adı zorunludur.' }, { status: 400 })
    }

    const newLocation = await prisma.location.create({
      data: { name, parentId }
    })

    await prisma.auditLog.create({
      data: {
        action: 'LOCATION_CREATED',
        targetId: newLocation.id,
        targetType: 'LOCATION',
        details: `${name} adında yeni konum oluşturuldu.`
      }
    })

    return NextResponse.json(newLocation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Konum eklenirken hata oluştu.' }, { status: 500 })
  }
}
