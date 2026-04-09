'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function useMaterial(materialId: string, quantity: number, projectId: string) {
  const availableStocks = await prisma.materialStock.findMany({
    where: { materialId, status: 'DEPODA' },
    orderBy: { quantity: 'desc' }
  })
  
  let needed = quantity
  for (const stock of availableStocks) {
    if (needed <= 0) break
    
    if (stock.quantity <= needed) {
      // Consume entire stock chunk
      await prisma.materialStock.update({
        where: { id: stock.id },
        data: { status: 'KULLANIMDA', projectId }
      })
      needed -= stock.quantity
    } else {
      // Split stock chunk
      await prisma.materialStock.update({
        where: { id: stock.id },
        data: { quantity: stock.quantity - needed }
      })
      await prisma.materialStock.create({
        data: {
          materialId,
          quantity: needed,
          status: 'KULLANIMDA',
          projectId
        }
      })
      needed = 0
    }
  }

  if (needed > 0) {
    throw new Error('Yeterli stok yok!')
  }

  await prisma.auditLog.create({
    data: {
      action: 'MATERIAL_USED',
      targetId: materialId,
      targetType: 'MATERIAL',
      details: `${quantity} adet malzeme projelere tahsis edildi.`
    }
  })

  revalidatePath('/materials')
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function addStock(materialId: string, quantity: number) {
  const existing = await prisma.materialStock.findFirst({
    where: { materialId, status: 'DEPODA' }
  })
  if (existing) {
    await prisma.materialStock.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    })
  } else {
    await prisma.materialStock.create({
      data: { materialId, quantity, status: 'DEPODA' }
    })
  }
  await prisma.auditLog.create({
    data: { action: 'STOCK_ADDED', targetId: materialId, targetType: 'MATERIAL', details: `${quantity} adet yeni stok depoya eklendi.` }
  })
  revalidatePath('/materials')
  revalidatePath('/')
}

export async function updateMaterial(id: string, name: string, description: string, defaultLocId: string | null, categoryId: string | null) {
  await prisma.material.update({
    where: { id },
    data: { name, description, defaultLocId: defaultLocId || null, categoryId: categoryId || null }
  })
  
  await prisma.auditLog.create({
    data: {
      action: 'MATERIAL_UPDATED',
      targetId: id,
      targetType: 'MATERIAL',
      details: `${name} isimli sarf malzemesinin detayları güncellendi.`
    }
  })

  revalidatePath('/materials')
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/locations')
}
