import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UserClientPage from './UserClientPage'

export default async function UsersPage() {
  const session = await getSession()
  if (!session?.isAdmin) {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      username: true,
      isAdmin: true,
      canViewInventory: true,
      canManageSystem: true,
      canAddStock: true,
      canDrawToProject: true,
      canConsume: true,
      createdAt: true
    }
  })

  return <UserClientPage initialUsers={users} currentUserId={session.id} />
}
