// src/app/admin/horarios/AdminMassScheduleClient.tsx
'use client'

import { useActionState } from 'react'
import { createMassSchedule, deleteMassSchedule } from '@/actions/massSchedule'

type Schedule = { id: string; label: string; times: string[]; order: number }

type ActionState = { success: boolean; error?: string }

export function AdminMassScheduleClient({ schedules }: { schedules: Schedule[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createMassSchedule,
    { success: false }
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Horários de Missa</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Aparecem na home na ordem definida abaixo.
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Rótulo (ex: Domingo)
            </label>
            <input
              name="label"
              required
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Horários (separados por vírgula — ex: 08h00, 10h00, 18h00)
            </label>
            <input
              name="times"
              required
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
              defaultValue={schedules.length}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
          >
            {pending ? 'Salvando...' : 'Adicionar Horário'}
          </button>

          {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
        </form>

        <div className="mt-8 space-y-3">
          {schedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-line bg-white p-4"
            >
              <div>
                <p className="font-display font-semibold">{s.label}</p>
                <p className="font-mono text-xs text-navy/50">{s.times.join(' · ')}</p>
              </div>
              <form
                action={async () => {
                  await deleteMassSchedule(s.id)
                }}
              >
                <button
                  type="submit"
                  className="font-body text-xs font-semibold text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}