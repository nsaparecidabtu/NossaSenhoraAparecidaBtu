// src/actions/ministry.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createMinistry(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_MINISTRIES')

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = (formData.get('description') as string) || null
    const contactInfo = (formData.get('contactInfo') as string) || null
    const meetingSchedule = (formData.get('meetingSchedule') as string) || null
    const order = Number(formData.get('order') ?? 0)

    if (!name || !slug) throw new Error('Preencha nome e slug.')

    const ministry = await prisma.ministry.create({
      data: { name, slug, description, contactInfo, meetingSchedule, order },
    })

    revalidatePath('/admin/ministerios')
    revalidatePath('/')
    return { success: true, data: ministry }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Já existe um ministério com esse slug.' }
    }
    return { success: false, error: error.message || 'Falha ao criar ministério.' }
  }
}

export async function updateMinistry(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_MINISTRIES')

    const id = formData.get('id') as string
    if (!id) throw new Error('Ministério não identificado.')

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = (formData.get('description') as string) || null
    const contactInfo = (formData.get('contactInfo') as string) || null
    const meetingSchedule = (formData.get('meetingSchedule') as string) || null
    const order = Number(formData.get('order') ?? 0)

    if (!name || !slug) throw new Error('Preencha nome e slug.')

    await prisma.ministry.update({
      where: { id },
      data: { name, slug, description, contactInfo, meetingSchedule, order },
    })

    revalidatePath('/admin/ministerios')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Já existe um ministério com esse slug.' }
    }
    return { success: false, error: error.message || 'Falha ao salvar ministério.' }
  }
}

export async function deleteMinistry(id: string) {
  try {
    await requirePermission('MANAGE_MINISTRIES')
    // Membros (User.ministryId) ficam com ministryId = null automaticamente
    // — a FK está configurada com ON DELETE SET NULL na migration.
    await prisma.ministry.delete({ where: { id } })
    revalidatePath('/admin/ministerios')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}