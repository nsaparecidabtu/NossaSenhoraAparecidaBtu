// src/components/home/AboutSection.tsx
import Link from 'next/link'
import type { LiturgicalSeason } from '@/lib/liturgical'

type Props = {
  name: string | null | undefined
  aboutText: string | null | undefined
  aboutImageUrl: string | null | undefined
  themeMode: string
  season: LiturgicalSeason
}

export function AboutSection({ name, aboutText, aboutImageUrl, themeMode, season }: Props) {
  return (
    <section
      className="mx-auto max-w-3xl rounded-lg px-6 py-10"
      style={themeMode === 'FULLCOLOR' ? { backgroundColor: `${season.colorHex}0d` } : undefined}
    >
      <p
        className={`font-body text-xs font-bold uppercase tracking-widest ${
          themeMode === 'FULLCOLOR' ? '' : 'text-gold'
        }`}
        style={themeMode === 'FULLCOLOR' ? { color: season.colorHex } : undefined}
      >
        Sobre Nós
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
        {aboutImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={aboutImageUrl}
            alt={name ?? 'Nossa paróquia'}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        )}
        <div>
          <p className="font-body leading-relaxed text-navy/80">
            {aboutText ?? 'Em breve, a história da nossa comunidade.'}
          </p>
          <Link
            href="/a-paroquia"
            className="mt-4 inline-block rounded bg-navy px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-opacity hover:opacity-90"
            style={themeMode === 'FULLCOLOR' ? { backgroundColor: season.colorHex } : undefined}
          >
            Saiba mais sobre nossa história →
          </Link>
        </div>
      </div>
    </section>
  )
}