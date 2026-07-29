// src/app/admin/faq/AdminFaqClient.tsx
'use client'

import { useActionState } from 'react'
import { createFaqItem, deleteFaqItem } from '@/actions/faq'

type Faq = { id: string; question: string; answer: string; category: string | null; order: number }

type ActionState = { success: boolean; error?: string }

export function AdminFaqClient({ faqs }: { faqs: Faq[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createFaqItem, {
    success: false,
  })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Perguntas Frequentes</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Aparecem na home na ordem definida abaixo.
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Pergunta
            </label>
            <input
              name="question"
              required
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Resposta
            </label>
            <textarea
              name="answer"
              required
              rows={4}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Categoria (opcional)
            </label>
            <input
              name="category"
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Ordem de exibição
            </label>
            <input
              name="order"
              type="number"
              defaultValue={faqs.length}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
          >
            {pending ? 'Salvando...' : 'Adicionar Pergunta'}
          </button>

          {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
        </form>

        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{f.question}</p>
                  {f.category && <p className="font-mono text-xs text-navy/50">{f.category}</p>}
                  <p className="mt-1 font-body text-sm text-navy/70">{f.answer}</p>
                </div>
                <form
                  action={async () => {
                    await deleteFaqItem(f.id)
                  }}
                >
                  <button
                    type="submit"
                    className="shrink-0 font-body text-xs font-semibold text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}