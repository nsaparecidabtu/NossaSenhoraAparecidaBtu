// src/app/admin/ministerios/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminMinistriesClient } from './AdminMinistriesClient'
import { HelpMinisteriosTab } from './components/tabs/HelpMinisteriosTab'

const TABS = [
  { id: 'conteudo', label: 'Ministérios' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminMinistriesPage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    
      session?.user?.permissions?.includes('MANAGE_MINISTRIES')

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const ministries = await prisma.ministry.findMany({ orderBy: { order: 'asc' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Pastorais e Ministérios</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Aparecem na home na ordem definida abaixo.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminMinistriesClient ministries={ministries} />}
          {activeTab === 'ajuda' && <HelpMinisteriosTab />}
        </div>
      </div>
    </main>
  )
}
