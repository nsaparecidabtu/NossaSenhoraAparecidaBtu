// src/app/catequese/CatequeseClient.tsx
//
// Experiência única e fluida — sem páginas numeradas, sem botão
// "Começar". Estado interno controla as fases, mas a pessoa só sente
// uma conversa acontecendo, não um formulário.
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Search, Check } from 'lucide-react'
import {
  searchStudents,
  quickRegisterStudent,
  submitAttendance,
} from '@/actions/catechism'
import { STAGE_LABELS, MASS_OPTIONS, suggestMass } from '@/lib/catechism'

type Catechist = { id: string; name: string; stages: string[] }
type StudentResult = { id: string; name: string; stage: string; catechistName: string }

type Phase = 'search' | 'confirmMass' | 'chooseMass' | 'quickRegister' | 'sending' | 'done'

export function CatequeseClient({
  token,
  catechists,
}: {
  token: string
  catechists: Catechist[]
}) {
  const [phase, setPhase] = useState<Phase>('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<StudentResult[]>([])
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<StudentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const suggested = suggestMass()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const found = await searchStudents(token, query)
        setResults(found)
        setSearched(true)
      })
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, token])

  function pickStudent(s: StudentResult) {
    setSelected(s)
    setError(null)
    setPhase('confirmMass')
  }

  function confirmMass(massLabel: string) {
    if (!selected) return
    setError(null)
    setPhase('sending')
    startTransition(async () => {
      try {
        await submitAttendance(token, selected.id, massLabel)
        setPhase('done')
        setTimeout(() => {
          setPhase('search')
          setQuery('')
          setResults([])
          setSearched(false)
          setSelected(null)
        }, 3500)
      } catch (err: any) {
        setError(err.message ?? 'Não deu pra registrar agora. Tenta de novo.')
        setPhase('confirmMass')
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-cream px-6 py-10 text-navy">
      <div className="mx-auto w-full max-w-sm flex-1">
        {/* ---- Acolhida + busca ---- */}
        {(phase === 'search' || phase === 'quickRegister') && (
          <div className="animate-[fadein_0.4s_ease]">
            <p className="font-body text-sm text-navy/60">Paz e Bem!</p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-snug">
              Que alegria celebrar o Dia do Senhor com você.
            </h1>
            <p className="mt-5 font-body text-base text-navy/70">
              Quem participou da celebração?
            </p>

            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full rounded-2xl border-none bg-white py-4 pl-11 pr-4 font-body text-base shadow-sm outline-none ring-1 ring-navy/10 focus:ring-2 focus:ring-gold"
              />
            </div>

            {phase === 'search' && (
              <div className="mt-4 space-y-2">
                {results.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickStudent(s)}
                    className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <p className="font-display text-base font-semibold">{s.name}</p>
                    <p className="mt-0.5 font-body text-xs text-navy/50">
                      {STAGE_LABELS[s.stage] ?? s.stage} · Catequista {s.catechistName}
                    </p>
                  </button>
                ))}

                {searched && !isPending && results.length === 0 && (
                  <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="font-body text-sm text-navy/60">
                      Não encontramos ninguém com esse nome.
                    </p>
                    <button
                      onClick={() => setPhase('quickRegister')}
                      className="mt-3 rounded-full bg-navy px-5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream"
                    >
                      Cadastrar catequizando
                    </button>
                  </div>
                )}
              </div>
            )}

            {phase === 'quickRegister' && (
              <QuickRegisterForm
                token={token}
                name={query}
                catechists={catechists}
                onDone={(student) => pickStudent(student)}
                onCancel={() => setPhase('search')}
              />
            )}
          </div>
        )}

        {/* ---- Confirmação da missa ---- */}
        {(phase === 'confirmMass' || phase === 'sending') && selected && (
          <div className="flex min-h-[70vh] flex-col justify-center animate-[fadein_0.4s_ease]">
            <p className="font-body text-sm text-navy/60">Olá, {selected.name.split(' ')[0]}!</p>
            <h2 className="mt-2 font-display text-2xl font-bold leading-snug">
              Você está participando da Missa das {suggested.label.split(' - ')[1]}?
            </h2>

            <button
              onClick={() => confirmMass(suggested.label)}
              disabled={phase === 'sending'}
              className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-navy py-5 font-body text-base font-semibold text-cream shadow-md transition-opacity disabled:opacity-60"
            >
              {phase === 'sending' ? 'Registrando...' : <>Sim, confirmar <Check className="h-4 w-4" /></>}
            </button>

            <button
              onClick={() => setPhase('chooseMass')}
              disabled={phase === 'sending'}
              className="mt-3 font-body text-sm text-navy/50 underline underline-offset-4"
            >
              Escolher outra Missa
            </button>

            {error && <p className="mt-4 font-body text-sm text-red-600">{error}</p>}
          </div>
        )}

        {/* ---- Escolher outra missa ---- */}
        {phase === 'chooseMass' && selected && (
          <div className="animate-[fadein_0.4s_ease]">
            <h2 className="font-display text-xl font-bold">Qual missa?</h2>
            <div className="mt-4 space-y-2">
              {MASS_OPTIONS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => confirmMass(m.label)}
                  className="w-full rounded-2xl bg-white p-4 text-left font-body text-base shadow-sm transition-transform active:scale-[0.98]"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---- Final ---- */}
        {phase === 'done' && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-[fadein_0.5s_ease]">
            <p className="font-display text-2xl font-bold">Presença registrada</p>
            <p className="mt-3 font-body text-base text-navy/70">
              Que Nossa Senhora Aparecida acompanhe sua caminhada.
            </p>
            <p className="mt-1 font-body text-base text-navy/70">Bom domingo!</p>
          </div>
        )}
      </div>
    </main>
  )
}

function QuickRegisterForm({
  token,
  name,
  catechists,
  onDone,
  onCancel,
}: {
  token: string
  name: string
  catechists: Catechist[]
  onDone: (student: StudentResult) => void
  onCancel: () => void
}) {
  const [studentName, setStudentName] = useState(name)
  const [stage, setStage] = useState('')
  const [catechistId, setCatechistId] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableCatechists = catechists.filter((c) => c.stages.includes(stage))

  async function handleSubmit() {
    setError(null)
    if (!studentName.trim() || !stage || !catechistId) {
      setError('Preenche nome, etapa e catequista.')
      return
    }
    setPending(true)
    try {
      const student = await quickRegisterStudent(token, {
        name: studentName,
        stage: stage as any,
        catechistId,
      })
      onDone(student)
    } catch (err: any) {
      setError(err.message ?? 'Falha ao cadastrar.')
      setPending(false)
    }
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50">
        Primeira vez por aqui — só o essencial
      </p>
      <input
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Nome completo"
        className="w-full rounded-xl bg-cream px-4 py-3 font-body text-sm outline-none ring-1 ring-navy/10 focus:ring-2 focus:ring-gold"
      />
      <select
        value={stage}
        onChange={(e) => {
          setStage(e.target.value)
          setCatechistId('')
        }}
        className="w-full rounded-xl bg-cream px-4 py-3 font-body text-sm outline-none ring-1 ring-navy/10"
      >
        <option value="">Etapa</option>
        <option value="PRE">Pré Catequese</option>
        <option value="ETAPA_1">1ª Etapa</option>
        <option value="ETAPA_2">2ª Etapa</option>
      </select>
      {stage && (
        <select
          value={catechistId}
          onChange={(e) => setCatechistId(e.target.value)}
          className="w-full rounded-xl bg-cream px-4 py-3 font-body text-sm outline-none ring-1 ring-navy/10"
        >
          <option value="">Catequista</option>
          {availableCatechists.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleSubmit}
        disabled={pending}
        className="w-full rounded-xl bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Continuar'}
      </button>
      <button onClick={onCancel} className="w-full font-body text-xs text-navy/40">
        Voltar pra busca
      </button>
      {error && <p className="font-body text-xs text-red-600">{error}</p>}
    </div>
  )
}