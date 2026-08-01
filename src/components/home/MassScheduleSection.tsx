// src/components/home/MassScheduleSection.tsx
import type { LiturgicalSeason } from '@/lib/liturgical'
import { Sun, Church, Cross, Flame } from 'lucide-react'

type MassSchedule = { id: string; label: string; times: string[] }

type Props = { massSchedules: MassSchedule[]; themeMode: string; season: LiturgicalSeason }

function scheduleIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('domingo')) return Sun
  if (l.includes('sábado') || l.includes('sabado')) return Cross
  if (l.includes('adora')) return Flame
  return Church
}

export function MassScheduleSection({ massSchedules, themeMode, season }: Props) {
  return (
    <section id="horarios" className="mx-auto max-w-3xl px-6 py-10">
      <p
        className={`text-center font-body text-xs font-bold uppercase tracking-widest ${
          themeMode === 'PADRAO' ? 'text-gold' : ''
        }`}
        style={themeMode === 'PADRAO' ? undefined : { color: season.colorHex }}
      >
        Horários das Missas
      </p>
      {massSchedules.length === 0 ? (
        <p className="mt-4 text-center font-body text-sm text-navy/50">
          Horários em breve — cadastre no painel admin.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {massSchedules.map((m) => {
            const Icon = scheduleIcon(m.label)
            return (
              <div
                key={m.id}
                className={
                  themeMode === 'FULLCOLOR'
                    ? 'rounded-lg border p-4 text-center'
                    : 'rounded-lg border border-line bg-white p-4 text-center'
                }
                style={
                  themeMode === 'FULLCOLOR'
                    ? { backgroundColor: `${season.colorHex}0d`, borderColor: `${season.colorHex}40` }
                    : undefined
                }
              >
                <Icon className="mx-auto h-5 w-5 text-gold" strokeWidth={1.75} />
                <p className="mt-2 font-body text-xs font-bold uppercase tracking-wide text-navy/60">
                  {m.label}
                </p>
                <div className="mt-2 space-y-1">
                  {m.times.map((t) => (
                    <p key={t} className="font-display text-lg font-semibold">
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}