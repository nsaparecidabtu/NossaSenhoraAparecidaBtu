'use client'

import { useState, useTransition } from 'react'
import { generateAndSaveDailyWord } from '@/actions/dailyWord'

export function GenerateDailyWordButton() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleClick() {
    setMessage(null)
    startTransition(async () => {
      const result = await generateAndSaveDailyWord()
      if (result.success) {
        setMessage(result.message ?? 'Gerado!')
      } else {
        setMessage(result.error ?? 'Erro')
      }
    })
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="mb-2 text-sm font-semibold text-amber-800">
        Temporário — Gerar Palavra do Dia (antes do cron)
      </p>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded bg-navy px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
      >
        {isPending ? 'Gerando...' : 'Gerar Palavra do Dia agora'}
      </button>
      {message && (
        <p className="mt-2 text-sm text-navy/70">{message}</p>
      )}
    </div>
  )
}