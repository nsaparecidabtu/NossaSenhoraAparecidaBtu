// src/actions/youtubeChannels.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export type ChannelActionState = {
  success: boolean
  error?: string | null
}

// Extrai o Handle (@nome) ou o ID de qualquer formato de link colado pelo usuário[cite: 1]
function parseYoutubeInput(input: string): { type: 'HANDLE' | 'CHANNEL_ID'; value: string } | null {
  const cleanInput = input.trim()
  if (!cleanInput) return null

  // Trata URLs completas como: https://www.youtube.com/@paroquiaaparecidabotucatu ou youtube.com/@paroquia...[cite: 1]
  const handleMatch = cleanInput.match(/(?:youtube\.com\/|@)(@?[\w.-]+)/)
  if (handleMatch && handleMatch[1]) {
    const handleValue = handleMatch[1].startsWith('@') ? handleMatch[1] : `@${handleMatch[1]}`
    return { type: 'HANDLE', value: handleValue }
  }

  // Trata URLs de channelId direto: youtube.com/channel/UC...[cite: 1]
  const idMatch = cleanInput.match(/(?:youtube\.com\/channel\/)(UC[\w-]{22})/)
  if (idMatch && idMatch[1]) {
    return { type: 'CHANNEL_ID', value: idMatch[1] }
  }

  // Se o usuário digitou diretamente UC...[cite: 1]
  if (cleanInput.startsWith('UC') && cleanInput.length === 24) {
    return { type: 'CHANNEL_ID', value: cleanInput }
  }

  // Fallback caso digite apenas o handle sem @[cite: 1]
  return { type: 'HANDLE', value: cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}` }
}

/**
 * Consulta a API do Google para obter o channelId real e as métricas do canal[cite: 1]
 */
async function fetchYoutubeChannelDetails(parsedInput: { type: 'HANDLE' | 'CHANNEL_ID'; value: string }) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('Chave YOUTUBE_API_KEY não configurada no ambiente.')
  }

  let url = ''
  if (parsedInput.type === 'HANDLE') {
    // Remove o @ para consultar a API
    const handleWithoutAt = parsedInput.value.replace('@', '')
    url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${handleWithoutAt}&key=${YOUTUBE_API_KEY}`
  } else {
    url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${parsedInput.value}&key=${YOUTUBE_API_KEY}`
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Falha ao comunicar com a API do YouTube. Verifique sua chave API.')
  }

  const data = await res.json()
  if (!data.items || data.items.length === 0) {
    throw new Error(`Nenhum canal do YouTube encontrado com a informação: "${parsedInput.value}".`)
  }

  const channelItem = data.items[0]
  return {
    channelId: channelItem.id as string,
    title: channelItem.snippet.title as string,
    handle: channelItem.snippet.customUrl || parsedInput.value,
    avatarUrl: channelItem.snippet.thumbnails.high?.url || channelItem.snippet.thumbnails.default?.url,
    subscriberCount: channelItem.statistics.subscriberCount as string,
  }
}

/**
 * Cadastra um novo canal no sistema[cite: 1]
 */
export async function createYoutubeChannel(
  _prevState: unknown,
  formData: FormData
): Promise<ChannelActionState> {
  try {
    await requirePermission('MANAGE_EVENTS')

    const rawInput = (formData.get('channelUrl') as string) || ''
    const parsed = parseYoutubeInput(rawInput)

    if (!parsed) {
      return { success: false, error: 'Por favor, informe uma URL ou Handle de canal válido.' }
    }

    // Resolve o channelId e detalhes na API do Google[cite: 1]
    const details = await fetchYoutubeChannelDetails(parsed)

    // Verifica se já temos este canal cadastrado[cite: 1]
    const existing = await prisma.youtubeChannel.findUnique({
      where: { channelId: details.channelId },
    })

    if (existing) {
      return { success: false, error: `O canal "${details.title}" já está cadastrado no sistema.` }
    }

    // Se for o primeiro canal cadastrado, marca automaticamente como principal[cite: 1]
    const count = await prisma.youtubeChannel.count()
    const isPrimary = count === 0

    await prisma.youtubeChannel.create({
      data: {
        name: details.title,
        handle: details.handle,
        channelId: details.channelId,
        avatarUrl: details.avatarUrl,
        subscriberCount: details.subscriberCount,
        isPrimary,
        isActive: true,
      },
    })

    revalidatePath('/admin/ao-vivo')
    revalidatePath('/ao-vivo')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao cadastrar canal do YouTube.' }
  }
}

/**
 * Alterna a suspensão temporária do canal (Ativo x Inativo)[cite: 1]
 */
export async function toggleChannelStatus(channelId: string, currentStatus: boolean) {
  try {
    await requirePermission('MANAGE_EVENTS')

    await prisma.youtubeChannel.update({
      where: { id: channelId },
      data: { isActive: !currentStatus },
    })

    revalidatePath('/admin/ao-vivo')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao alterar status.' }
  }
}

/**
 * Define qual é o canal Principal[cite: 1]
 */
export async function setPrimaryChannel(channelId: string) {
  try {
    await requirePermission('MANAGE_EVENTS')

    // Desmarca todos os canais anteriores como principal[cite: 1]
    await prisma.$transaction([
      prisma.youtubeChannel.updateMany({ data: { isPrimary: false } }),
      prisma.youtubeChannel.update({
        where: { id: channelId },
        data: { isPrimary: true, isActive: true }, // Força estar ativo ao virar principal[cite: 1]
      }),
    ])

    revalidatePath('/admin/ao-vivo')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao definir canal principal.' }
  }
}

/**
 * Remove um canal[cite: 1]
 */
export async function deleteYoutubeChannel(channelId: string) {
  try {
    await requirePermission('MANAGE_EVENTS')

    await prisma.youtubeChannel.delete({ where: { id: channelId } })

    revalidatePath('/admin/ao-vivo')
    revalidatePath('/ao-vivo')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir canal.' }
  }
}
