// src/app/admin/palavra-do-dia/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminDailyWordClient } from './AdminDailyWordClient'
import { HelpPalavraDoDiaTab } from './components/tabs/HelpPalavraDoDiaTab'

const TABS = [
  { id: 'conteudo', label: 'Palavra do Dia' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminDailyWordPage({ searchParams }: PageProps) {
  const session = await auth()

  if (session?.user?.staffRole !== 'SUPER_ADMIN') {
    redirect('/')
  }

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayWord = await prisma.dailyWord.findFirst({
    where: { date: { gte: today } },
  })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Palavra do Dia</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Todo dia às 6h o Gemini gera uma automaticamente. Aqui você pode gerar de novo, colar
          um Reels do Instagram, ou escrever a sua própria — o que for salvo por último fica no ar.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminDailyWordClient todayWord={todayWord} />}
          {activeTab === 'ajuda' && <HelpPalavraDoDiaTab />}
        </div>
      </div>
    </main>
  )
}
