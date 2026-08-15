// src/app/admin/liturgico/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminLiturgicoClient } from './AdminLiturgicoClient'
import { HelpLiturgicoTab } from './components/tabs/HelpLiturgicoTab'

const TABS = [
  { id: 'conteudo', label: 'Cores Litúrgicas' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminLiturgicoPage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_LITURGICAL_THEME'))

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const overrides = await prisma.liturgicalOverride.findMany({ orderBy: { startDate: 'desc' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Cores Litúrgicas Especiais</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Cadastre uma cor manual pra um período (ex: novena, tríduo, festa específica). Enquanto
          a data de hoje estiver dentro do período, essa cor tem prioridade sobre o cálculo
          automático (Advento, Quaresma, Festa da Padroeira, etc.).
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminLiturgicoClient overrides={overrides} />}
          {activeTab === 'ajuda' && <HelpLiturgicoTab />}
        </div>
      </div>
    </main>
  )
}
