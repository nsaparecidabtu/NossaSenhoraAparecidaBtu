// src/app/admin/catequese/components/forms/CreateCatechistForm.tsx
'use client'

import { useActionState } from 'react'
import { createCatechist } from '@/actions/catechism/admin-catechism'
import { STAGE_LABELS } from '@/lib/catechism'
import type { CatechismStage } from '@prisma/client'

export function CreateCatechistForm() {
  const [state, formAction, pending] = useActionState(createCatechist, { success: false })

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-line bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="font-display text-base sm:text-lg font-bold text-navy">Cadastrar Catequista</h2>
      
      <div className="grid gap-3 sm:grid-cols-2">
        <input 
          name="name" 
          required 
          placeholder="Nome Completo" 
          className="w-full rounded border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none" 
        />
        <input 
          name="email" 
          type="email" 
          placeholder="E-mail (para login opcional)" 
          className="w-full rounded border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none" 
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">Etapas permitidas</p>
        {/* Mobile First: 1 coluna no celular, 2 colunas a partir de sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(STAGE_LABELS) as CatechismStage[]).map((stage) => (
            <label key={stage} className="flex items-center gap-2.5 rounded border border-line/60 p-2 text-sm bg-cream/30 hover:bg-cream/60 cursor-pointer transition-colors">
              <input type="checkbox" name="stages" value={stage} className="h-4 w-4 rounded border-line text-navy focus:ring-gold" />
              <span className="font-medium text-navy">{STAGE_LABELS[stage]}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        disabled={pending} 
        className="w-full rounded bg-navy py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
      >
        {pending ? 'Salvando...' : 'Criar Catequista'}
      </button>
      
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  )
}