// src/app/catequese/catequeseClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { markAttendanceSelf } from '@/actions/catechism'

type Student = {
  id: string
  name: string
  className: string
  markedThisWeek: boolean
}

type EligibleMass = {
  scheduleId: string
  label: string
  isOpenNow: boolean
}

type ActionState = { success: boolean; error?: string }

export function PresencaClient({
  students,
  eligibleMasses,
}: {
  students: Student[]
  eligibleMasses: EligibleMass[]
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    markAttendanceSelf,
    { success: false }
  )
  const [confirmed, setConfirmed] = useState(false)

  if (students.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-4 text-center">
        <p className="font-body text-sm text-navy/60">
          Não encontramos nenhum aluno cadastrado com este e-mail. Fale com o catequista pra
          cadastrar você ou seu filho(a).
        </p>
      </div>
    )
  }

  const openMasses = eligibleMasses.filter((m) => m.isOpenNow)

  if (state.success) {
    return (
      <div className="mt-6 rounded-lg border border-line bg-white p-6 text-center">
        <p className="font-display text-lg font-semibold">Presença registrada! 🙏</p>
        <p className="mt-2 font-body text-sm text-navy/60">
          Obrigado por participar da caminhada da nossa comunidade.
        </p>
      </div>
    )
  }

  if (openMasses.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-4 text-center">
        <p className="font-body text-sm text-navy/60">
          A presença só pode ser marcada perto do horário de uma missa. Volta aqui no fim de
          semana, durante ou logo depois da celebração.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-lg border border-line bg-white p-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Aluno
        </label>
        <div className="mt-2 space-y-2">
          {students.map((s) => (
            <label
              key={s.id}
              className="flex items-center justify-between gap-2 rounded border border-line px-3 py-2 font-body text-sm"
            >
              <span className="flex items-center gap-2">
                <input type="radio" name="studentId" value={s.id} required />
                {s.name} <span className="text-navy/40">— {s.className}</span>
              </span>
              {s.markedThisWeek && (
                <span className="font-body text-[10px] font-semibold uppercase text-green-700">
                  já marcou essa semana
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Qual missa
        </label>
        <div className="mt-2 space-y-2">
          {openMasses.map((m) => (
            <label
              key={m.scheduleId}
              className="flex items-center gap-2 rounded border border-line px-3 py-2 font-body text-sm"
            >
              <input type="radio" name="scheduleId" value={m.scheduleId} required />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-2 rounded bg-cream/60 p-3 font-body text-sm text-navy/80">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        Confirmo, com honestidade, que participei desta celebração.
      </label>

      <button
        type="submit"
        disabled={pending || !confirmed}
        className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-40"
      >
        {pending ? 'Enviando...' : 'Confirmar presença'}
      </button>

      {state.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
    </form>
  )
}