// src/app/catequese/page.tsx
import { prisma } from '@/lib/prisma'
import { CatequeseClient } from './CatechismClient'

export const dynamic = 'force-dynamic'

export default async function CatequesePage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>
}) {
  const { s: token } = await searchParams

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-6 text-center text-cream">
        <p className="font-body text-sm text-cream/70">
          Use o QR code do mural da igreja pra acessar.
        </p>
      </main>
    )
  }

  const week = await prisma.catechismWeek.findUnique({ where: { token } })

  if (!week || !week.isOpen) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-6 text-center text-cream">
        <p className="font-body text-sm text-cream/70">
          Esta semana de acolhida já foi encerrada. Procure o cartaz atualizado no mural.
        </p>
      </main>
    )
  }

  const catechists = await prisma.catechist.findMany({
    where: { active: true },
    select: { id: true, name: true, stages: true },
  })

  return <CatequeseClient token={token} catechists={catechists} />
}