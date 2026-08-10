// src/app/admin/catequese/AdminCatechismClient.tsx
'use client'

import { useActionState, useMemo, useState } from 'react'
import {
  createWeek,
  toggleWeekOpen,
  createCatechist,
  toggleCatechistActive,
  createStudentAdmin,
  toggleStudentActive,
  markAttendanceManual,
  deleteAttendance,
} from '@/actions/catechism'
import { STAGE_LABELS, MASS_OPTIONS } from '@/lib/catechism'

type Week = { id: string; title: string; token: string; isOpen: boolean; startsAt: Date }
type Catechist = { id: string; name: string; stages: string[]; active: boolean }
type Student = {
  id: string
  name: string
  stage: string
  catechistId: string
  active: boolean
  catechist: { name: string }
}
type Attendance = {
  id: string
  studentName: string
  massLabel: string
  stage: string
  catechistName: string
  createdAt: Date
  note: string | null
  source: string
}

type ActionState = { success: boolean; error?: string }

function fmtTime(date: Date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CreateWeekForm() {
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

function CreateCatechistForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createCatechist, {
    success: false,
  })
  return (
    <form action={formAction} className="space-y-2 rounded-lg border border-line bg-white p-4">
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
          <label key={value} className="flex items-center gap-1.5">
            <input type="checkbox" name="stages" value={value} />
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

function CreateStudentForm({ catechists }: { catechists: Catechist[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createStudentAdmin,
    { success: false }
  )
  const [stage, setStage] = useState('')

  return (
    <form action={formAction} className="space-y-2 rounded-lg border border-line bg-white p-4">
      <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
        Novo catequizando
      </p>
      <input
        name="name"
        required
        placeholder="Nome completo"
        className="w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
      />
      <select
        name="stage"
        required
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
      >
        <option value="">Etapa</option>
        {Object.entries(STAGE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        name="catechistId"
        required
        className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
      >
        <option value="">Catequista</option>
        {catechists
          .filter((c) => c.stages.includes(stage))
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>
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

function ManualAttendanceForm({ weekId, students }: { weekId: string; students: Student[] }) {
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
      <select
        name="studentId"
        required
        className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
      >
        <option value="">Catequizando</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {STAGE_LABELS[s.stage]}
          </option>
        ))}
      </select>
      <select
        name="massLabel"
        required
        className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
      >
        <option value="">Missa</option>
        {MASS_OPTIONS.map((m) => (
          <option key={m.label} value={m.label}>
            {m.label}
          </option>
        ))}
      </select>
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
  openWeek,
  weeks,
  catechists,
  students,
  attendances,
  baseUrl,
}: {
  openWeek: Week | null
  weeks: Week[]
  catechists: Catechist[]
  students: Student[]
  attendances: Attendance[]
  baseUrl: string
}) {
  const [tab, setTab] = useState<'semana' | 'catequistas' | 'alunos' | 'relatorio'>('semana')
  const [filterCatechist, setFilterCatechist] = useState('all')

  const weekLink = openWeek ? `${baseUrl}/catequese?s=${openWeek.token}` : null
  const qrSrc = weekLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(weekLink)}`
    : null

  const filteredAttendances = useMemo(
    () =>
      filterCatechist === 'all'
        ? attendances
        : attendances.filter((a) => a.catechistName === filterCatechist),
    [attendances, filterCatechist]
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Catequese</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Semana/QR, catequistas, catequizandos e relatório.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ['semana', 'Semana / QR'],
              ['catequistas', 'Catequistas'],
              ['alunos', 'Catequizandos'],
              ['relatorio', 'Relatório'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide ${
                tab === key ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'semana' && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-line bg-white p-5 text-center">
              {openWeek ? (
                <>
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-green-700">
                    Semana aberta
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold">{openWeek.title}</p>
                  {qrSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrSrc} alt="QR da semana" className="mx-auto mt-3 h-52 w-52" />
                  )}
                  {weekLink && (
                    <>
                      <p className="mt-3 break-all font-mono text-xs text-navy/60">{weekLink}</p>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(weekLink)}
                        className="mt-2 rounded border border-line px-3 py-1.5 font-body text-xs font-semibold"
                      >
                        Copiar link
                      </button>
                    </>
                  )}
                  <form
                    action={async () => {
                      await toggleWeekOpen(openWeek.id, false)
                    }}
                    className="mt-4"
                  >
                    <button
                      type="submit"
                      className="font-body text-xs font-semibold text-red-600 hover:underline"
                    >
                      Encerrar esta semana
                    </button>
                  </form>
                </>
              ) : (
                <p className="font-body text-sm text-navy/60">
                  Nenhuma semana aberta no momento.
                </p>
              )}
            </div>
            <CreateWeekForm />

            {weeks.length > 0 && (
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/50">
                  Semanas anteriores
                </p>
                <div className="mt-2 space-y-1">
                  {weeks.map((w) => (
                    <p key={w.id} className="font-body text-xs text-navy/50">
                      {w.title} — {w.isOpen ? 'aberta' : 'encerrada'}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'catequistas' && (
          <div className="mt-6 space-y-4">
            <CreateCatechistForm />
            <div className="space-y-2">
              {catechists.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white p-3"
                >
                  <div>
                    <p className="font-body text-sm font-semibold">{c.name}</p>
                    <p className="font-body text-xs text-navy/50">
                      {c.stages.map((s) => STAGE_LABELS[s]).join(', ')}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      await toggleCatechistActive(c.id, !c.active)
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded px-3 py-1 font-body text-xs font-semibold uppercase ${
                        c.active ? 'text-red-600' : 'text-green-700'
                      }`}
                    >
                      {c.active ? 'Desativar' : 'Reativar'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'alunos' && (
          <div className="mt-6 space-y-4">
            <CreateStudentForm catechists={catechists} />
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white p-3"
                >
                  <div>
                    <p className="font-body text-sm font-semibold">{s.name}</p>
                    <p className="font-body text-xs text-navy/50">
                      {STAGE_LABELS[s.stage]} · catequista {s.catechist.name}
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

        {tab === 'relatorio' && (
          <div className="mt-6 space-y-4">
            {openWeek && <ManualAttendanceForm weekId={openWeek.id} students={students} />}

            <select
              value={filterCatechist}
              onChange={(e) => setFilterCatechist(e.target.value)}
              className="w-full rounded border border-line bg-white px-3 py-2 font-body text-sm"
            >
              <option value="all">Todos os catequistas</option>
              {catechists.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <p className="font-body text-xs text-navy/50">
              {filteredAttendances.length} registro(s){openWeek ? ` · ${openWeek.title}` : ''}
            </p>

            <div className="space-y-2">
              {filteredAttendances.map((a) => (
                <div key={a.id} className="rounded-lg border border-line bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-body text-sm font-semibold">{a.studentName}</p>
                      <p className="font-body text-xs text-navy/50">
                        {STAGE_LABELS[a.stage] ?? a.stage} · {a.massLabel} · {a.catechistName}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-navy/40">
                        preenchido em {fmtTime(a.createdAt)} ·{' '}
                        {a.source === 'SELF' ? 'auto atribuída' : 'manual'}
                      </p>
                      {a.note && <p className="font-body text-xs text-navy/40">{a.note}</p>}
                    </div>
                    <form
                      action={async () => {
                        await deleteAttendance(a.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="shrink-0 font-body text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {filteredAttendances.length === 0 && (
                <p className="font-body text-sm text-navy/40">Nenhum registro ainda.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}