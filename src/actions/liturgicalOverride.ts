// src/actions/liturgicalOverride.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createLiturgicalOverride(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_LITURGICAL_THEME')

    const label = formData.get('label') as string
    const startDateRaw = formData.get('startDate') as string
    const endDateRaw = formData.get('endDate') as string
    const colorHex = formData.get('colorHex') as string

    if (!label || !startDateRaw || !endDateRaw || !colorHex) {
      throw new Error('Preencha todos os campos.')
    }

    const startDate = new Date(startDateRaw)
    const endDate = new Date(endDateRaw)
    if (endDate < startDate) {
      throw new Error('A data final não pode ser antes da data inicial.')
    }

    const override = await prisma.liturgicalOverride.create({
      data: { label, startDate, endDate, colorHex },
    })

    revalidatePath('/admin/liturgico')
    revalidatePath('/')
    return { success: true, data: override }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao criar cor especial.' }
  }
}

export async function deleteLiturgicalOverride(id: string) {
  try {
    await requirePermission('MANAGE_LITURGICAL_THEME')
    await prisma.liturgicalOverride.delete({ where: { id } })
    revalidatePath('/admin/liturgico')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}