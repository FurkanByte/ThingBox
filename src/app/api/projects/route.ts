import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, details } = body

    if (!name) return NextResponse.json({ error: 'Proje adı zorunludur.' }, { status: 400 })

    const project = await prisma.project.create({
      data: { name, details: details || null }
    })

    await prisma.auditLog.create({
      data: {
        action: 'PROJECT_CREATED',
        targetId: project.id,
        targetType: 'PROJECT',
        details: `${name} adlı proje başlatıldı.`
      }
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Proje eklenirken hata oluştu.' }, { status: 500 })
  }
}
