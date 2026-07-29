// src/lib/permissions.ts

import { auth } from '@/auth'
import type { StaffPermission } from '@prisma/client'

export async function requirePermission(permission: StaffPermission) {
  const session = await auth()
  if (!session?.user) throw new Error('Não autenticado.')

  if (session.user.staffRole === 'SUPER_ADMIN') return session

  if (
    session.user.staffRole === 'MINISTRY_LEADER' &&
    session.user.permissions.includes(permission)
  ) {
    return session
  }

  throw new Error('Acesso negado.')
}

export async function requireSuperAdmin() {
  const session = await auth()
  if (session?.user?.staffRole !== 'SUPER_ADMIN') throw new Error('Acesso negado.')
  return session
}