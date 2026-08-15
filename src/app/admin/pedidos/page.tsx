// src/app/admin/pedidos/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminRequestsClient } from './AdminRequestsClient'
import { HelpPedidosTab } from './components/tabs/HelpPedidosTab'

const TABS = [
  { id: 'conteudo', label: 'Pedidos' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminRequestsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect('/')

  const hasAccess =
    session.user.staffRole === 'SUPER_ADMIN' ||
    session.user.permissions?.includes('VIEW_PRAYER_REQUESTS')

  if (!hasAccess) redirect('/admin')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const rawRequests = await prisma.contactRequest.findMany({
    where: {
      type: {
        in: ['PRAYER_GENERAL', 'MASS_INTENTION', 'SACRAMENT', 'GENERAL_CONTACT'],
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const requests = rawRequests.map((req) => ({
    id: req.id,
    type: req.type as 'PRAYER_GENERAL' | 'MASS_INTENTION' | 'SACRAMENT' | 'GENERAL_CONTACT',
    name: req.name,
    contact: req.contact ?? 'Não informado',
    message: req.message,
    preferredDate: req.preferredDate,
    sacramentType: req.sacramentType,
    wantsPublicWall: req.wantsPublicWall ?? false,
    approvedForWall: req.approvedForWall,
    status: req.status as 'PENDING' | 'APPROVED' | 'RESOLVED',
    createdAt: req.createdAt,
  }))

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Pedidos Recebidos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Tudo que chega pelos formulários de contato da home.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminRequestsClient requests={requests} />}
          {activeTab === 'ajuda' && <HelpPedidosTab />}
        </div>
      </div>
    </main>
  )
}
