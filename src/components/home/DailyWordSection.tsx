// src/components/home/DailyWordSection.tsx
import { InstagramEmbed } from '@/components/InstagramEmbed'

type DailyWord = {
  verseReference: string
  text: string
  reflection: string | null
  instagramReelUrl?: string | null
  showTextWithReel?: boolean
}

export function DailyWordSection({ dailyWord }: { dailyWord: DailyWord | null }) {
  if (!dailyWord) return null

  const hasReel = Boolean(dailyWord.instagramReelUrl)
  // Sem reels → sempre mostra texto
  // Com reels → só mostra texto se a chavinha estiver ligada (default true)
  const showText = !hasReel || dailyWord.showTextWithReel !== false

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
        Palavra do Dia
      </p>

      <div className="mt-4 rounded-lg border border-line bg-white p-6 text-center">
        <span className="inline-block rounded-full bg-navy px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cream">
          {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
        </span>

        {showText && (
          <>
            <p className="mt-3 font-mono text-xs uppercase text-navy/50">
              {dailyWord.verseReference}
            </p>
            <p className="mt-2 font-display text-lg italic">&ldquo;{dailyWord.text}&rdquo;</p>
            {dailyWord.reflection && (
              <p className="mx-auto mt-3 max-w-md font-body text-sm text-navy/70">
                {dailyWord.reflection}
              </p>
            )}
          </>
        )}

        {hasReel && (
          <div className={showText ? 'mt-6' : 'mt-4'}>
            <div className="flex justify-center">
              <InstagramEmbed url={dailyWord.instagramReelUrl!} />
            </div>
            <a
              href={dailyWord.instagramReelUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-body text-xs font-semibold text-navy/50 hover:text-gold"
            >
              Ver no Instagram ↗
            </a>
          </div>
        )}
      </div>
    </section>
  )
}