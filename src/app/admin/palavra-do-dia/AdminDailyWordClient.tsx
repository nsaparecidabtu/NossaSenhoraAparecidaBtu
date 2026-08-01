// src/app/admin/palavra-do-dia/AdminDailyWordClient.tsx
'use client'

import { useActionState, useState, useTransition } from 'react'
import { generateAndSaveDailyWord, saveManualDailyWord } from '@/actions/dailyWord'

type DailyWord = {
  text: string
  verseReference: string
  reflection: string | null
} | null

type ActionState = { success: boolean; error?: string }

export function AdminDailyWordClient({ todayWord }: { todayWord: DailyWord }) {
  const [isPending, startTransition] = useTransition()
  const [genMessage, setGenMessage] = useState<string | null>(null)

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveManualDailyWord,
    { success: false }
  )

  function handleGenerate() {
    setGenMessage(null)
    startTransition(async () => {
      const result = await generateAndSaveDailyWord()
      const message = result.success
        ? 'Gerada com sucesso!'
        : 'error' in result
          ? result.error ?? 'Erro'
          : 'Erro'

      setGenMessage(message)
      if (result.success) {
        // recarrega pra puxar o texto novo nos campos abaixo
        window.location.reload()
      }
    })
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Palavra do Dia</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Todo dia às 6h o Gemini gera uma automaticamente. Aqui você pode gerar de novo ou
          escrever a sua própria — o que for salvo por último é o que fica no ar.
        </p>

        {todayWord && (
          <div className="mt-6 rounded-lg border border-line bg-white p-4">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
              Publicada hoje
            </p>
            <p className="mt-2 font-mono text-xs uppercase text-navy/50">
              {todayWord.verseReference}
            </p>
            <p className="mt-1 font-display text-lg italic">&ldquo;{todayWord.text}&rdquo;</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="mt-6 rounded bg-navy px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
        >
          {isPending ? 'Gerando...' : 'Gerar novamente com IA'}
        </button>
        {genMessage && <p className="mt-2 font-body text-xs text-navy/60">{genMessage}</p>}

        <div className="mt-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-line" />
          <span className="font-body text-[10px] uppercase tracking-wide text-navy/40">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form
          action={formAction}
          className="mt-4 space-y-4 rounded-lg border border-line bg-white p-6"
        >
          <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
            Escrever a sua
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
      </div>
    </main>
  )
}