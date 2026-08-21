// src/app/admin/horarios/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminMassScheduleClient } from './AdminMassScheduleClient'
import { HelpHorariosTab } from './components/tabs/HelpHorariosTab'

const TABS = [
  { id: 'conteudo', label: 'Horários' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminMassSchedulePage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    
      session?.user?.permissions?.includes('MANAGE_MASS_SCHEDULE')

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const schedules = await prisma.massSchedule.findMany({ orderBy: { order: 'asc' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Horários de Missa</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Aparecem na home na ordem definida abaixo.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminMassScheduleClient schedules={schedules} />}
          {activeTab === 'ajuda' && <HelpHorariosTab />}
        </div>
      </div>
    </main>
  )
}
