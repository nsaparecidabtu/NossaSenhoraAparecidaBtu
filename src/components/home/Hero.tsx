// src/components/home/Hero.tsx
import type { LiturgicalSeason } from '@/lib/liturgical'
import { ChevronDown } from 'lucide-react'

type Props = {
  name: string | null | undefined
  heroImageUrl: string | null | undefined
  heroTagline: string | null | undefined
  themeMode: string
  season: LiturgicalSeason
  mapsUrl: string | null
}

export function Hero({ name, heroImageUrl, heroTagline, themeMode, season, mapsUrl }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-24 text-center text-cream sm:py-28">
      {heroImageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
        </>
      )}

      <div className="relative mx-auto max-w-3xl">
        {themeMode !== 'PADRAO' && (
          <span
            className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${season.colorHex}33`, color: season.colorHex }}
          >
            Tempo Litúrgico: {season.name}
            {season.specialNote ? ` — ${season.specialNote}` : ''}
          </span>
        )}

        <p className="mt-6 font-body text-sm font-semibold uppercase tracking-widest text-gold">
          Bem-vindo à
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {name ?? 'Paróquia Nossa Senhora Aparecida'}
        </h1>

        <div className="mx-auto mt-5 h-px w-16 bg-gold" />

        <p className="mt-5 font-body text-lg text-cream/80">
          {heroTagline ?? 'Lar de fé, esperança e devoção'}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#horarios"
            className="rounded-full bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Horários das Missas
          </a>
          <a
            href={mapsUrl ?? '#contato'}
            target={mapsUrl ? '_blank' : undefined}
            rel={mapsUrl ? 'noopener noreferrer' : undefined}
            className="rounded-full border border-cream/40 px-6 py-3 font-body text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
          >
            Faça uma Visita
          </a>
        </div>
      </div>

      <a
        href="#horarios"
        aria-label="Rolar para baixo"
        className="relative mx-auto mt-14 flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-cream"
      >
        <ChevronDown className="h-4 w-4" />
      </a>
    </section>
  )
}