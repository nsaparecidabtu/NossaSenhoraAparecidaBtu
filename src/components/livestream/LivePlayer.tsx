// src/components/livestream/LivePlayer.tsx
'use client'

export type MassScheduleItem = {
  id: string
  label: string
  times: string[]
  order: number
}

export function LivePlayer({
  isLive,
  videoId,
  massSchedules,
}: {
  isLive: boolean
  videoId: string | null
  massSchedules: MassScheduleItem[]
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-navy text-cream shadow-md font-body">
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {isLive && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            title="Transmissão ao Vivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          ></iframe>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream">
              <span className="text-xl font-bold">†</span>
            </div>
            <h3 className="font-display text-xl font-bold text-cream">
              Nenhuma transmissão ao vivo no momento
            </h3>
            <p className="mt-2 text-xs text-cream/70 max-w-md mx-auto">
              Confira abaixo os horários das nossas próximas missas presenciais e transmissões da semana:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
              {massSchedules.map((s) => (
                <div key={s.id} className="rounded-xl border border-cream/10 bg-cream/5 p-3">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-gold">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xs text-cream/90 font-mono">
                    {s.times.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}