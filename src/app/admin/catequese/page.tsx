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
  if (!session?.user) redirect('/')
  
  // 1. Extração de parâmetros
  const { 
    tab = 'semana', 
    weekId = 'all', 
    catechistName = 'all', 
    stage = 'all' 
  } = await searchParams

  // 2. Lógica de Escopo e Permissão Contextual (RBAC Dinâmico)
  const isSuperAdmin = session.user.staffRole === 'SUPER_ADMIN'
  const hasGlobalPermission = session.user.permissions?.includes('MANAGE_CATECHISM')
  
  // Flag que define se o usuário pode ver TODA a paróquia
  const isGlobalAdmin = isSuperAdmin || hasGlobalPermission

  let linkedCatechistId: string | null = null

  // Se NÃO for coordenador/admin, verificamos se ele possui uma turma vinculada
  if (!isGlobalAdmin) {
    const catechistProfile = await prisma.catechist.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    // Não é coordenador E não é catequista? Expulso.
    if (!catechistProfile) {
      redirect('/')
    }
    
    // Armazenamos o ID da turma dele para injetar nas abas
    linkedCatechistId = catechistProfile.id
  }

  // 3. Montagem de URL Base
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const dynamicBaseUrl = `${protocol}://${host}`
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || dynamicBaseUrl

  // 4. Trava de Rota de Componente (Um catequista comum não deve ver a aba de cadastrar outros catequistas)
  const activeTab = (!isGlobalAdmin && tab === 'catequistas') ? 'relatorio' : tab

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Catequese</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          {isGlobalAdmin 
            ? 'Gestão completa: Semanas, catequistas, alunos e relatórios da paróquia.' 
            : 'Gestão da sua turma: Lista de alunos e diário de classe.'}
        </p>

        {/* Enviamos a flag de admin para ocultar a aba "Catequistas" de quem não tem permissão */}
        <TabsNav currentTab={activeTab} isGlobalAdmin={isGlobalAdmin} />

        <div className="mt-6">
          {activeTab === 'semana' && <WeekTab baseUrl={baseUrl} />}
          
          {/* Somente coordenadores acessam o CRUD de Catequistas */}
          {activeTab === 'catequistas' && isGlobalAdmin && <CatechistsTab />}
          
          {/* Passamos o escopo para as abas para que busquem apenas os dados corretos no banco */}
          {activeTab === 'alunos' && (
            <StudentsTab 
              isGlobalAdmin={isGlobalAdmin} 
              linkedCatechistId={linkedCatechistId} 
            />
          )}
          
          {activeTab === 'relatorio' && (
            <ReportTab 
              filters={{ weekId, catechistName, stage }} 
              isGlobalAdmin={isGlobalAdmin}
              linkedCatechistId={linkedCatechistId}
            />
          )}
          
          {activeTab === 'ajuda' && <HelpTab />}
        </div>
      </div>
    </main>
  )
}