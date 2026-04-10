'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function updateFixture(id: string, name: string, description: string, locationId: string, categoryId: string | null) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
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

export async function deleteFixture(id: string) {
  const session = await getSession()
  if (!session?.canManageSystem && !session?.isAdmin) throw new Error('Bu işlem için yetkiniz yok.')
  const fixture = await prisma.fixture.findUnique({ where: { id } })
  await prisma.fixture.delete({ where: { id } })
  await prisma.auditLog.create({
    data: { action: 'FIXTURE_DELETED', targetId: id, targetType: 'FIXTURE', details: `${fixture?.name || id} isimli demirbaş silindi.` }
  })
  revalidatePath('/fixtures')
  revalidatePath('/locations')
  revalidatePath('/')
}
