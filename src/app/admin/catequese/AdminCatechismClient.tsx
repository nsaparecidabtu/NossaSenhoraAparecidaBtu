// src/app/admin/catequese/AdminCatechismClient.tsx
'use client'

import { useActionState, useState } from 'react'
import {
  createStudent,
  toggleStudentActive,
  markAttendanceManual,
  removeAttendance,
} from '@/actions/catechism'
import { isoWeekKey } from '@/lib/catechism'

type Student = {
  id: string
  name: string
  className: string
  guardianEmail: string
  active: boolean
}

type Attendance = {
  id: string
  studentId: string
  massLabel: string
  attendedAt: Date
  source: string
  note: string | null
}

type ActionState = { success: boolean; error?: string }

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

function CreateStudentForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createStudent, {
    success: false,
  })

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-line bg-white p-4">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Cadastrar aluno
      </p>
      <input
        name="name"
        required
        placeholder="Nome do aluno"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <input
        name="className"
        required
        placeholder="Turma (ex: Crisma - Turma A)"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <input
        name="guardianEmail"
        type="email"
        required
        placeholder="E-mail de quem vai marcar a presença (responsável ou o próprio aluno)"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
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

function ManualAttendanceForm({ students }: { students: Student[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    markAttendanceManual,
    { success: false }
  )

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-line bg-white p-4">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Marcar presença manualmente (sem celular, ou correção)
      </p>
      <select
        name="studentId"
        required
        className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
      >
        <option value="">Selecione o aluno</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.className}
          </option>
        ))}
      </select>
      <input
        name="massLabel"
        required
        placeholder="Ex: Domingo 10h"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <input
        name="date"
        type="date"
        required
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <input
        name="note"
        placeholder="Observação (opcional)"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Marcar presença'}
      </button>
      {state.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
    </form>
  )
}

export function AdminCatechismClient({
  students,
  attendances,
}: {
  students: Student[]
  attendances: Attendance[]
}) {
  const [tab, setTab] = useState<'relatorio' | 'alunos' | 'log'>('relatorio')

  const thisWeek = isoWeekKey(new Date())
  const activeStudents = students.filter((s) => s.active)

  const statusByStudent = activeStudents.map((s) => {
    const markedThisWeek = attendances.some(
      (a) => a.studentId === s.id && isoWeekKey(a.attendedAt) === thisWeek
    )
    return { ...s, markedThisWeek }
  })

  const grouped = statusByStudent.reduce<Record<string, typeof statusByStudent>>((acc, s) => {
    acc[s.className] = acc[s.className] || []
    acc[s.className].push(s)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Catequese — Presença</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Acompanhamento, não fiscalização — use pra iniciar uma conversa com quem está sumindo.
        </p>

        <div className="mt-6 flex gap-2">
          {(['relatorio', 'alunos', 'log'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide ${
                tab === t ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60'
              }`}
            >
              {t === 'relatorio' ? 'Relatório semanal' : t === 'alunos' ? 'Alunos' : 'Histórico'}
            </button>
          ))}
        </div>

        {tab === 'relatorio' && (
          <div className="mt-6 space-y-6">
            {Object.entries(grouped).map(([className, list]) => (
              <div key={className}>
                <p className="font-display font-semibold">{className}</p>
                <div className="mt-2 space-y-2">
                  {list.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded border border-line bg-white px-3 py-2"
                    >
                      <span className="font-body text-sm">{s.name}</span>
                      <span
                        className={`font-body text-xs font-semibold uppercase ${
                          s.markedThisWeek ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {s.markedThisWeek ? '✅ presente essa semana' : '⏳ sem marcação'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {activeStudents.length === 0 && (
              <p className="font-body text-sm text-navy/40">Nenhum aluno ativo cadastrado.</p>
            )}
          </div>
        )}

        {tab === 'alunos' && (
          <div className="mt-6 space-y-6">
            <CreateStudentForm />
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white p-3"
                >
                  <div>
                    <p className="font-body text-sm font-semibold">{s.name}</p>
                    <p className="font-body text-xs text-navy/50">
                      {s.className} · {s.guardianEmail}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      await toggleStudentActive(s.id, !s.active)
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded px-3 py-1 font-body text-xs font-semibold uppercase ${
                        s.active ? 'text-red-600' : 'text-green-700'
                      }`}
                    >
                      {s.active ? 'Desativar' : 'Reativar'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'log' && (
          <div className="mt-6 space-y-6">
            <ManualAttendanceForm students={activeStudents} />
            <div className="space-y-2">
              {attendances.map((a) => {
                const student = students.find((s) => s.id === a.studentId)
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-line bg-white p-3"
                  >
                    <div>
                      <p className="font-body text-sm font-semibold">
                        {student?.name ?? 'Aluno removido'}
                      </p>
                      <p className="font-body text-xs text-navy/50">
                        {a.massLabel} · {fmtDate(a.attendedAt)} ·{' '}
                        {a.source === 'SELF' ? 'auto atribuída' : 'manual'}
                      </p>
                      {a.note && <p className="font-body text-xs text-navy/40">{a.note}</p>}
                    </div>
                    <form
                      action={async () => {
                        await removeAttendance(a.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="font-body text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
