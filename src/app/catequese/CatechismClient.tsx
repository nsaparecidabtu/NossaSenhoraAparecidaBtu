'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Search, Heart, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { searchStudents, quickRegisterStudent, submitAttendance } from '@/actions/catechism'
import { STAGE_LABELS, MASS_OPTIONS, suggestMass } from '@/lib/catechism'

type Catechist = { id: string; name: string; stages: string[] }
type StudentResult = { id: string; name: string; stage: string; catechistName: string }

type Phase = 'search' | 'confirmMass' | 'chooseMass' | 'quickRegister' | 'sending' | 'done'

// Variantes de animação suaves e elásticas
const fadeSlide: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2 } }
}

export function CatequeseClient({ token, catechists }: { token: string; catechists: Catechist[] }) {
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
        }, 4000)
      } catch (err: any) {
        setError(err.message ?? 'Ops, tivemos um pequeno problema. Tente novamente!')
        setPhase('confirmMass')
      }
    })
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-6 py-10 text-navy selection:bg-gold/30">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          
          {/* ---- Acolhida e Busca ---- */}
          {(phase === 'search' || phase === 'quickRegister') && (
            <motion.div key="search-view" variants={fadeSlide} initial="initial" animate="animate" exit="exit" className="w-full">
              <div className="mb-6 flex items-center gap-2 text-gold">
                <Heart className="h-5 w-5 fill-gold/20" />
                <p className="font-body text-sm font-medium uppercase tracking-widest text-navy/60">Paz e Bem</p>
              </div>
              
              <h1 className="font-display text-3xl font-bold leading-tight text-navy">
                Que alegria ver você aqui hoje.
              </h1>
              <p className="mt-3 font-body text-lg text-navy/70">
                Como você se chama?
              </p>

              <div className="relative mt-6">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/40" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Seu nome ou apelido..."
                  className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 font-body text-lg shadow-sm outline-none ring-1 ring-navy/5 transition-all focus:ring-2 focus:ring-gold"
                />
              </div>

              {phase === 'search' && (
                <div className="mt-4 space-y-3">
                  {results.map((s) => (
                    <motion.button
                      layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      key={s.id}
                      onClick={() => pickStudent(s)}
                      className="group flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-navy/5 transition-all hover:bg-gold/5 active:scale-[0.98]"
                    >
                      <div>
                        <p className="font-display text-lg font-semibold text-navy group-hover:text-gold">{s.name}</p>
                        <p className="font-body text-sm text-navy/50">
                          {STAGE_LABELS[s.stage] ?? s.stage} · {s.catechistName}
                        </p>
                      </div>
                    </motion.button>
                  ))}

                  {searched && !isPending && results.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-navy/5">
                      <p className="font-body text-navy/60">
                        Ainda não encontrei seu nome. É seu primeiro dia?
                      </p>
                      <button
                        onClick={() => setPhase('quickRegister')}
                        className="mt-4 w-full rounded-xl bg-navy/5 py-3 font-body text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
                      >
                        Sim, quero me cadastrar
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {phase === 'quickRegister' && (
                <QuickRegisterForm token={token} name={query} catechists={catechists} onDone={pickStudent} onCancel={() => setPhase('search')} />
              )}
            </motion.div>
          )}

          {/* ---- Confirmação Carinhosa ---- */}
          {(phase === 'confirmMass' || phase === 'sending') && selected && (
            <motion.div key="confirm-view" variants={fadeSlide} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gold/10 p-4 text-gold">
                <Sparkles className="h-8 w-8" />
              </div>
              
              <h2 className="font-display text-2xl font-bold leading-tight">
                Oi, {selected.name.split(' ')[0]}!
              </h2>
              <p className="mt-2 font-body text-lg text-navy/70">
                Você acabou de participar da Missa das <span className="font-bold text-navy">{suggested.label.split(' - ')[1]}</span>?
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={() => confirmMass(suggested.label)}
                  disabled={phase === 'sending'}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-4 font-body text-lg font-semibold text-cream shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {phase === 'sending' ? 'Enviando com carinho...' : 'Sim, eu estava lá!'}
                </button>

                <button
                  onClick={() => setPhase('chooseMass')}
                  disabled={phase === 'sending'}
                  className="w-full py-3 font-body text-sm font-medium text-navy/50 transition-colors hover:text-navy"
                >
                  Não, fui em outro horário
                </button>
              </div>

              {error && <p className="mt-4 font-body text-sm text-red-500">{error}</p>}
            </motion.div>
          )}

          {/* ---- Escolha de Horário ---- */}
          {phase === 'chooseMass' && selected && (
            <motion.div key="choose-view" variants={fadeSlide} initial="initial" animate="animate" exit="exit" className="w-full">
              <button onClick={() => setPhase('confirmMass')} className="mb-6 flex items-center gap-2 text-sm font-medium text-navy/50 hover:text-navy">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <h2 className="font-display text-2xl font-bold">Qual horário você participou?</h2>
              <div className="mt-6 space-y-3">
                {MASS_OPTIONS.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => confirmMass(m.label)}
                    className="w-full rounded-2xl bg-white p-4 text-left font-body text-lg font-medium text-navy shadow-sm ring-1 ring-navy/5 transition-all hover:bg-gold/5 active:scale-[0.98]"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---- Celebração Final ---- */}
          {phase === 'done' && (
            <motion.div key="done-view" variants={fadeSlide} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', damping: 20 }}
                className="mb-6 text-gold"
              >
                <CheckCircle2 className="h-20 w-20" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-navy">Presença guardada!</h2>
              <p className="mt-4 font-body text-lg text-navy/70">
                Que a paz acompanhe você e sua família durante toda a semana.
              </p>
              <p className="mt-8 font-body text-sm font-medium uppercase tracking-widest text-navy/40">
                Até domingo que vem
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}

function QuickRegisterForm({ token, name, catechists, onDone, onCancel }: any) {
  const [studentName, setStudentName] = useState(name)
  const [stage, setStage] = useState('')
  const [catechistId, setCatechistId] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableCatechists = catechists.filter((c: any) => c.stages.includes(stage))

  async function handleSubmit() {
    setError(null)
    if (!studentName.trim() || !stage || !catechistId) {
      setError('Por favor, preencha todos os campos.')
      return
    }
    setPending(true)
    try {
      const student = await quickRegisterStudent(token, { name: studentName, stage, catechistId })
      onDone(student)
    } catch (err: any) {
      setError(err.message ?? 'Não conseguimos salvar agora.')
      setPending(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-md ring-1 ring-navy/5">
      <p className="font-body text-sm text-navy/70">
        Vamos registrar você rapidinho para as próximas vezes:
      </p>
      
      <input
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Seu nome completo"
        className="w-full rounded-xl bg-cream/50 px-4 py-3 font-body outline-none ring-1 ring-navy/10 focus:bg-white focus:ring-2 focus:ring-gold"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <select
          value={stage}
          onChange={(e) => { setStage(e.target.value); setCatechistId('') }}
          className="w-full rounded-xl bg-cream/50 px-4 py-3 font-body text-sm outline-none ring-1 ring-navy/10 focus:bg-white focus:ring-gold"
        >
          <option value="">Qual etapa?</option>
          <option value="PRE">Pré Catequese</option>
          <option value="ETAPA_1">1ª Etapa</option>
          <option value="ETAPA_2">2ª Etapa</option>
        </select>
        
        <select
          value={catechistId}
          disabled={!stage}
          onChange={(e) => setCatechistId(e.target.value)}
          className="w-full rounded-xl bg-cream/50 px-4 py-3 font-body text-sm outline-none ring-1 ring-navy/10 focus:bg-white focus:ring-gold disabled:opacity-50"
        >
          <option value="">Catequista</option>
          {availableCatechists.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={pending}
        className="mt-2 w-full rounded-xl bg-navy py-3 font-body font-semibold text-cream transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Continuar'}
      </button>
      
      <button onClick={onCancel} className="w-full font-body text-sm font-medium text-navy/40 hover:text-navy">
        Voltar para a busca
      </button>
      
      {error && <p className="text-center font-body text-sm text-red-500">{error}</p>}
    </motion.div>
  )
}