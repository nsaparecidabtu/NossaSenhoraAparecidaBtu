// src/app/teste/page.tsx
//
// Página de rascunho pra comparar visualmente a "Opção 2" (atmosfera
// litúrgica mais presente) nas 7 estações, sem precisar mudar a data do
// sistema. NÃO é uma rota definitiva — pode apagar depois de decidir.
'use client'

import { useState } from 'react'

const SEASONS = [
  { name: 'Advento', color: '#5b2a86' },
  { name: 'Natal', color: '#d4a017' },
  { name: 'Tempo Comum', color: '#2f6b3a' },
  { name: 'Quaresma', color: '#5b2a86' },
  { name: 'Semana Santa', color: '#5b2a86' },
  { name: 'Tríduo Pascal', color: '#a11d1d' },
  { name: 'Tempo Pascal', color: '#d4a017' },
] as const

export default function TestePage() {
  const [selected, setSelected] = useState<(typeof SEASONS)[number]>(SEASONS[2]) // começa em Tempo Comum

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* Barra de acento sazonal */}
      <div className="h-1.5 w-full" style={{ backgroundColor: selected.color }} />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
          Rascunho — não é uma página final
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold">
          Opção 2: atmosfera litúrgica mais presente
        </h1>

        {/* Seletor de estação */}
        <div className="mt-6 flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelected(s)}
              className="rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors"
              style={{
                borderColor: s.color,
                backgroundColor: selected.name === s.name ? s.color : 'transparent',
                color: selected.name === s.name ? '#fdfbf5' : s.color,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Pílula do hero (já existe hoje, sem mudança) */}
        <div className="mt-10">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
            Pílula do hero (já existe)
          </p>
          <span
            className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${selected.color}33`, color: selected.color }}
          >
            Tempo Litúrgico: {selected.name}
          </span>
        </div>

        {/* Seção "Sobre Nós" com fundo levemente tingido */}
        <section
          className="mt-10 rounded-lg p-6"
          style={{ backgroundColor: `${selected.color}0d` }}
        >
          <p
            className="font-body text-xs font-bold uppercase tracking-widest"
            style={{ color: selected.color }}
          >
            Sobre Nós
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
            <div className="aspect-[4/3] w-full rounded-lg bg-navy/10" />
            <div>
              <p className="font-body leading-relaxed text-navy/80">
                A Paróquia Nossa Senhora Aparecida nasceu do sonho de uma comunidade unida
                pela fé e pelo amor a Maria.
              </p>
              <button
                className="mt-4 rounded px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors"
                style={{ backgroundColor: selected.color, color: '#fdfbf5' }}
              >
                Saiba mais sobre nossa história →
              </button>
            </div>
          </div>
        </section>

        {/* Horários das Missas com cards levemente tingidos */}
        <section className="mt-10">
          <p
            className="text-center font-body text-xs font-bold uppercase tracking-widest"
            style={{ color: selected.color }}
          >
            Horários das Missas
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['Domingo', 'Segunda a Sexta', 'Sábado', 'Adoração'].map((label) => (
              <div
                key={label}
                className="rounded-lg border p-4 text-center"
                style={{
                  backgroundColor: `${selected.color}0d`,
                  borderColor: `${selected.color}40`,
                }}
              >
                <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
                  {label}
                </p>
                <p className="mt-2 font-display text-lg font-semibold">08h00</p>
              </div>
            ))}
          </div>
        </section>

        {/* Botão secundário com hover na cor sazonal */}
        <section className="mt-10">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
            Botão secundário (passe o mouse)
          </p>
          <button
            className="rounded border-2 bg-transparent px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wide transition-colors hover:text-cream"
            style={
              {
                borderColor: selected.color,
                color: selected.color,
                '--hover-bg': selected.color,
              } as React.CSSProperties
            }
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = selected.color)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Faça uma Visita
          </button>
        </section>

        <p className="mt-12 border-t border-line pt-6 font-body text-xs text-navy/40">
          Essa página é só pra comparação visual. Quando decidirem o nível de presença,
          é só apagar <code>src/app/teste/</code> e aplicar o estilo escolhido nas páginas
          de verdade.
        </p>
      </div>
    </main>
  )
}