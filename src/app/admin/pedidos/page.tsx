// src/app/admin/pedidos/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminRequestsClient } from './AdminRequestsClient'

export default async function AdminRequestsPage() {
  // 1. Verificação de Sessão
  const session = await auth()
  if (!session?.user) redirect('/')

  // 2. Validação de Segurança (RBAC)
  const hasAccess =
    session.user.staffRole === 'SUPER_ADMIN' ||
    session.user.permissions?.includes('VIEW_PRAYER_REQUESTS')

  if (!hasAccess) redirect('/admin')

  // 3. Busca no banco de dados (exclusivo para formulários da Home)
  const rawRequests = await prisma.contactRequest.findMany({
    where: {
      type: {
        in: ['PRAYER_GENERAL', 'MASS_INTENTION', 'SACRAMENT', 'GENERAL_CONTACT'],
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // 4. Mapeamento DTO para bater EXATAMENTE com a tipagem do seu Client Component
  const requests = rawRequests.map((req) => ({
    id: req.id,
    type: req.type as 'PRAYER_GENERAL' | 'MASS_INTENTION' | 'SACRAMENT' | 'GENERAL_CONTACT',
    name: req.name,
    contact: req.contact ?? 'Não informado', // Fallback seguro caso seja null no banco
    message: req.message,
    preferredDate: req.preferredDate,
    sacramentType: req.sacramentType,
    wantsPublicWall: req.wantsPublicWall ?? false,
    approvedForWall: req.approvedForWall,
    status: req.status as 'PENDING' | 'APPROVED' | 'RESOLVED',
    createdAt: req.createdAt,
  }))

  // 5. Renderiza o Client Component injetando os dados higienizados
  return <AdminRequestsClient requests={requests} />
}