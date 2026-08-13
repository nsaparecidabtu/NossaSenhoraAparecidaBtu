// src/actions/prayers.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function togglePrayerWallApproval(id: string, currentStatus: boolean) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')

    await prisma.contactRequest.update({
      where: { id },
      data: { approvedForWall: !currentStatus },
    })

    revalidatePath('/admin/pedidos')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao moderar intenção.' }
  }
}

export async function archivePrayer(id: string) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')

    await prisma.contactRequest.update({
      where: { id },
      data: { status: 'RESOLVED' },
    })

    revalidatePath('/admin/pedidos')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao arquivar.' }
  }
}

export async function submitLivePrayer(formData: FormData) {
  try {
    const name = (formData.get('name') as string)?.trim()
    const message = (formData.get('message') as string)?.trim()
    const shareOnWall = formData.get('shareOnWall') === 'on'

    if (!name || !message) {
      return { success: false, error: 'Por favor, preencha nome e intenção.' }
    }

    // Criamos o registro. Se o usuário marcou o check, 
    // podemos salvar a intenção dele, mas o 'approvedForWall' 
    // pode ser setado aqui ou deixado como falso para o Admin aprovar.
    await prisma.contactRequest.create({
      data: {
        type: 'PRAYER',
        name,
        message,
        // Se o admin quiser aprovar automático caso o fiel peça, use: shareOnWall
        // Caso queira moderação obrigatória para tudo, use: false
        approvedForWall: shareOnWall ? false : false, 
        status: 'PENDING',
      },
    })

    revalidatePath('/admin/pedidos')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Erro ao enviar oração:', error)
    return { success: false, error: 'Falha ao registrar oração no servidor.' }
  }
}