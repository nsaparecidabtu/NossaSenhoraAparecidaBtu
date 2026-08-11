// src/app/admin/usuarios/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

  // Filtro de busca por nome ou email
  const whereClause = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  // Busca paginada no banco
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Usuários e Permissões</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Gerenciamento escalável de acessos à plataforma ({totalCount} usuários cadastrados).
        </p>

        {/* Barra de Pesquisa */}
        <form method="GET" className="mt-6 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou e-mail..."
            className="flex-1 rounded-lg border border-line bg-white px-4 py-2 font-body text-sm focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-gold hover:text-navy"
          >
            Buscar
          </button>
        </form>

        {/* Lista de Usuários */}
        <div className="mt-6 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ''} className="h-10 w-10 rounded-full border border-line" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-cream font-bold">
                    {user.name?.[0] ?? 'U'}
                  </div>
                )}
                <div>
                  <p className="font-body text-sm font-semibold text-navy">{user.name || 'Sem nome'}</p>
                  <p className="font-body text-xs text-navy/60">{user.email}</p>
                  <span className="mt-1 inline-block rounded bg-navy/5 px-2 py-0.5 font-mono text-[10px] uppercase text-navy/70">
                    {user.staffRole || 'Sem acesso administrativo'}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/usuarios/${user.id}`}
                className="rounded border border-line px-3 py-1.5 font-body text-xs font-semibold text-navy transition-colors hover:border-gold hover:bg-navy/5"
              >
                Editar acesso
              </Link>
            </div>
          ))}

          {users.length === 0 && (
            <p className="py-8 text-center font-body text-sm text-navy/40">Nenhum usuário encontrado.</p>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="font-body text-xs text-navy/60">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/usuarios?q=${q}&page=${currentPage - 1}`}
                  className="rounded border border-line px-3 py-1 font-body text-xs font-semibold text-navy hover:bg-navy/5"
                >
                  Anterior
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/usuarios?q=${q}&page=${currentPage + 1}`}
                  className="rounded border border-line px-3 py-1 font-body text-xs font-semibold text-navy hover:bg-navy/5"
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