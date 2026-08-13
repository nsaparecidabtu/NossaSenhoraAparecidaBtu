import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminUsersClient } from './AdminUsersClient'

type PageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth()
  if (session?.user?.staffRole !== 'SUPER_ADMIN') redirect('/')

  const { q = '', page = '1' } = await searchParams
  const pageSize = 10
  const currentPage = Math.max(1, parseInt(page, 10))

  const whereClause = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, totalCount, ministries] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        staffRole: true,
        permissions: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: whereClause }),
    prisma.ministry.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy font-body">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Usuários e Permissões</h1>
        <p className="mt-1 text-sm text-navy/60">
          Gerenciamento de acessos à plataforma ({totalCount} usuários cadastrados).
        </p>

        <form method="GET" className="mt-6 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou e-mail..."
            className="flex-1 rounded-lg border border-line bg-white px-4 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-gold hover:text-navy transition-colors"
          >
            Buscar
          </button>
        </form>

        <AdminUsersClient
          users={users}
          ministries={ministries}
          currentUserId={session.user.id}
        />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-navy/60">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/usuarios?q=${q}&page=${currentPage - 1}`}
                  className="rounded border border-line px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/5"
                >
                  Anterior
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/usuarios?q=${q}&page=${currentPage + 1}`}
                  className="rounded border border-line px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/5"
                >
                  Próxima
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}