'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function updateLocation(id: string, name: string) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
  await prisma.location.update({
    where: { id },
    data: { name }
  })
  
  await prisma.auditLog.create({
    data: {
      action: 'LOCATION_UPDATED',
      targetId: id,
      targetType: 'LOCATION',
      details: `Konum ismi ${name} olarak güncellendi.`
    }
  })

  revalidatePath('/locations')
  revalidatePath('/fixtures')
  revalidatePath('/materials')
}

export async function deleteLocation(id: string) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
  const loc = await prisma.location.findUnique({ where: { id } })
  await prisma.location.delete({ where: { id } })
  await prisma.auditLog.create({
    data: { action: 'LOCATION_DELETED', targetId: id, targetType: 'LOCATION', details: `${loc?.name || id} isimli konum silindi.` }
  })
  revalidatePath('/locations')
  revalidatePath('/fixtures')
  revalidatePath('/materials')
  revalidatePath('/')
}
