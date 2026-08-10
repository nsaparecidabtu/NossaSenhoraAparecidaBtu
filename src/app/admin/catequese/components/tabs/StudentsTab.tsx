import { prisma } from '@/lib/prisma'
import { STAGE_LABELS } from '@/lib/catechism'
import { toggleStudentActive } from '@/actions/catechism'
import { CreateStudentForm } from '../forms/CreateStudentForm'

export async function StudentsTab() {
  const [students, catechists] = await Promise.all([
    prisma.catechismStudent.findMany({
      orderBy: { name: 'asc' },
      include: { catechist: { select: { name: true } } },
    }),
    prisma.catechist.findMany({ 
      where: { active: true },
      orderBy: { name: 'asc' } 
    })
  ])

  return (
    <div className="space-y-4 animate-[fadein_0.3s_ease]">
      <CreateStudentForm catechists={catechists} />
      
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-line bg-white p-3 shadow-sm">
            <div>
              <p className="font-body text-sm font-semibold">{s.name}</p>
              <p className="font-body text-xs text-navy/50">
                {STAGE_LABELS[s.stage]} · catequista {s.catechist.name}
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
      </div>
    </div>
  )
}