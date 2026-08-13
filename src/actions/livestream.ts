// src/actions/livestream.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'
import type { LiveStreamMode } from '@prisma/client'

export type LiveStreamActionState = {
  success: boolean
  error?: string | null
}

function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : url.trim()
}

export async function updateLiveStreamSettings(
  _prevState: unknown,
  formData: FormData
): Promise<LiveStreamActionState> {
  try {
    await requirePermission('MANAGE_EVENTS')

    const rawUrl = (formData.get('youtubeUrl') as string) || ''
    const mode = (formData.get('mode') as LiveStreamMode) || 'AUTO'
    const isLiveNow = formData.get('isLiveNow') === 'true'
    
    // Suporte a múltiplos canais separados por vírgula
    const youtubeChannelId = (formData.get('youtubeChannelId') as string) || null

    const youtubeVideoId = extractYoutubeVideoId(rawUrl)

    await prisma.liveStreamSettings.upsert({
      where: { id: 'singleton' },
      update: {
        mode,
        youtubeVideoId,
        youtubeChannelId,
        isLiveNow,
      },
      create: {
        id: 'singleton',
        mode,
        youtubeVideoId,
        youtubeChannelId,
        isLiveNow,
      },
    })

    revalidatePath('/ao-vivo')
    revalidatePath('/')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar transmissão.' }
  }
}