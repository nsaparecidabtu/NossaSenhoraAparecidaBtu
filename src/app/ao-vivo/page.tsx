// src/app/ao-vivo/page.tsx
import { prisma } from '@/lib/prisma'
import { getActiveLiveFromChannels, getRecentRecordedVideos } from '@/lib/youtube'
import { LivePlayer, type MassScheduleItem } from '@/components/livestream/LivePlayer'
import { PrayerWall, type PrayerItem } from '@/components/livestream/PrayerWall'
import { PastLives } from '@/components/livestream/PastLives'

export const revalidate = 300 

export default async function LivePage() {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)

  const [
    settingsResult,
    schedulesResult,
    prayersResult,
    youtubeLiveResult,
    recordedVideosResult,
  ] = await Promise.allSettled([
    prisma.liveStreamSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.massSchedule.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactRequest.findMany({
      where: {
        type: 'PRAYER',
        approvedForWall: true,
        createdAt: { gte: twelveHoursAgo },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    getActiveLiveFromChannels(),
    getRecentRecordedVideos(6),
  ])

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null
  const massSchedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : []
  const rawPrayers = prayersResult.status === 'fulfilled' ? prayersResult.value : []
  const apiLive = youtubeLiveResult.status === 'fulfilled' ? youtubeLiveResult.value : { isLive: false, videoId: null, title: '' }
  const recordedVideos = recordedVideosResult.status === 'fulfilled' ? recordedVideosResult.value : []

  let isLive = settings?.isLiveNow ?? false
  let videoId = settings?.youtubeVideoId ?? null
  let liveTitle = 'Transmissão ao Vivo'

  if (!isLive && apiLive.isLive && apiLive.videoId) {
    isLive = true
    videoId = apiLive.videoId
    liveTitle = apiLive.title || liveTitle
  }

  // DTO para PrayerItem (createdAt como string ISO)
  const formattedPrayers: PrayerItem[] = rawPrayers.map((p) => ({
    id: p.id,
    name: p.name,
    message: p.message,
    createdAt: p.createdAt.toISOString(),
  }))

  // DTO para MassScheduleItem
  const formattedSchedules: MassScheduleItem[] = massSchedules.map((s) => ({
    id: s.id,
    label: s.label,
    times: s.times,
    order: s.order,
  }))

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8 text-navy font-body selection:bg-gold/30">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-navy">
                Transmissão ao Vivo
              </h1>
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-mono text-xs font-bold uppercase text-white shadow-sm animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  Ao Vivo Agora
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-navy/10 px-3 py-1 font-mono text-xs font-semibold uppercase text-navy/70">
                  Offline
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-navy/70">
              {isLive ? liveTitle : 'Acompanhe nossas celebrações e missas ao vivo de onde estiver.'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <LivePlayer 
              isLive={isLive} 
              videoId={videoId} 
              massSchedules={formattedSchedules} 
            />
            
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-navy">Instruções e Participação</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                Durante a celebração, utilize o formulário ao lado para enviar suas intenções de oração.
                Os pedidos aprovados pela equipe paroquial serão exibidos no mural público da transmissão.
              </p>
            </div>
          </section>

          <aside className="lg:col-span-1 h-full">
            <PrayerWall initialRequests={formattedPrayers} />
          </aside>
        </div>

        {recordedVideos.length > 0 && (
          <section className="border-t border-line pt-10">
            <PastLives videos={recordedVideos} />
          </section>
        )}

      </div>
    </main>
  )
}