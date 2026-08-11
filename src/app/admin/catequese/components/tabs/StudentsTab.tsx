// src/app/admin/catequese/components/tabs/StudentsTab.tsx
import { prisma } from '@/lib/prisma'
import { STAGE_LABELS } from '@/lib/catechism'
import { toggleStudentActive } from '@/actions/catechism/admin-catechism'
import { CreateStudentForm } from '../forms/CreateStudentForm'
import type { CatechismStage } from '@prisma/client'

type StudentsTabProps = {
  isGlobalAdmin: boolean
  linkedCatechistId: string | null
}

function getStageLabel(stage: string): string {
  return STAGE_LABELS[stage as CatechismStage] || stage
}

export async function StudentsTab({ isGlobalAdmin, linkedCatechistId }: StudentsTabProps) {
  // 1. Construímos a condição de filtro de acordo com o nível de acesso
  const studentWhere: any = {}
  
  if (!isGlobalAdmin && linkedCatechistId) {
    studentWhere.catechistId = linkedCatechistId
  }

  // 2. Buscamos dados em paralelo respeitando o escopo
  const [students, catechists] = await Promise.all([
    prisma.catechismStudent.findMany({
      where: studentWhere,
      orderBy: { name: 'asc' },
      include: { catechist: { select: { name: true } } },
    }),
    prisma.catechist.findMany({ 
      where: isGlobalAdmin ? { active: true } : { id: linkedCatechistId ?? undefined },
      orderBy: { name: 'asc' } 
    })
  ])

  return (
    <div className="space-y-4 animate-[fadein_0.3s_ease]">
      {/* Opcional: Se for admin global, exibe o form de criação. Catequista comum gerencia apenas os seus alunos se permitido */}
      <CreateStudentForm catechists={catechists} />
      
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-line bg-white p-3 shadow-sm">
            <div>
              <p className="font-body text-sm font-semibold">{s.name}</p>
              <p className="font-body text-xs text-navy/50">
                {getStageLabel(s.stage)} · catequista {s.catechist.name}
              </p>
            </div>
            <form action={async () => {
              'use server'
              await toggleStudentActive(s.id, !s.active)
            }}>
              <button
                type="submit"
                className={`rounded px-3 py-1 font-body text-xs font-semibold uppercase transition-colors hover:bg-black/5 ${
                  s.active ? 'text-red-600' : 'text-green-700'
                }`}
              >
                {s.active ? 'Desativar' : 'Reativar'}
              </button>
            </form>
          </div>
        ))}
        {students.length === 0 && (
          <p className="font-body text-sm text-navy/40">Nenhum catequizando encontrado para esta turma.</p>
        )}
      </div>
    </div>
  )
}