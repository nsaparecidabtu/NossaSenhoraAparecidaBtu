// src/app/admin/catequese/components/tabs/CatechistsTab.tsx
import { prisma } from '@/lib/prisma'
import { CreateCatechistForm } from '../forms/CreateCatechistForm'
import { CatechistsList } from '../CatechistsList'

export async function CatechistsTab() {
  // Buscamos os catequistas e incluímos o e-mail do usuário atrelado
  const catechists = await prisma.catechist.findMany({ 
    orderBy: { name: 'asc' },
    include: {
      user: { select: { email: true } }
    }
  })

  return (
    <div className="space-y-6 animate-[fadein_0.3s_ease]">
      <CreateCatechistForm />
      
      <div>
        <p className="mb-3 font-body text-xs font-bold uppercase tracking-wide text-navy/50">
          Equipe de Catequistas
        </p>
        <CatechistsList catechists={catechists} />
      </div>
    </div>
  )
}