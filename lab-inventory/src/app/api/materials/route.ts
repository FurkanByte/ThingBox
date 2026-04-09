import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      include: {
        category: true,
        defaultLoc: true,
        stocks: {
          include: { project: true }
        }
      }
    })
    return NextResponse.json(materials)
  } catch (error) {
    return NextResponse.json({ error: 'Malzemeler getirilirken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, defaultLocId, categoryId, initialQuantity } = body

    if (!name) return NextResponse.json({ error: 'Malzeme adı zorunludur.' }, { status: 400 })

    const material = await prisma.material.create({
      data: {
        name,
        description,
        defaultLocId: defaultLocId || null,
        categoryId: categoryId || null,
        stocks: initialQuantity ? {
          create: {
            quantity: Number(initialQuantity),
            status: 'DEPODA'
          }
        } : undefined
      },
      include: { stocks: true }
    })

    await prisma.auditLog.create({
      data: {
        action: 'MATERIAL_CREATED',
        targetId: material.id,
        targetType: 'MATERIAL',
        details: `${name} adlı malzeme ${initialQuantity ? initialQuantity + ' adet ile ' : ''}sisteme eklendi.`
      }
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Malzeme eklenirken hata oluştu.' }, { status: 500 })
  }
}
