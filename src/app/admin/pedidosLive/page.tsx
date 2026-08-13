// src/app/admin/pedidosLive/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LivePrayersDashboard, type Prayer } from './LivePrayersDashboard'

export default async function AdminPrayersLivePage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  const hasAccess = 
    session.user.staffRole === 'SUPER_ADMIN' || 
    session.user.permissions?.includes('VIEW_PRAYER_REQUESTS')

  if (!hasAccess) redirect('/admin')

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const rawPrayers = await prisma.contactRequest.findMany({
    where: { 
      type: 'PRAYER',
      createdAt: { gte: yesterday }
    },
    orderBy: { createdAt: 'desc' },
  })

  // DTO sanitizado e compativel com o contrato do LivePrayersDashboard
  const formattedPrayers: Prayer[] = rawPrayers.map((p) => ({
    id: p.id,
    name: p.name,
    message: p.message,
    contact: p.contact ?? '',
    approvedForWall: p.approvedForWall,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 text-navy font-body">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Monitor de Intenções (Ao Vivo)</h1>
          <p className="mt-1 text-sm text-navy/60">
            Controle de exibição no mural e moderação de pedidos em tempo real durante as transmissões.
          </p>
        </div>

        <LivePrayersDashboard initialPrayers={formattedPrayers} />
      </div>
    </main>
  )
}