// src/app/admin/faq/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminFaqClient } from './AdminFaqClient'

export default async function AdminFaqPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_FAQ'))

  if (!canManage) redirect('/')

  const faqs = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } })

  return <AdminFaqClient faqs={faqs} />
}