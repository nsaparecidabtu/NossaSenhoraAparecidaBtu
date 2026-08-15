// src/app/admin/usuarios/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminUsersClient } from './AdminUsersClient'
import { HelpUsuariosTab } from './components/tabs/HelpUsuariosTab'

const TABS = [
  { id: 'conteudo', label: 'Usuários' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
    tab?: string
  }>
}

const MEMBERS_PAGE_SIZE = 10

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth()
  if (session?.user?.staffRole !== 'SUPER_ADMIN') redirect('/')

  const { q = '', page = '1', tab } = await searchParams
  const activeTab = tab || 'conteudo'
  const currentPage = Math.max(1, parseInt(page, 10))

  const userSelect = {
    id: true,
    name: true,
    email: true,
    image: true,
    staffRole: true,
    permissions: true,
    createdAt: true,
  } as const

  // Equipe do painel (Super Admin, Líder de Ministério, Staff) — sempre carregada inteira,
  // sem paginação: em geral são poucas dezenas de pessoas e é justamente quem precisa de
  // visão rápida de "quem pode mexer em quê".
  const staffUsersPromise = prisma.user.findMany({
    where: { staffRole: { not: null } },
    orderBy: [{ staffRole: 'asc' }, { name: 'asc' }],
    select: userSelect,
  })

  // Fiéis com login mas sem papel no painel — lista que cresce muito, por isso continua
  // com busca + paginação como já era antes.
  const membersWhere = {
    staffRole: null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [staffUsers, members, memberCount, ministries] = await Promise.all([
    staffUsersPromise,
    prisma.user.findMany({
      where: membersWhere,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * MEMBERS_PAGE_SIZE,
      take: MEMBERS_PAGE_SIZE,
      select: userSelect,
    }),
    prisma.user.count({ where: membersWhere }),
    prisma.ministry.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(memberCount / MEMBERS_PAGE_SIZE)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Usuários e Permissões</h1>
        <p className="mt-1 text-sm text-navy/60">
          {staffUsers.length} na equipe do painel · {memberCount} fiéis com login cadastrados.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && (
            <>
              <AdminUsersClient
                staffUsers={staffUsers}
                members={members}
                ministries={ministries}
                currentUserId={session.user.id}
              />

              <div className="mt-4">
                <form method="GET" className="flex gap-2">
                  <input type="hidden" name="tab" value="conteudo" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar fiel por nome ou e-mail..."
                    className="flex-1 rounded-lg border border-line bg-white px-4 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-gold hover:text-navy transition-colors"
                  >
                    Buscar
                  </button>
                </form>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs text-navy/60">
                      Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                      {currentPage > 1 && (
                        <Link
                          href={`/admin/usuarios?tab=conteudo&q=${q}&page=${currentPage - 1}`}
                          className="rounded border border-line px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/5"
                        >
                          Anterior
                        </Link>
                      )}
                      {currentPage < totalPages && (
                        <Link
                          href={`/admin/usuarios?tab=conteudo&q=${q}&page=${currentPage + 1}`}
                          className="rounded border border-line px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/5"
                        >
                          Próxima
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'ajuda' && <HelpUsuariosTab />}
        </div>
      </div>
    </main>
  )
}
