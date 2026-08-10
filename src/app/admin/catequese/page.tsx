// src/app/admin/catequese/page.tsx
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TabsNav } from './components/TabsNav'
import { WeekTab } from './components/tabs/WeekTab'
import { CatechistsTab } from './components/tabs/CatechistsTab'
import { StudentsTab } from './components/tabs/StudentsTab'
import { ReportTab } from './components/tabs/ReportTab'
import { HelpTab } from './components/tabs/HelpTab'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ 
    tab?: string;
    weekId?: string;
    catechistName?: string;
    stage?: string;
  }>
}

export default async function AdminCatechismPage({ searchParams }: PageProps) {
  const session = await auth()
  
  // Extraímos todos os parâmetros da URL
  const { 
    tab = 'semana', 
    weekId = 'all', 
    catechistName = 'all', 
    stage = 'all' 
  } = await searchParams

  // SEGURANÇA: Se não for admin ou líder com permissão, é expulso.
  // Nenhum componente abaixo desta linha será renderizado sem autorização.
  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user?.permissions?.includes('MANAGE_CATECHISM'))

  if (!canManage) redirect('/')

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const dynamicBaseUrl = `${protocol}://${host}`
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || dynamicBaseUrl

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Catequese</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Semana/QR, catequistas, catequizandos e relatório.
        </p>

        <TabsNav currentTab={tab} />

        <div className="mt-6">
          {tab === 'semana' && <WeekTab baseUrl={baseUrl} />}
          {tab === 'catequistas' && <CatechistsTab />}
          {tab === 'alunos' && <StudentsTab />}
          {tab === 'relatorio' && (
            <ReportTab 
              filters={{ weekId, catechistName, stage }} 
            />
          )}
          {tab === 'ajuda' && <HelpTab />}
        </div>
      </div>
    </main>
  )
}