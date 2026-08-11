// src/app/admin/configuracoes/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminSettingsClient } from './AdminSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (session?.user?.staffRole !== 'SUPER_ADMIN') redirect('/')

  // Buscamos em paralelo as configurações gerais e os contatos dinâmicos do rodapé
  const [settings, contacts] = await Promise.all([
    prisma.parishSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.siteContact.findMany({ orderBy: { createdAt: 'asc' } }),
  ])

  return <AdminSettingsClient settings={settings} contacts={contacts} />
}