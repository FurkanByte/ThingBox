'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateFixture(id: string, name: string, description: string, locationId: string, categoryId: string | null) {
  await prisma.fixture.update({
    where: { id },
    data: { name, description, locationId, categoryId: categoryId || null }
  })
  
  await prisma.auditLog.create({
    data: {
      action: 'FIXTURE_UPDATED',
      targetId: id,
      targetType: 'FIXTURE',
      details: `${name} isimli demirbaşın detayları güncellendi.`
    }
  })

  revalidatePath('/fixtures')
  revalidatePath('/locations')
  revalidatePath('/')
}
