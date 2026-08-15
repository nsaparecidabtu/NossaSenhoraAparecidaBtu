// src/app/admin/depoimentos/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminTestimonialsClient } from './AdminTestimonialsClient'
import { HelpDepoimentosTab } from './components/tabs/HelpDepoimentosTab'

const TABS = [
  { id: 'conteudo', label: 'Depoimentos' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_TESTIMONIALS'))

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ approved: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { name: true, image: true } } },
  })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Depoimentos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Só entram no ar depois de aprovados aqui.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && (
            <AdminTestimonialsClient testimonials={testimonials} />
          )}
          {activeTab === 'ajuda' && <HelpDepoimentosTab />}
        </div>
      </div>
    </main>
  )
}
