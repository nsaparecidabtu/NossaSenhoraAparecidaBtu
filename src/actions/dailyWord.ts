'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/permissions'
import { generateDailyWord } from '@/lib/dailyWord'

export async function generateAndSaveDailyWord() {
  try {
    await requireSuperAdmin()
    return await generateDailyWord()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      error: error.message || 'Falha ao gerar a Palavra do Dia.',
    }
  }
}

// O pároco escreve na mão — sobrescreve (ou cria) a de hoje, sem passar
// pelo Gemini. Mesma trava de "uma por dia" que o gerador automático usa.
export async function saveManualDailyWord(_prevState: unknown, formData: FormData) {
  try {
    await requireSuperAdmin()

    const text = (formData.get('text') as string)?.trim()
    const verseReference = (formData.get('verseReference') as string)?.trim() || '-'
    const reflection = (formData.get('reflection') as string)?.trim() || null

    if (!text) throw new Error('Escreva o texto da Palavra do Dia.')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.dailyWord.findFirst({
      where: { date: { gte: today } },
    })

    if (existing) {
      await prisma.dailyWord.update({
        where: { id: existing.id },
        data: { text, verseReference, reflection },
      })
    } else {
      await prisma.dailyWord.create({
        data: { text, verseReference, reflection, date: new Date() },
      })
    }
const instagramReelUrl = (formData.get('instagramReelUrl') as string)?.trim() || null

    revalidatePath('/')
    revalidatePath('/admin/palavra-do-dia')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao salvar.' }
  }
}