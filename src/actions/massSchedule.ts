// src/actions/massSchedule.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createMassSchedule(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_MASS_SCHEDULE')

    const label = formData.get('label') as string
    const timesRaw = formData.get('times') as string
    const order = Number(formData.get('order') ?? 0)

    if (!label || !timesRaw) throw new Error('Preencha o rótulo e ao menos um horário.')

    const times = timesRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (times.length === 0) throw new Error('Informe ao menos um horário válido.')

    const schedule = await prisma.massSchedule.create({
      data: { label, times, order },
    })

    revalidatePath('/admin/horarios')
    revalidatePath('/')
    return { success: true, data: schedule }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao criar horário.' }
  }
}

export async function deleteMassSchedule(id: string) {
  try {
    await requirePermission('MANAGE_MASS_SCHEDULE')
    await prisma.massSchedule.delete({ where: { id } })
    revalidatePath('/admin/horarios')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}