// src/app/admin/palavra-do-dia/TodayWordCard.tsx

type DailyWord = {
  text: string
  verseReference: string
  reflection: string | null
  instagramReelUrl: string | null
  showTextWithReel?: boolean
}

export function TodayWordCard({ word }: { word: DailyWord }) {
  return (
    <div className="mt-6 rounded-lg border border-line bg-white p-4">
      <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
        Publicada hoje
      </p>
      <p className="mt-2 font-mono text-xs uppercase text-navy/50">{word.verseReference}</p>
      <p className="mt-1 font-display text-lg italic">&ldquo;{word.text}&rdquo;</p>
      {word.instagramReelUrl && (
        <p className="mt-2 font-body text-xs text-navy/50">
          📎 Com Reels do Instagram anexado
          {word.showTextWithReel === false && ' · só o vídeo na home'}
        </p>
      )}
    </div>
  )
}