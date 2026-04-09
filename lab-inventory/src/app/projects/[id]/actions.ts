'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function returnToDepot(stockId: string, quantity: number) {
  const stock = await prisma.materialStock.findUnique({ where: { id: stockId } })
  if (!stock || stock.status !== 'KULLANIMDA' || stock.quantity < quantity) throw new Error('Geçersiz işlem.')

  // Reduce current stock
  if (stock.quantity === quantity) {
    await prisma.materialStock.delete({ where: { id: stock.id } })
  } else {
    await prisma.materialStock.update({
      where: { id: stock.id },
      data: { quantity: stock.quantity - quantity }
    })
  }

  // Add to DEPODA
  const existingDepot = await prisma.materialStock.findFirst({
    where: { materialId: stock.materialId, status: 'DEPODA' }
  })

  if (existingDepot) {
    await prisma.materialStock.update({
      where: { id: existingDepot.id },
      data: { quantity: existingDepot.quantity + quantity }
    })
  } else {
    await prisma.materialStock.create({
      data: { materialId: stock.materialId, quantity, status: 'DEPODA' }
    })
  }

  await prisma.auditLog.create({
    data: { action: 'MATERIAL_RETURNED', targetId: stock.materialId, targetType: 'MATERIAL', details: `${quantity} adet malzeme depoya geri döndü.` }
  })

  if (stock.projectId) {
    revalidatePath(`/projects/${stock.projectId}`)
  }
  revalidatePath('/materials')
  revalidatePath('/')
}

export async function consumeMaterial(stockId: string, quantity: number) {
  const stock = await prisma.materialStock.findUnique({ where: { id: stockId } })
  if (!stock || stock.status !== 'KULLANIMDA' || stock.quantity < quantity) throw new Error('Geçersiz işlem.')

  // Reduce current stock
  if (stock.quantity === quantity) {
    await prisma.materialStock.delete({ where: { id: stock.id } })
  } else {
    await prisma.materialStock.update({
      where: { id: stock.id },
      data: { quantity: stock.quantity - quantity }
    })
  }

  // Create TUKETILDI record
  await prisma.materialStock.create({
    data: { materialId: stock.materialId, projectId: stock.projectId, quantity, status: 'TUKETILDI' }
  })

  await prisma.auditLog.create({
    data: { action: 'MATERIAL_CONSUMED', targetId: stock.materialId, targetType: 'MATERIAL', details: `${quantity} adet malzeme projede kalıcı olarak sarf edildi.` }
  })

  if (stock.projectId) {
    revalidatePath(`/projects/${stock.projectId}`)
  }
  revalidatePath('/archive')
  revalidatePath('/')
}
