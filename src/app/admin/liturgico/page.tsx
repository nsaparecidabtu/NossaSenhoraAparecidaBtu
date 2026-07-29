// src/app/admin/liturgico/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminLiturgicoClient } from './AdminLiturgicoClient'

export default async function AdminLiturgicoPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_LITURGICAL_THEME'))

  if (!canManage) redirect('/')

  const overrides = await prisma.liturgicalOverride.findMany({ orderBy: { startDate: 'desc' } })

  return <AdminLiturgicoClient overrides={overrides} />
}