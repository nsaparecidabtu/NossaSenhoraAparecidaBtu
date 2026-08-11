import { prisma } from '@/lib/prisma'
import { STAGE_LABELS } from '@/lib/catechism'
import { toggleCatechistActive } from '@/actions/catechism/admin-catechism'
import { CreateCatechistForm } from '../forms/CreateCatechistForm'

export async function CatechistsTab() {
  const catechists = await prisma.catechist.findMany({ 
    orderBy: { name: 'asc' } 
  })

  return (
    <div className="space-y-4 animate-[fadein_0.3s_ease]">
      <CreateCatechistForm />
      
      <div className="space-y-2">
        {catechists.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-line bg-white p-3 shadow-sm">
            <div>
              <p className="font-body text-sm font-semibold">{c.name}</p>
              <p className="font-body text-xs text-navy/50">
                {c.stages.map((s) => STAGE_LABELS[s]).join(', ')}
              </p>
            </div>
            <form action={async () => {
              'use server'
              await toggleCatechistActive(c.id, !c.active)
            }}>
              <button
                type="submit"
                className={`rounded px-3 py-1 font-body text-xs font-semibold uppercase transition-colors hover:bg-black/5 ${
                  c.active ? 'text-red-600' : 'text-green-700'
                }`}
              >
                {c.active ? 'Desativar' : 'Reativar'}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}