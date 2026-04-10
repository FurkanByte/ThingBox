import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    // Fetch categories with their nested children
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true
          }
        }
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Kategoriler getirilirken hata oluştu.' }, { status: 500 })
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
      return NextResponse.json({ error: 'Kategori adı zorunludur.' }, { status: 400 })
    }

    const newCategory = await prisma.category.create({
      data: { 
        name,
        parentId: parentId || null
      }
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Kategori oluşturulurken hata oluştu.' }, { status: 500 })
  }
}
