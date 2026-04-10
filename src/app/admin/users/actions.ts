'use server'

import prisma from '@/lib/prisma'
import { hashPassword, getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Yetkisiz erişim' }

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  
  if (!username || !password) return { error: 'Kullanıcı adı ve şifre zorunludur' }

  try {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) return { error: 'Bu kullanıcı adı zaten alınmış' }

    const hashedPassword = await hashPassword(password)

    await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        canViewInventory: formData.get('canViewInventory') === 'on',
        canManageSystem: formData.get('canManageSystem') === 'on',
        canAddStock: formData.get('canAddStock') === 'on',
        canDrawToProject: formData.get('canDrawToProject') === 'on',
        canConsume: formData.get('canConsume') === 'on',
        isAdmin: false
      }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { error: 'Kullanıcı oluşturulurken hata oluştu' }
  }
}

export async function updatePermissions(userId: string, data: any) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Yetkisiz erişim' }

  try {
    // Prevent removing admin from oneself if trying
    if (session.id === userId && data.isAdmin === false) {
        return { error: 'Kendi admin yetkinizi kaldıramazsınız' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        canViewInventory: data.canViewInventory,
        canManageSystem: data.canManageSystem,
        canAddStock: data.canAddStock,
        canDrawToProject: data.canDrawToProject,
        canConsume: data.canConsume,
        isAdmin: data.isAdmin
      }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { error: 'Yetkiler güncellenemedi' }
  }
}

export async function deleteUser(userId: string) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Yetkisiz erişim' }

  if (session.id === userId) {
    return { error: 'Kendinizi silemezsiniz' }
  }

  try {
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { error: 'Kullanıcı silinemedi' }
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Yetkisiz erişim' }

  if (!newPassword || newPassword.length < 4) {
    return { error: 'Şifre en az 4 karakter olmalıdır' }
  }

  try {
    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    })
    return { success: true }
  } catch (error) {
    return { error: 'Şifre güncellenemedi' }
  }
}
