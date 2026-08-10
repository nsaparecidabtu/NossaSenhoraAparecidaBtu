// src/app/admin/catequese/components/ReportFilters.tsx
'use client'

import { useRouter } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/catechism'

export function ReportFilters({ weeks, catechists, currentFilters }: any) {
  const router = useRouter()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border border-line bg-white p-4 space-y-4 shadow-sm">
      <h3 className="font-display text-sm font-bold text-navy">Filtros do Relatório</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <select 
          value={currentFilters.weekId} 
          onChange={(e) => updateFilter('weekId', e.target.value)}
          className="w-full rounded border border-line bg-cream px-3 py-2 font-body text-sm"
        >
          <option value="all">Todas as Semanas</option>
          {weeks.map((w: any) => (
            <option key={w.id} value={w.id}>{w.title}</option>
          ))}
        </select>

        <select 
          value={currentFilters.catechistName} 
          onChange={(e) => updateFilter('catechistName', e.target.value)}
          className="w-full rounded border border-line bg-cream px-3 py-2 font-body text-sm"
        >
          <option value="all">Todos os Catequistas</option>
          {catechists.map((c: any) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select 
          value={currentFilters.stage} 
          onChange={(e) => updateFilter('stage', e.target.value)}
          className="w-full rounded border border-line bg-cream px-3 py-2 font-body text-sm"
        >
          <option value="all">Todas as Turmas</option>
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

      </div>
    </div>
  )
}