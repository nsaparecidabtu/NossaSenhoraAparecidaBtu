// src/actions/prayers.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

// 1. Alternar visibilidade no mural da Live
export async function togglePrayerWallApproval(id: string, currentStatus: boolean) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')

    await prisma.contactRequest.update({
      where: { id },
      data: { approvedForWall: !currentStatus },
    })

    revalidatePath('/admin/pedidosLive')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao moderar intenção.' }
  }
}

// 2. Arquivar pedido da Live (marcar como lido)
export async function archivePrayer(id: string) {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')

    await prisma.contactRequest.update({
      where: { id },
      data: {
        approvedForWall: false,
        status: 'RESOLVED',
      },
    })

    revalidatePath('/admin/pedidosLive')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao arquivar intenção.' }
  }
}

// 3. Enviar pedido pela tela do Ao Vivo
export async function submitLivePrayer(formData: FormData) {
  try {
    const name = (formData.get('name') as string)?.trim()
    const message = (formData.get('message') as string)?.trim()
    const shareOnWall = formData.get('shareOnWall') === 'on'

    if (!name || !message) {
      return { success: false, error: 'Por favor, preencha nome e intenção.' }
    }

    await prisma.contactRequest.create({
      data: {
        type: 'LIVE_PRAYER',
        name,
        contact: name, // Garantia anti-quebra caso o banco exija o campo contact
        message,
        approvedForWall: false, // Nasce oculto, staff aprova
        status: 'PENDING',
      },
    })

    revalidatePath('/admin/pedidosLive')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Erro ao enviar oração ao vivo:', error)
    return { success: false, error: 'Falha ao registrar oração no servidor.' }
  }
}

// 4. Limpar todo o mural (Fim da Missa)
export async function clearLiveWall() {
  try {
    await requirePermission('VIEW_PRAYER_REQUESTS')

    await prisma.contactRequest.updateMany({
      where: {
        type: 'LIVE_PRAYER',
        approvedForWall: true,
      },
      data: {
        approvedForWall: false,
        status: 'RESOLVED',
      },
    })

    revalidatePath('/admin/pedidosLive')
    revalidatePath('/ao-vivo')
    return { success: true, message: 'Mural limpo com sucesso!' }
  } catch (error) {
    return { success: false, error: 'Falha ao limpar o mural.' }
  }
}