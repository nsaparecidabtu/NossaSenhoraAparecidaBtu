// src/components/livestream/PastLives.tsx
'use client'

import type { RecordedVideo } from '@/lib/youtube'

export function PastLives({ videos }: { videos: RecordedVideo[] }) {
  if (!videos || videos.length === 0) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <section className="space-y-6 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">
            Transmissões e Missas Anteriores
          </h2>
          <p className="mt-1 text-sm text-navy/70">
            Assista às gravações das últimas celebrações do nosso canal.
          </p>
        </div>
      </div>

      {/* Grid Responsivo de Vídeos Gravados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-md"
          >
            {/* Thumbnail com Overlay do Player */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy/20 transition-opacity group-hover:opacity-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/80 text-gold shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white">
                  ▶
                </div>
              </div>
            </div>

            {/* Informações do Vídeo */}
            <div className="p-4">
              <span className="font-mono text-[11px] font-semibold uppercase text-navy/50">
                {formatDate(video.publishedAt)}
              </span>
              <h3 className="mt-1 font-display text-sm font-bold text-navy line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                {video.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}