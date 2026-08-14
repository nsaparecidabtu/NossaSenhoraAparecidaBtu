// src/app/admin/ao-vivo/components/TabsNavAoVivo.tsx
'use client'

import { useRouter } from 'next/navigation'

const TABS = [
  { id: 'canais', label: 'Canais & Controle' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

export function TabsNavAoVivo({ currentTab }: { currentTab: string }) {
  const router = useRouter()

  return (
    <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => router.push(`?tab=${id}`)}
          className={`rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${
            currentTab === id 
              ? 'border-navy bg-navy text-cream' 
              : 'border-line text-navy/60 hover:bg-navy/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
