// src/app/admin/liturgico/AdminLiturgicoClient.tsx
'use client'

import { useActionState } from 'react'
import { createLiturgicalOverride, deleteLiturgicalOverride } from '@/actions/liturgicalOverride'

type Override = {
  id: string
  label: string
  startDate: Date
  endDate: Date
  colorHex: string
}

type ActionState = { success: boolean; error?: string }

const PRESETS = [
  { label: 'Roxo (Advento/Quaresma)', value: '#5b2a86' },
  { label: 'Dourado (Natal/Páscoa)', value: '#d4a017' },
  { label: 'Verde (Tempo Comum)', value: '#2f6b3a' },
  { label: 'Vermelho (Tríduo/Mártires)', value: '#a11d1d' },
  { label: 'Rosa (Gaudete/Laetare)', value: '#c9838f' },
  { label: 'Azul (Mariano)', value: '#1e5f9c' },
  { label: 'Preto (Luto)', value: '#2b2b2b' },
]

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function AdminLiturgicoClient({ overrides }: { overrides: Override[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createLiturgicalOverride,
    { success: false }
  )

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Cores Litúrgicas Especiais</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Cadastre uma cor manual pra um período (ex: novena, tríduo, festa específica). Enquanto
          a data de hoje estiver dentro do período, essa cor tem prioridade sobre o cálculo
          automático (Advento, Quaresma, Festa da Padroeira, etc.).
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Nome/ocasião
            </label>
            <input
              name="label"
              required
              placeholder="Ex: Novena da Padroeira"
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
                Início
              </label>
              <input
                name="startDate"
                type="date"
                required
                className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
                Fim
              </label>
              <input
                name="endDate"
                type="date"
                required
                className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
              Cor
            </label>
            <input
              name="colorHex"
              type="color"
              defaultValue="#1e5f9c"
              className="mt-1 h-10 w-20 rounded border border-line"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <span
                  key={p.value}
                  title={p.label}
                  className="h-6 w-6 rounded-full border border-line"
                  style={{ backgroundColor: p.value }}
                />
              ))}
            </div>
            <p className="mt-1 font-body text-xs text-navy/40">
              Use o seletor de cor acima — as bolinhas são só referência das cores litúrgicas
              tradicionais.
            </p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
          >
            {pending ? 'Salvando...' : 'Adicionar Cor Especial'}
          </button>

          {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
        </form>

        <div className="mt-8 space-y-3">
          {overrides.map((o) => (
            <div key={o.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-line"
                    style={{ backgroundColor: o.colorHex }}
                  />
                  <div>
                    <p className="font-display font-semibold">{o.label}</p>
                    <p className="font-body text-xs text-navy/50">
                      {fmtDate(o.startDate)} até {fmtDate(o.endDate)}
                    </p>
                  </div>
                </div>
                <form
                  action={async () => {
                    await deleteLiturgicalOverride(o.id)
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