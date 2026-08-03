// src/app/admin/palavra-do-dia/AdminDailyWordClient.tsx
'use client'

import { TodayWordCard } from './TodayWordCard'
import { GenerateDailyWordButton } from './GenerateDailyWordButton'
import { ManualDailyWordForm } from './ManualDailyWordForm'

type DailyWord = {
  text: string
  verseReference: string
  reflection: string | null
  instagramReelUrl: string | null
  showTextWithReel?: boolean
} | null

export function AdminDailyWordClient({ todayWord }: { todayWord: DailyWord }) {
  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Palavra do Dia</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Todo dia às 6h o Gemini gera uma automaticamente. Aqui você pode gerar de novo, colar
          um Reels do Instagram, ou escrever a sua própria — o que for salvo por último fica no ar.
        </p>

        {todayWord && <TodayWordCard word={todayWord} />}

        <GenerateDailyWordButton />

        <div className="mt-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-line" />
          <span className="font-body text-[10px] uppercase tracking-wide text-navy/40">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <ManualDailyWordForm todayWord={todayWord} />
      </div>
    </main>
  )
}