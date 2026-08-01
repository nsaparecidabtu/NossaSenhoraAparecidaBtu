// src/components/TestimonialForm.tsx
'use client'

import { useActionState } from 'react'
import { createTestimonial } from '@/actions/testimonial'

type ActionState = { success: boolean; error?: string }

export function TestimonialForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createTestimonial,
    { success: false }
  )

  if (state.success) {
    return (
      <p className="rounded-lg border border-line bg-white p-4 text-center font-body text-sm text-navy/70">
        Obrigado por compartilhar! Seu depoimento entra no ar assim que for revisado.
      </p>
    )
  }

  return (
    <form action={formAction} className="rounded-lg border border-line bg-white p-4">
      <textarea
        name="message"
        required
        maxLength={1000}
        rows={3}
        placeholder="Conte um pouco do que nossa comunidade significa pra você..."
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded bg-navy px-5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? 'Enviando...' : 'Compartilhar meu depoimento'}
      </button>
      {state.error && <p className="mt-2 font-body text-xs text-red-600">{state.error}</p>}
    </form>
  )
}