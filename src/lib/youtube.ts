// src/lib/youtube.ts
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export type LiveStreamInfo = {
  isLive: boolean
  videoId: string | null
  title: string | null
  channelTitle: string | null
}

export type RecordedVideo = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

/**
 * Busca canais ATIVOS no banco de dados[cite: 1]
 */
async function getActiveChannelsFromDb() {
  return await prisma.youtubeChannel.findMany({
    where: { isActive: true }, // Ignora canais suspensos temporariamente[cite: 1]
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }], // Canal Principal vem primeiro[cite: 1]
  })
}

async function fetchActiveLiveFromDatabaseChannels(): Promise<LiveStreamInfo> {
  if (!YOUTUBE_API_KEY) {
    return { isLive: false, videoId: null, title: null, channelTitle: null }
  }

  const activeChannels = await getActiveChannelsFromDb()
  if (activeChannels.length === 0) {
    return { isLive: false, videoId: null, title: null, channelTitle: null }
  }

  // Itera sobre os canais ativos[cite: 1]
  for (const ch of activeChannels) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch.channelId}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`
      const res = await fetch(url, { next: { revalidate: 300 } })

      if (!res.ok) continue

      const data = await res.json()

      if (data.items && data.items.length > 0) {
        const liveItem = data.items[0]
        return {
          isLive: true,
          videoId: liveItem.id.videoId,
          title: liveItem.snippet.title,
          channelTitle: liveItem.snippet.channelTitle || ch.name,
        }
      }
    } catch (error) {
      console.error(`Erro ao consultar ao vivo do canal ${ch.name}:`, error)
    }
  }

  return { isLive: false, videoId: null, title: null, channelTitle: null }
}

async function fetchRecentVideosFromDatabaseChannels(maxResults = 6): Promise<RecordedVideo[]> {
  if (!YOUTUBE_API_KEY) return []

  const activeChannels = await getActiveChannelsFromDb()
  if (activeChannels.length === 0) return []

  const videos: RecordedVideo[] = []

  for (const ch of activeChannels) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch.channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
      const res = await fetch(url, { next: { revalidate: 300 } })

      if (!res.ok) continue

      const data = await res.json()

      if (data.items) {
        for (const item of data.items) {
          videos.push({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            publishedAt: item.snippet.publishedAt,
          })
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar gravações do canal ${ch.name}:`, error)
    }
  }

  return videos
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, maxResults)
}

/**
 * Funções exportadas envolvidas pelo cache do Next.js (5 minutos / 300 segundos)
 */
export const getActiveLiveFromChannels = () =>
  unstable_cache(
    async () => fetchActiveLiveFromDatabaseChannels(),
    ['active-live-db-channels'],
    { revalidate: 300 }
  )()

export const getRecentRecordedVideos = (maxResults = 6) =>
  unstable_cache(
    async () => fetchRecentVideosFromDatabaseChannels(maxResults),
    [`recent-videos-db-channels-${maxResults}`],
    { revalidate: 300 }
  )()