// src/app/admin/catequese/components/TabsNav.tsx
'use client'

import { useRouter } from 'next/navigation'

const TABS = [
  { id: 'semana', label: 'Semana / QR' },
  { id: 'catequistas', label: 'Catequistas' },
  { id: 'alunos', label: 'Catequizandos' },
  { id: 'relatorio', label: 'Relatório' },
  { id: 'ajuda', label: 'Manual & Ajuda' }, // <-- Nova aba global de suporte
] as const

export function TabsNav({ currentTab }: { currentTab: string }) {
  const router = useRouter()

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => router.push(`?tab=${id}`)}
          className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${
            currentTab === id ? 'border-navy bg-navy text-cream' : 'border-line text-navy/60 hover:bg-navy/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}