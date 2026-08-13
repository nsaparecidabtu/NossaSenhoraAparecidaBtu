// src/app/admin/catequese/components/tabs/ReportTab.tsx
import { prisma } from '@/lib/prisma'
import { STAGE_LABELS } from '@/lib/catechism'
import { deleteAttendance } from '@/actions/catechism/admin-catechism'
import { ReportFilters } from '../ReportFilters'
import { ExportButtons } from '../ExportButtons'
import { ManualAttendanceForm } from '../forms/ManualAttendanceForm'
import type { CatechismStage } from '@prisma/client'

function fmtTime(date: Date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStageLabel(stage?: string | null): string {
  if (!stage) return 'N/A'
  return STAGE_LABELS[stage as CatechismStage] || stage
}

type ReportFiltersProps = {
  weekId: string
  catechistName: string
  stage: string
}

type ReportTabProps = {
  filters: ReportFiltersProps
  isGlobalAdmin: boolean
  linkedCatechistId: string | null
}

export async function ReportTab({ filters, isGlobalAdmin, linkedCatechistId }: ReportTabProps) {
  // 1. Buscamos os dados auxiliares respeitando o escopo de acesso do usuário
  const [weeks, catechists, openWeek, students] = await Promise.all([
    prisma.catechismWeek.findMany({ orderBy: { startsAt: 'desc' } }),
    prisma.catechist.findMany({
      where: isGlobalAdmin ? undefined : { id: linkedCatechistId ?? undefined },
      orderBy: { name: 'asc' },
    }),
    prisma.catechismWeek.findFirst({ where: { isOpen: true } }),
    prisma.catechismStudent.findMany({
      where: isGlobalAdmin ? { active: true } : { active: true, catechistId: linkedCatechistId ?? undefined },
      orderBy: { name: 'asc' },
    }),
  ])

  // 2. Construímos a cláusula WHERE relacional estrita
  const whereClause: any = {}

  if (filters.weekId !== 'all') {
    whereClause.weekId = filters.weekId
  }

  // Filtragem por etapa através da relação do aluno
  if (filters.stage !== 'all') {
    whereClause.student = { stage: filters.stage as CatechismStage }
  }

  // Controle de escopo por Catequista
  if (isGlobalAdmin) {
    if (filters.catechistName !== 'all') {
      whereClause.catechist = { name: filters.catechistName }
    }
  } else if (linkedCatechistId) {
    whereClause.catechistId = linkedCatechistId
  }

  // 3. Executamos a busca com JOINs relacionais otimizados
  const attendancesRaw = await prisma.catechismAttendance.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      week: { select: { title: true } },
      student: { select: { name: true, stage: true } },
      catechist: { select: { name: true } },
    },
  })

  // 4. Mapeamento dos dados para garantir compatibilidade total com ExportButtons e Renderização
  const attendances = attendancesRaw.map((a) => ({
    ...a,
    studentName: a.student?.name ?? 'Aluno não identificado',
    stage: a.student?.stage ?? null,
    catechistName: a.catechist?.name ?? 'Catequista não identificado',
  }))

  return (
    <div className="space-y-4 font-body animate-[fadein_0.3s_ease]">
      {openWeek && <ManualAttendanceForm weekId={openWeek.id} students={students} />}

      {/* Filtros visíveis apenas para Administrador Global */}
      {isGlobalAdmin && (
        <ReportFilters
          weeks={weeks}
          catechists={catechists}
          currentFilters={filters}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-navy/50">
          {attendances.length} registro(s) encontrado(s).
        </p>
        {attendances.length > 0 && (
          <ExportButtons data={attendances} />
        )}
      </div>

      <div className="space-y-2">
        {attendances.map((a) => (
          <div key={a.id} className="rounded-lg border border-line bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-navy">{a.studentName}</p>
                <p className="text-xs text-navy/60">
                  {getStageLabel(a.stage)} · {a.massLabel} · {a.catechistName}
                </p>
                <p className="mt-1 font-mono text-[11px] text-navy/40">
                  Semana: {a.week.title} · registrado em {fmtTime(a.createdAt)} · {a.source === 'SELF' ? 'auto (fiel)' : 'manual'}
                </p>
                {a.note && <p className="mt-1 text-xs text-navy/50 italic">{a.note}</p>}
              </div>

              <form action={async () => {
                'use server'
                await deleteAttendance(a.id)
              }}>
                <button
                  type="submit"
                  className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                >
                  Remover
                </button>
              </form>
            </div>
          </div>
        ))}

        {attendances.length === 0 && (
          <p className="py-6 text-center text-sm text-navy/40">Nenhum registro de presença encontrado.</p>
        )}
      </div>
    </div>
  )
}