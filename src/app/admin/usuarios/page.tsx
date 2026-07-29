// src/app/admin/usuarios/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminUsersClient } from './AdminUsersClient'

export default async function AdminUsersPage() {
  const session = await auth()

  if (session?.user?.staffRole !== 'SUPER_ADMIN') {
    redirect('/')
  }

  const [users, ministries] = await Promise.all([
    prisma.user.findMany({
      // Só existem usuários aqui depois que fazem login com Google pelo
      // menos uma vez (NextAuth cria o registro no primeiro login) — não
      // dá pra "convidar" alguém que nunca entrou no site.
      orderBy: [{ staffRole: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        staffRole: true,
        ministryId: true,
        permissions: true,
      },
    }),
    prisma.ministry.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ])

  return <AdminUsersClient users={users} ministries={ministries} currentUserId={session.user.id} />
}