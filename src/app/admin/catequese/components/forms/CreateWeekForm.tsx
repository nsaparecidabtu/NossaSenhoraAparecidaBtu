'use client'

import { useActionState } from 'react'
import { createWeek } from '@/actions/catechism'

type ActionState = { success: boolean; error?: string }

export function CreateWeekForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createWeek, {
    success: false,
  })

  return (
    <form action={formAction} className="flex gap-2">
      <input
        name="title"
        required
        placeholder='Ex: "4ª Semana - Junho"'
        className="flex-1 rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
      >
        {pending ? '...' : 'Abrir semana'}
      </button>
      {state.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
    </form>
  )
}