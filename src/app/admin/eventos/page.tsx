// src/app/admin/eventos/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminEventsClient } from './AdminEventsClient'
import { HelpEventosTab } from './components/tabs/HelpEventosTab'

const TABS = [
  { id: 'conteudo', label: 'Eventos' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    
      session?.user?.permissions?.includes('MANAGE_EVENTS')

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Próximos Eventos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          A home mostra os 3 próximos eventos, ordenados por data.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminEventsClient events={events} />}
          {activeTab === 'ajuda' && <HelpEventosTab />}
        </div>
      </div>
    </main>
  )
}
