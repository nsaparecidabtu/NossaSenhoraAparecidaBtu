// src/app/admin/catequese/components/CatechistsList.tsx
'use client'

import { useState, useActionState } from 'react'
import { toggleCatechistActive, updateCatechist, deleteCatechist } from '@/actions/catechism/admin-catechism'
import { STAGE_LABELS } from '@/lib/catechism'
import type { CatechismStage } from '@prisma/client'

type CatechistItem = {
  id: string
  name: string
  stages: string[]
  active: boolean
  user?: { email: string | null } | null
}

type ActionState = {
  success: boolean
  error?: string | null
}

function getStageLabel(stage: string): string {
  return STAGE_LABELS[stage as CatechismStage] || stage
}

export function CatechistsList({ catechists }: { catechists: CatechistItem[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {catechists.map((c) => (
        <div key={c.id} className="rounded-xl border border-line bg-white p-4 shadow-sm transition-all">
          {editingId !== c.id ? (
            // MODO DE VISUALIZAÇÃO
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-bold text-navy">{c.name}</p>
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${c.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-navy/60">
                  Etapas: {c.stages.map((s) => getStageLabel(s)).join(', ')}
                </p>
                {c.user?.email && (
                  <p className="font-body text-xs text-navy/40">Login: {c.user.email}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="rounded border border-line px-3 py-1 text-xs font-semibold uppercase text-navy hover:bg-navy/5 transition-colors"
                >
                  Editar
                </button>

                {/* Form de Ativar/Desativar */}
                <form action={async () => { await toggleCatechistActive(c.id, !c.active) }}>
                  <button type="submit" className={`rounded px-3 py-1 text-xs font-semibold uppercase transition-colors ${c.active ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}>
                    {c.active ? 'Desativar' : 'Reativar'}
                  </button>
                </form>

                {/* Form de Exclusão Segura */}
                <form action={async () => {
                  if (window.confirm(`Tem certeza que deseja excluir o catequista ${c.name}?`)) {
                    const res = await deleteCatechist(c.id)
                    if (res?.error) alert(res.error)
                  }
                }}>
                  <button type="submit" className="rounded px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // MODO DE EDIÇÃO INLINE
            <EditCatechistFormInline catechist={c} onCancel={() => setEditingId(null)} />
          )}
        </div>
      ))}

      {catechists.length === 0 && (
        <p className="py-6 text-center font-body text-sm text-navy/40">Nenhum catequista cadastrado.</p>
      )}
    </div>
  )
}

function EditCatechistFormInline({ catechist, onCancel }: { catechist: CatechistItem; onCancel: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateCatechist, 
    { success: false, error: null }
  )

  if (state.success) {
    onCancel()
  }

  return (
    <form action={formAction} className="space-y-3 pt-2">
      <input type="hidden" name="id" value={catechist.id} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input 
          name="name" 
          defaultValue={catechist.name} 
          required 
          className="rounded border border-line px-3 py-1.5 text-sm focus:border-gold focus:outline-none" 
        />
        <input 
          name="email" 
          type="email" 
          defaultValue={catechist.user?.email ?? ''} 
          placeholder="E-mail vinculado" 
          className="rounded border border-line px-3 py-1.5 text-sm focus:border-gold focus:outline-none" 
        />
      </div>

      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-navy/60">Editar Etapas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(STAGE_LABELS) as CatechismStage[]).map((stage) => (
            <label key={stage} className="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                name="stages" 
                value={stage} 
                defaultChecked={catechist.stages.includes(stage)} 
                className="h-3.5 w-3.5 rounded border-line text-navy focus:ring-gold"
              />
              {STAGE_LABELS[stage]}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="rounded border border-line px-3 py-1 text-xs font-semibold uppercase text-navy/70 hover:bg-black/5 transition-colors">
          Cancelar
        </button>
        <button disabled={pending} className="rounded bg-navy px-4 py-1 text-xs font-semibold uppercase text-cream hover:bg-gold hover:text-navy transition-colors">
          {pending ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>

      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  )
}