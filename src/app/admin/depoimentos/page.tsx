// src/app/admin/depoimentos/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTestimonialsClient } from './AdminTestimonialsClient'

export default async function AdminTestimonialsPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_TESTIMONIALS'))

  if (!canManage) redirect('/')

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ approved: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { name: true, image: true } } },
  })

  return <AdminTestimonialsClient testimonials={testimonials} />
}