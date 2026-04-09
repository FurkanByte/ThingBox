'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProject(id: string, name: string, details: string) {
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
