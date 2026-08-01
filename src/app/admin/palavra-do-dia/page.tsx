// src/app/admin/palavra-do-dia/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminDailyWordClient } from './AdminDailyWordClient'

export default async function AdminDailyWordPage() {
  const session = await auth()

  if (session?.user?.staffRole !== 'SUPER_ADMIN') {
    redirect('/')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayWord = await prisma.dailyWord.findFirst({
    where: { date: { gte: today } },
  })

  return <AdminDailyWordClient todayWord={todayWord} />
}