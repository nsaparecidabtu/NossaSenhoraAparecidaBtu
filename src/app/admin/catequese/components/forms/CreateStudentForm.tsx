'use client'

import { useActionState, useState } from 'react'
import { createStudentAdmin } from '@/actions/catechism/admin-catechism'
import { STAGE_LABELS } from '@/lib/catechism'

type ActionState = { success: boolean; error?: string }
type Catechist = { id: string; name: string; stages: string[] }

export function CreateStudentForm({ catechists }: { catechists: Catechist[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createStudentAdmin,
    { success: false }
  )
  const [stage, setStage] = useState('')

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-line bg-white p-4 shadow-sm">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Novo catequizando
      </p>
      <input
        name="name"
        required
        placeholder="Nome completo"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <select
          name="stage"
          required
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="w-full rounded border border-line bg-cream px-3 py-2 font-body text-sm outline-none focus:border-gold"
        >
          <option value="">Etapa</option>
          {Object.entries(STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        
        <select
          name="catechistId"
          required
          disabled={!stage}
          className="w-full rounded border border-line bg-cream px-3 py-2 font-body text-sm outline-none focus:border-gold disabled:opacity-50"
        >
          <option value="">Catequista</option>
          {catechists
            .filter((c) => c.stages.includes(stage))
            .map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
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