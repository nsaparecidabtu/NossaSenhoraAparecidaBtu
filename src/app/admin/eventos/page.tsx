// src/app/admin/eventos/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminEventsClient } from './AdminEventsClient'

export default async function AdminEventsPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_EVENTS'))

  if (!canManage) redirect('/')

  const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } })

  return <AdminEventsClient events={events} />
}