// src/actions/contactRequest.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requirePermission } from '@/lib/permissions'
import type { ContactRequestType, SacramentType, ContactRequestStatus } from '@prisma/client'

// 1. Criar pedido vindo da Home (Formulários completos)
export async function createContactRequest(_prevState: unknown, formData: FormData) {
  try {
    const session = await auth()

    const type = formData.get('type') as ContactRequestType
    const name = (formData.get('name') as string)?.trim()
    const contact = (formData.get('contact') as string)?.trim()
    const message = (formData.get('message') as string)?.trim()

    if (!name || !contact || !message) {
      throw new Error('Preencha nome, contato e mensagem.')
    }

    const preferredDateRaw = formData.get('preferredDate') as string
    const preferredDate = preferredDateRaw ? new Date(preferredDateRaw) : null
    const sacramentType = (formData.get('sacramentType') as SacramentType) || null
    const wantsPublicWall = formData.get('wantsPublicWall') === 'on'

    await prisma.contactRequest.create({
      data: {
        type,
        name,
        contact,
        message,
        userId: session?.user?.id ?? null,
        preferredDate,
        sacramentType,
        wantsPublicWall,
        approvedForWall: false,
        status: 'PENDING',
      },
    })

    revalidatePath('/admin/pedidos')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao enviar. Tente novamente.' }
  }
}

// 2. Atualizar status na secretaria
export async function updateContactRequestStatus(id: string, status: ContactRequestStatus) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')
    await prisma.contactRequest.update({ where: { id }, data: { status } })
    revalidatePath('/admin/pedidos')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar.' }
  }
}

// 3. Aprovar para mural público caso a secretaria queira exibir
export async function approveForWall(id: string) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')
    await prisma.contactRequest.update({ where: { id }, data: { approvedForWall: true } })
    revalidatePath('/admin/pedidos')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao aprovar.' }
  }
}