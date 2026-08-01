// src/components/home/EventsSection.tsx
import { Clock, MapPin } from 'lucide-react'

type Event = {
  id: string
  title: string
  description: string | null
  eventDate: Date
  location: string | null
  imageUrl: string | null
}

export function EventsSection({ events }: { events: Event[] }) {
  return (
    <section id="eventos" className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
        Próximos Eventos
      </p>
      {events.length === 0 ? (
        <p className="mt-4 font-body text-sm text-navy/50">Nenhum evento agendado no momento.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 w-full bg-navy/10">
                {e.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute left-3 top-3 rounded bg-navy px-2.5 py-1.5 text-center leading-none text-cream">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wide">
                    {e.eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </p>
                  <p className="font-display text-base font-bold">
                    {e.eventDate.toLocaleDateString('pt-BR', { day: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold leading-snug">{e.title}</p>
                {e.description && (
                  <p className="mt-1 line-clamp-2 font-body text-sm text-navy/60">
                    {e.description}
                  </p>
                )}
                <div className="mt-3 space-y-1">
                  <p className="flex items-center gap-1.5 font-body text-xs text-navy/50">
                    <Clock className="h-3.5 w-3.5" />
                    {e.eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {e.location && (
                    <p className="flex items-center gap-1.5 font-body text-xs text-navy/50">
                      <MapPin className="h-3.5 w-3.5" />
                      {e.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}