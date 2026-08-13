// src/lib/permissions.ts
import { auth } from '@/auth'
import type { StaffPermission } from '@prisma/client'

/**
 * Exige estritamente que o usuário logado seja SUPER_ADMIN.
 */
export async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Não autorizado. Faça login para continuar.')
  }

  if (session.user.staffRole !== 'SUPER_ADMIN') {
    throw new Error('Acesso negado. Apenas Administradores Gerais têm essa permissão.')
  }

  return session
}

/**
 * Exige uma permissão granular específica OU acesso de SUPER_ADMIN.
 */
export async function requirePermission(permission: StaffPermission) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Não autorizado. Faça login para continuar.')
  }

  // Super Admin possui passe livre para qualquer permissão do sistema
  if (session.user.staffRole === 'SUPER_ADMIN') {
    return session
  }

  // Para STAFF ou MINISTRY_LEADER, verifica se a permissão está listada no seu array de permissões
  const hasPermission = session.user.permissions?.includes(permission)

  if (!hasPermission) {
    throw new Error(`Acesso negado. Você não possui a permissão: ${permission}`)
  }

  return session
}