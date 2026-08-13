// src/app/admin/ao-vivo/ChannelsManager.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ChannelsManager } from './ChannelsManager'
import { LiveStreamAdminForm } from './LiveStreamAdminForm'

export default async function AdminLivePage() {
  const session = await auth()
  if (!session?.user?.staffRole) redirect('/')

  const [settings, channels] = await Promise.all([
    prisma.liveStreamSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.youtubeChannel.findMany({
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    }),
  ])

  return (
    <main className="min-h-screen bg-cream px-4 sm:px-6 py-12 text-navy font-body">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Gerenciamento de Transmissões & Canais</h1>
          <p className="mt-1 text-sm text-navy/60">
            Cadastre canais do YouTube, altere a prioridade de exibição e controle transmissões ao vivo.
          </p>
        </div>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-navy border-b border-line pb-3">
            Canais do YouTube Conectados
          </h2>
          <ChannelsManager channels={channels} />
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-navy border-b border-line pb-3">
            Controle de Emergência / Modo Manual
          </h2>
          <LiveStreamAdminForm settings={settings} />
        </section>
      </div>
    </main>
  )
}