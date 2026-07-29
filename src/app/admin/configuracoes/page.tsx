// src/app/admin/configuracoes/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminSettingsClient } from './AdminSettingsClient'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (session?.user?.staffRole !== 'SUPER_ADMIN') redirect('/')

  const settings = await prisma.parishSettings.findUnique({ where: { id: 'singleton' } })

  return <AdminSettingsClient settings={settings} />
}