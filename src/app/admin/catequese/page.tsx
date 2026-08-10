// src/app/admin/catequese/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminCatechismClient } from './AdminCatechismClient'

export const dynamic = 'force-dynamic'

export default async function AdminCatechismPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions?.includes('MANAGE_CATECHISM'))

  if (!canManage) redirect('/')

  const [openWeek, weeks, catechists, students] = await Promise.all([
    prisma.catechismWeek.findFirst({ where: { isOpen: true }, orderBy: { startsAt: 'desc' } }),
    prisma.catechismWeek.findMany({ orderBy: { startsAt: 'desc' }, take: 12 }),
    prisma.catechist.findMany({ orderBy: { name: 'asc' } }),
    prisma.catechismStudent.findMany({
      orderBy: { name: 'asc' },
      include: { catechist: { select: { name: true } } },
    }),
  ])

  const attendances = openWeek
    ? await prisma.catechismAttendance.findMany({
        where: { weekId: openWeek.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    // cast to any because AdminCatechismClient props are narrower in its declaration
    <AdminCatechismClient {...({ openWeek, weeks, catechists, students, attendances, baseUrl } as any)} />
  )
}