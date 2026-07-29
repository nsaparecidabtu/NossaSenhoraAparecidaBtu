// src/actions/event.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createEvent(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_EVENTS')

    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || null
    const eventDateRaw = formData.get('eventDate') as string
    const location = (formData.get('location') as string) || null
    const imageUrl = (formData.get('imageUrl') as string) || null

    if (!title || !eventDateRaw) throw new Error('Preencha título e data.')

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDateRaw),
        location,
        imageUrl,
      },
    })

    revalidatePath('/admin/eventos')
    revalidatePath('/')
    return { success: true, data: event }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao criar evento.' }
  }
}

export async function updateEvent(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_EVENTS')

    const id = formData.get('id') as string
    if (!id) throw new Error('Evento não identificado.')

    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || null
    const eventDateRaw = formData.get('eventDate') as string
    const location = (formData.get('location') as string) || null
    const imageUrl = (formData.get('imageUrl') as string) || null

    if (!title || !eventDateRaw) throw new Error('Preencha título e data.')

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        eventDate: new Date(eventDateRaw),
        location,
        imageUrl,
      },
    })

    revalidatePath('/admin/eventos')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao salvar evento.' }
  }
}

export async function deleteEvent(id: string) {
  try {
    await requirePermission('MANAGE_EVENTS')
    await prisma.event.delete({ where: { id } })
    revalidatePath('/admin/eventos')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}