// src/components/livestream/LivePlayer.tsx
'use client'

type MassScheduleItem = {
  id: string
  label: string
  times: string[]
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
    <div className="overflow-hidden rounded-2xl border border-line bg-black shadow-xl">
      {isLive && videoId ? (
        /* Aspect Ratio 16:9 HD Player */
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            title="Transmissão ao Vivo - Paróquia Nossa Senhora Aparecida"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        /* Standby Fallback Elegante quando não há live */
        <div className="p-8 sm:p-12 text-center text-cream space-y-6 bg-gradient-to-b from-navy to-navy/90">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold text-2xl font-bold">
            ✝
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-display text-2xl font-bold text-cream">Nenhuma transmissão ao vivo no momento</h3>
            <p className="mt-2 text-sm text-cream/70">
              Confira abaixo os horários das nossas próximas missas presenciais e transmissões da semana:
            </p>
          </div>

          {massSchedules.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left pt-2">
              {massSchedules.map((schedule) => (
                <div key={schedule.id} className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-gold">{schedule.label}</p>
                  <p className="font-mono text-sm text-cream/90 mt-1">{schedule.times.join(' • ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}