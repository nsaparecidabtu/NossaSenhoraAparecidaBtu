// src/app/admin/horarios/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminMassScheduleClient } from './AdminMassScheduleClient'

export default async function AdminMassSchedulePage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_MASS_SCHEDULE'))

  if (!canManage) redirect('/')

  const schedules = await prisma.massSchedule.findMany({ orderBy: { order: 'asc' } })

  return <AdminMassScheduleClient schedules={schedules} />
}