'use server'

import prisma from '@/lib/prisma'
import { createSession, hashPassword, comparePassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Kullanıcı adı ve şifre zorunludur' }
  }

  try {
    // Seed admin if no users exist
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      if (username === 'admin' && password === 'admin123') {
        const hashedPassword = await hashPassword('admin123')
        const admin = await prisma.user.create({
          data: {
            username: 'admin',
            passwordHash: hashedPassword,
            isAdmin: true,
            canViewInventory: true,
            canManageSystem: true,
            canAddStock: true,
            canDrawToProject: true,
            canConsume: true,
          }
        })
        await createSession({ id: admin.id, isAdmin: true, username: admin.username })
        return { success: true }
      }
      return { error: 'Sistemde hiç kullanıcı yok. Başlangıç için "admin / admin123" ile giriniz.' }
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { error: 'Geçersiz kullanıcı adı veya şifre' }
    }

    const isMatch = await comparePassword(password, user.passwordHash)
    if (!isMatch) {
      return { error: 'Geçersiz kullanıcı adı veya şifre' }
    }

    // Add permissions to session payload
    await createSession({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      canViewInventory: user.canViewInventory,
      canManageSystem: user.canManageSystem,
      canAddStock: user.canAddStock,
      canDrawToProject: user.canDrawToProject,
      canConsume: user.canConsume
    })

    return { success: true }
  } catch (error) {
    console.error('Login Error:', error)
    return { error: 'Giriş sırasında bir hata oluştu' }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    expires: new Date(0),
    path: '/',
  })
}
