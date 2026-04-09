'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateLocation(id: string, name: string) {
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
