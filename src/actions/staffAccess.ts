// src/actions/staffAccess.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/permissions'
import type { StaffPermission, StaffRole } from '@prisma/client'

const ALL_PERMISSIONS: StaffPermission[] = [
  'VIEW_PRAYER_REQUESTS',
  'MANAGE_TITHE_RAFFLE',
  'MANAGE_EVENTS',
  'MANAGE_GALLERY',
  'MANAGE_MASS_SCHEDULE',
  'MANAGE_MINISTRIES',
  'MANAGE_FAQ',
  'MANAGE_LITURGICAL_THEME',
  'MANAGE_TESTIMONIALS',
  'MANAGE_CATECHISM',
]

export async function updateStaffAccess(_prevState: unknown, formData: FormData) {
  try {
    // Exige estritamente o papel de SUPER_ADMIN
    const session = await requireSuperAdmin()

    const userId = formData.get('userId') as string
    if (!userId) throw new Error('Usuário não identificado.')

    const staffRoleRaw = (formData.get('staffRole') as string)?.trim()
    const staffRole = (!staffRoleRaw || staffRoleRaw === '' ? null : staffRoleRaw) as StaffRole | null

    // Impede o Super Admin logado de remover o próprio papel de Super Admin por engano
    if (userId === session.user.id && staffRole !== 'SUPER_ADMIN') {
      throw new Error('Você não pode remover seu próprio acesso de Super Admin por aqui.')
    }

    const permissions =
      staffRole === 'STAFF' || staffRole === 'MINISTRY_LEADER'
        ? ALL_PERMISSIONS.filter((p) => formData.getAll('permissions').includes(p))
        : []

    await prisma.user.update({
      where: { id: userId },
      data: {
        staffRole,
        permissions,
      },
    })

    revalidatePath('/admin/usuarios')
    return { success: true, error: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar acesso.' }
  }
}