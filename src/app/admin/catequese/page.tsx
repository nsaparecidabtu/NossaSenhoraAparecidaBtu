// src/app/admin/catequese/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminCatechismClient } from './AdminCatechismClient'

export default async function AdminCatechismPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_CATECHISM'))

  if (!canManage) redirect('/')

  const [students, attendances] = await Promise.all([
    prisma.catechismStudent.findMany({ orderBy: [{ className: 'asc' }, { name: 'asc' }] }),
    prisma.catechismAttendance.findMany({
      orderBy: { attendedAt: 'desc' },
      take: 200,
    }),
  ])

  return <AdminCatechismClient students={students} attendances={attendances} />
}