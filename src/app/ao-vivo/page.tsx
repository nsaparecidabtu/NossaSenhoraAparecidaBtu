// src/app/ao-vivo/page.tsx
import { prisma } from '@/lib/prisma'
import { getActiveLiveFromChannels, getRecentRecordedVideos } from '@/lib/youtube'
import { LivePlayer } from '@/components/livestream/LivePlayer'
import { PrayerWall } from '@/components/livestream/PrayerWall'
import { PastLives } from '@/components/livestream/PastLives'

export const revalidate = 300 // Revalidação ISR de 5 minutos

export default async function LivePage() {
  const [settings, massSchedules, prayerRequests] = await Promise.all([
    prisma.liveStreamSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.massSchedule.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactRequest.findMany({
      where: { type: 'PRAYER', approvedForWall: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  let isLive = settings?.isLiveNow ?? false
  let videoId = settings?.youtubeVideoId ?? null
  let liveTitle = 'Transmissão ao Vivo'

  // Se NÃO estiver em override manual forçado, consulta a API do YouTube
  if (!isLive) {
    const apiLive = await getActiveLiveFromChannels()
    if (apiLive.isLive && apiLive.videoId) {
      isLive = true
      videoId = apiLive.videoId
      liveTitle = apiLive.title || liveTitle
    }
  }

  // Busca gravações anteriores dos canais ativos no banco de dados
  const recordedVideos = await getRecentRecordedVideos(6)

  return (
    <main className="min-h-screen bg-cream py-8 px-4 sm:px-6 lg:px-8 text-navy font-body">
      <div className="mx-auto max-w-7xl">
        
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight">Transmissão ao Vivo</h1>
              {isLive ? (
                <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-mono text-xs font-bold uppercase text-white shadow-sm animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  Ao Vivo Agora
                </span>
              ) : (
                <span className="rounded-full bg-navy/10 px-3 py-1 font-mono text-xs font-semibold uppercase text-navy/70">
                  Offline
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-navy/70">
              {isLive ? liveTitle : 'Acompanhe nossas missas e celebre conosco de onde estiver.'}
            </p>
          </div>
        </div>

        {/* Grid Principal: Player HD (2/3) + Mural de Oração (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <LivePlayer isLive={isLive} videoId={videoId} massSchedules={massSchedules} />
            
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold">Instruções para Participação</h2>
              <p className="mt-2 text-sm text-navy/70 leading-relaxed">
                Durante a transmissão, você pode enviar sua intenção de oração pelo formulário ao lado.
                A transmissão é detectada automaticamente a cada 5 minutos.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PrayerWall initialRequests={prayerRequests} />
          </div>
        </div>

        {/* Carrossel de Transmissões Anteriores Gravadas */}
        {recordedVideos.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <PastLives videos={recordedVideos} />
          </div>
        )}

      </div>
    </main>
  )
}