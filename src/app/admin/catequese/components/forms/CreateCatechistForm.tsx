'use client'

import { useActionState } from 'react'
import { createCatechist } from '@/actions/catechism'
import { STAGE_LABELS } from '@/lib/catechism'

type ActionState = { success: boolean; error?: string }

export function CreateCatechistForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createCatechist, {
    success: false,
  })

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-line bg-white p-4 shadow-sm">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Novo catequista
      </p>
      <input
        name="name"
        required
        placeholder="Nome"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <div className="flex gap-4 font-body text-sm">
        {Object.entries(STAGE_LABELS).map(([value, label]) => (
          <label key={value} className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" name="stages" value={value} className="accent-navy" />
            {label}
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Cadastrar'}
      </button>
      {state.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
    </form>
  )
}