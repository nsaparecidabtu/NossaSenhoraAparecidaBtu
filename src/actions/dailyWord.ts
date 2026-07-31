'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/permissions' // ou requirePermission
import { getPalavraDoDia } from '@/lib/gemini'

export async function generateAndSaveDailyWord() {
  try {
    await requireSuperAdmin()

    const palavra = await getPalavraDoDia()

    // Evita duplicar se já existir uma de hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.dailyWord.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
    })

    if (existing) {
      // Atualiza a de hoje
      await prisma.dailyWord.update({
        where: { id: existing.id },
        data: {
          text: palavra.text,
          verseReference: palavra.verseReference,
          reflection: palavra.reflection,
        },
      })
    } else {
      // Cria nova
      await prisma.dailyWord.create({
        data: {
          text: palavra.text,
          verseReference: palavra.verseReference || '-',
          reflection: palavra.reflection,
          date: new Date(),
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, message: 'Palavra do Dia gerada com sucesso!' }
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      error: error.message || 'Falha ao gerar a Palavra do Dia.',
    }
  }
}