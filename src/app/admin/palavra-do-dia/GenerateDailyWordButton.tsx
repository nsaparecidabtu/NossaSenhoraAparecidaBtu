// src/app/admin/palavra-do-dia/GenerateDailyWordButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { generateAndSaveDailyWord } from '@/actions/dailyWord'

export function GenerateDailyWordButton() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleGenerate() {
    setMessage(null)
    startTransition(async () => {
      const result = await generateAndSaveDailyWord()
      const isError = 'error' in result

      setMessage(
        isError
          ? (result.error ?? 'Erro')
          : (result.message ?? 'Gerada com sucesso!')
      )

      if (!isError) {
        window.location.reload()
      }
    })
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="rounded bg-navy px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {isPending ? 'Gerando...' : 'Gerar novamente com IA'}
      </button>
      {message && <p className="mt-2 font-body text-xs text-navy/60">{message}</p>}
    </div>
  )
}