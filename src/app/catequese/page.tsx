// src/app/catequese/page.tsx
import { auth, signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getTodayEligibleMasses, isoWeekKey } from '@/lib/catechism'
import { PresencaClient } from './PresencaClient'

export const dynamic = 'force-dynamic'

export default async function PresencaPage() {
  const session = await auth()

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16 text-navy">
        <div className="mx-auto max-w-sm text-center">
          <h1 className="font-display text-2xl font-bold">Presença na Catequese</h1>
          <p className="mt-3 font-body text-sm text-navy/60">
            Entre com Google pra marcar a presença do seu filho (ou a sua, se você é o aluno).
          </p>
          <form
            action={async () => {
              'use server'
              await signIn('google')
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="rounded bg-navy px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream"
            >
              Entrar com Google
            </button>
          </form>
        </div>
      </main>
    )
  }

  const [students, massSchedules] = await Promise.all([
    prisma.catechismStudent.findMany({
      where: { guardianEmail: session.user.email, active: true },
    }),
    prisma.massSchedule.findMany({ orderBy: { order: 'asc' } }),
  ])

  const eligibleMasses = getTodayEligibleMasses(massSchedules)

  const thisWeek = isoWeekKey(new Date())
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)

  const recentAttendances = students.length
    ? await prisma.catechismAttendance.findMany({
        where: {
          studentId: { in: students.map((s) => s.id) },
          attendedAt: { gte: weekStart },
        },
      })
    : []

  const studentsWithStatus = students.map((s) => ({
    ...s,
    markedThisWeek: recentAttendances.some(
      (a) => a.studentId === s.id && isoWeekKey(a.attendedAt) === thisWeek
    ),
  }))

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-2xl font-bold">Presença na Catequese</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Um compromisso simples: pelo menos uma missa por semana. Marque com honestidade — a
          catequese confia em você.
        </p>

        <PresencaClient students={studentsWithStatus} eligibleMasses={eligibleMasses} />
      </div>
    </main>
  )
}