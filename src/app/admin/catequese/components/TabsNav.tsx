// src/app/admin/catequese/components/TabsNav.tsx
'use client'

import { useRouter } from 'next/navigation'

// 1. Adicionamos a flag `requiresAdmin` para escalar facilmente o controle de acesso
const TABS = [
  { id: 'semana', label: 'Semana / QR', requiresAdmin: false },
  { id: 'catequistas', label: 'Catequistas', requiresAdmin: true }, // Protegido
  { id: 'alunos', label: 'Catequizandos', requiresAdmin: false },
  { id: 'relatorio', label: 'Relatório', requiresAdmin: false },
  { id: 'ajuda', label: 'Manual & Ajuda', requiresAdmin: false },
] as const

// 2. Atualizamos a tipagem para aceitar a prop isGlobalAdmin
export function TabsNav({ 
  currentTab, 
  isGlobalAdmin 
}: { 
  currentTab: string
  isGlobalAdmin: boolean 
}) {
  const router = useRouter()

  // 3. Filtramos dinamicamente: se a aba exige admin e o usuário não é, removemos da tela
  const visibleTabs = TABS.filter((tab) => !tab.requiresAdmin || isGlobalAdmin)

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {visibleTabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => router.push(`?tab=${id}`)}
          className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${
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