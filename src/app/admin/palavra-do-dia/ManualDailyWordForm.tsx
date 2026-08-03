// src/app/admin/palavra-do-dia/ManualDailyWordForm.tsx
'use client'

import { useActionState } from 'react'
import { saveManualDailyWord } from '@/actions/dailyWord'

type DailyWord = {
  text: string
  verseReference: string
  reflection: string | null
  instagramReelUrl: string | null
  showTextWithReel?: boolean
} | null

type ActionState = { success: boolean; error?: string }

export function ManualDailyWordForm({ todayWord }: { todayWord: DailyWord }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveManualDailyWord,
    { success: false }
  )

  return (
    <form
      action={formAction}
      className="mt-4 space-y-4 rounded-lg border border-line bg-white p-6"
    >
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Escrever a sua / anexar um Reels
      </p>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Texto
        </label>
        <textarea
          name="text"
          required
          rows={3}
          defaultValue={todayWord?.text ?? ''}
          placeholder="A mensagem do dia..."
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Referência (versículo, santo, papa...)
        </label>
        <input
          name="verseReference"
          defaultValue={todayWord?.verseReference ?? ''}
          placeholder="Ex: Jo 14,27"
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Reflexão (opcional)
        </label>
        <textarea
          name="reflection"
          rows={2}
          defaultValue={todayWord?.reflection ?? ''}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Link do Reels do Instagram (opcional)
        </label>
        <input
          name="instagramReelUrl"
          type="url"
          defaultValue={todayWord?.instagramReelUrl ?? ''}
          placeholder="https://www.instagram.com/reel/..."
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
        <p className="mt-1 font-body text-xs text-navy/40">
          Copia direto do Instagram: três pontinhos no reel → Copiar link.
        </p>
      </div>

      {/* Chavinha — bem visível */}
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-cream/50 px-3 py-3">
        <input
          type="checkbox"
          name="showTextWithReel"
          defaultChecked={todayWord?.showTextWithReel !== false}
          className="h-4 w-4 shrink-0 accent-navy"
        />
        <span className="text-left">
          <span className="block font-body text-sm font-semibold text-navy">
            Mostrar texto junto com o Reels
          </span>
          <span className="block font-body text-xs text-navy/50">
            Desligue se quiser só o vídeo na página inicial.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Publicar esta versão'}
      </button>

      {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-sm text-green-700">Publicado!</p>}
    </form>
  )
}