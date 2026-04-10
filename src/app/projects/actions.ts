'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function updateProject(id: string, name: string, details: string) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
  await prisma.project.update({
    where: { id },
    data: { name, details: details || null }
  })
  
  await prisma.auditLog.create({
    data: {
      action: 'PROJECT_UPDATED',
      targetId: id,
      targetType: 'PROJECT',
      details: `${name} projesi başarıyla güncellendi.`
    }
  })

  revalidatePath('/projects')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
  const project = await prisma.project.findUnique({ where: { id } })
  // Return all KULLANIMDA stocks to depot before deleting
  const activeStocks = await prisma.materialStock.findMany({
    where: { projectId: id, status: 'KULLANIMDA' }
  })
  for (const stock of activeStocks) {
    const depotStock = await prisma.materialStock.findFirst({
      where: { materialId: stock.materialId, status: 'DEPODA' }
    })
    if (depotStock) {
      await prisma.materialStock.update({ where: { id: depotStock.id }, data: { quantity: depotStock.quantity + stock.quantity } })
      await prisma.materialStock.delete({ where: { id: stock.id } })
    } else {
      await prisma.materialStock.update({ where: { id: stock.id }, data: { status: 'DEPODA', projectId: null } })
    }
  }
  await prisma.project.delete({ where: { id } })
  await prisma.auditLog.create({
    data: { action: 'PROJECT_DELETED', targetId: id, targetType: 'PROJECT', details: `${project?.name || id} projesi silindi, aktif stoklar depoya iade edildi.` }
  })
  revalidatePath('/projects')
  revalidatePath('/materials')
  revalidatePath('/')
}
