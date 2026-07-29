// src/app/admin/ministerios/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminMinistriesClient } from './AdminMinistriesClient'

export default async function AdminMinistriesPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_MINISTRIES'))

  if (!canManage) redirect('/')

  const ministries = await prisma.ministry.findMany({ orderBy: { order: 'asc' } })

  return <AdminMinistriesClient ministries={ministries} />
}