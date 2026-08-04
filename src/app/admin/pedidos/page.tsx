// src/app/admin/pedidos/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminRequestsClient } from "./AdminRequestsClient"

export default async function AdminRequestsPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('VIEW_PRAYER_REQUESTS'))

  if (!canManage) redirect('/')

  const requests = await prisma.contactRequest.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  return <AdminRequestsClient requests={requests} />
}