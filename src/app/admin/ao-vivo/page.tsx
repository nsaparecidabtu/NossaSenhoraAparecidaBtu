// src/app/admin/ao-vivo/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { LiveManagerHelpTab } from './components/LiveManagerHelpTab'
import { ChannelsManager } from './ChannelsManager' // Verifique o caminho correto de importação
import { LiveStreamAdminForm } from './LiveStreamAdminForm' // Verifique o caminho correto de importação

export const dynamic = 'force-dynamic'

const TABS = [
  { id: 'canais', label: 'Canais & Controle' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminLivePage({ searchParams }: PageProps) {
  // 1. Validação de Sessão e Segurança (RBAC)
  const session = await auth()
  if (!session?.user) redirect('/')

  const hasAccess =
    session.user.staffRole === 'SUPER_ADMIN' ||
    session.user.permissions?.includes('MANAGE_LIVE_STREAM')

  if (!hasAccess) redirect('/admin')

  // 2. Resolução da Aba Atual via URL
  const resolvedParams = await searchParams
  const activeTab = resolvedParams.tab || 'canais'

  // 3. Otimização Sênior: Busca de dados condicionada à aba ativa
  let settings = null
  let channels: any[] = []

  if (activeTab === 'canais') {
    const [fetchedSettings, fetchedChannels] = await Promise.all([
      prisma.liveStreamSettings.findUnique({ where: { id: 'singleton' } }),
      prisma.youtubeChannel.findMany({
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
      }),
    ])
    settings = fetchedSettings
    channels = fetchedChannels
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 text-navy font-body">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Cabeçalho da Página */}
        <div>
          <h1 className="font-display text-3xl font-bold">Gerenciamento de Transmissões & Canais</h1>
          <p className="mt-1 text-sm text-navy/60">
            Cadastre canais do YouTube, altere a prioridade de exibição e controle transmissões ao vivo.
          </p>
        </div>

        {/* Navegador de Abas */}
        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        {/* Renderização Condicional (Server-Side) */}
        <div className="mt-6">
          {activeTab === 'canais' && (
            <div className="space-y-8 animate-[fadein_0.3s_ease]">

              <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b border-line pb-3 font-display text-xl font-bold text-navy">
                  Canais do YouTube Conectados
                </h2>
                {/* O TypeScript deduz corretamente que 'channels' está populado aqui */}
                <ChannelsManager channels={channels} />
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b border-line pb-3 font-display text-xl font-bold text-navy">
                  Controle de Emergência / Modo Manual
                </h2>
                {/* O TypeScript deduz corretamente que 'settings' está populado aqui */}
                <LiveStreamAdminForm settings={settings} />
              </section>

            </div>
          )}

          {activeTab === 'ajuda' && (
            <LiveManagerHelpTab />
          )}
        </div>

      </div>
    </main>
  )
}