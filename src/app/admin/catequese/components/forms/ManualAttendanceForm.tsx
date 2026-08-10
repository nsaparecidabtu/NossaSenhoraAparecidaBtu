// src/app/admin/catequese/components/forms/ManualAttendanceForm.tsx
'use client'

import { useActionState } from 'react'
import { markAttendanceManual } from '@/actions/catechism'
import { STAGE_LABELS, MASS_OPTIONS } from '@/lib/catechism'

// Tipagens importadas ou declaradas localmente
type Student = { id: string; name: string; stage: string }
type ActionState = { success: boolean; error?: string }

export function ManualAttendanceForm({ weekId, students }: { weekId: string; students: Student[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    markAttendanceManual,
    { success: false }
  )
  
  return (
    <form action={formAction} className="space-y-2 rounded-lg border border-line bg-white p-4">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Marcar manualmente
      </p>
      <input type="hidden" name="weekId" value={weekId} />
      
      <select name="studentId" required className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm">
        <option value="">Catequizando</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {STAGE_LABELS[s.stage]}
          </option>
        ))}
      </select>

      <select name="massLabel" required className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm">
        <option value="">Missa</option>
        {MASS_OPTIONS.map((m) => (
          <option key={m.label} value={m.label}>{m.label}</option>
        ))}
      </select>

      <input name="note" placeholder="Observação (opcional)" className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
      
      <button type="submit" disabled={pending} className="rounded bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60">
        {pending ? 'Salvando...' : 'Marcar presença'}
      </button>
      
      {state.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
    </form>
  )
}