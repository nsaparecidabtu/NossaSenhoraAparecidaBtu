// src/app/admin/pedidos/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LivePrayersDashboard } from './LivePrayersDashboard'

export default async function AdminPrayersPage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  // Verifica se tem permissão (Super Admin ou permissão específica)
  const hasAccess = 
    session.user.staffRole === 'SUPER_ADMIN' || 
    session.user.permissions?.includes('VIEW_PRAYER_REQUESTS')

  if (!hasAccess) redirect('/admin')

  // Busca os pedidos das últimas 24 horas (focados na live atual)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const recentPrayers = await prisma.contactRequest.findMany({
    where: { 
      type: 'PRAYER',
      createdAt: { gte: yesterday },
      status: { not: 'RESOLVED' } // Oculta os já arquivados
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 text-navy font-body">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Monitor de Intenções (Ao Vivo)</h1>
          <p className="mt-1 text-sm text-navy/60">
            Acompanhe em tempo real os pedidos enviados pelos fiéis durante a transmissão. 
            Esta página se atualiza automaticamente.
          </p>
        </div>

        <LivePrayersDashboard initialPrayers={recentPrayers} />
      </div>
    </main>
  )
}