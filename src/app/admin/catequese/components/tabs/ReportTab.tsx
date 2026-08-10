// src/app/admin/catequese/components/tabs/ReportTab.tsx
import { prisma } from '@/lib/prisma'
import { STAGE_LABELS } from '@/lib/catechism'
import { deleteAttendance } from '@/actions/catechism'
import { ReportFilters } from '../ReportFilters'
import { ExportButtons } from '../ExportButtons'
import { ManualAttendanceForm } from '../forms/ManualAttendanceForm'

function fmtTime(date: Date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

type ReportFiltersProps = {
  weekId: string;
  catechistName: string;
  stage: string;
}

export async function ReportTab({ filters }: { filters: ReportFiltersProps }) {
  // 1. Buscamos os dados auxiliares para popular os selects de filtro e formulários
  const [weeks, catechists, openWeek, students] = await Promise.all([
    prisma.catechismWeek.findMany({ orderBy: { startsAt: 'desc' } }),
    prisma.catechist.findMany({ orderBy: { name: 'asc' } }),
    prisma.catechismWeek.findFirst({ where: { isOpen: true } }),
    prisma.catechismStudent.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  ])

  // 2. Construímos a query condicional baseada na URL
  const whereClause: any = {}
  if (filters.weekId !== 'all') whereClause.weekId = filters.weekId
  if (filters.catechistName !== 'all') whereClause.catechistName = filters.catechistName
  if (filters.stage !== 'all') whereClause.stage = filters.stage

  // 3. Executamos a busca otimizada de presenças
  const attendances = await prisma.catechismAttendance.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { week: { select: { title: true } } }
  })

  return (
    <div className="space-y-4 animate-[fadein_0.3s_ease]">
      {openWeek && <ManualAttendanceForm weekId={openWeek.id} students={students} />}

      {/* Componente Client responsável apenas por mudar a URL */}
      <ReportFilters 
        weeks={weeks} 
        catechists={catechists} 
        currentFilters={filters} 
      />

        
      <div className="flex items-center justify-between">
        <p className="font-body text-xs text-navy/50">
          {attendances.length} registro(s) encontrado(s).
        </p>
        {attendances.length > 0 && (
          <ExportButtons data={attendances} />
        )}
      </div>

      <div className="space-y-2">
        {attendances.map((a) => (
          <div key={a.id} className="rounded-lg border border-line bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-body text-sm font-semibold">{a.studentName}</p>
                <p className="font-body text-xs text-navy/50">
                  {STAGE_LABELS[a.stage] ?? a.stage} · {a.massLabel} · {a.catechistName}
                </p>
                <p className="mt-1 font-mono text-[11px] text-navy/40">
                  Semana: {a.week.title} · preenchido em {fmtTime(a.createdAt)} · {a.source === 'SELF' ? 'auto' : 'manual'}
                </p>
                {a.note && <p className="font-body text-xs text-navy/40">{a.note}</p>}
              </div>
              <form action={async () => {
                'use server'
                await deleteAttendance(a.id)
              }}>
                <button type="submit" className="shrink-0 font-body text-xs font-semibold text-red-600 hover:underline">
                  Remover
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}