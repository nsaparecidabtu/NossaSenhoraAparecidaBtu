// src/lib/dailyWord.ts
//
// Lógica compartilhada entre a Server Action (botão manual no admin,
// autenticado por sessão) e a rota de cron (autenticada por CRON_SECRET).
// Nenhum dos dois faz checagem de permissão aqui — cada chamador decide
// como autenticar antes de invocar esta função.

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getPalavraDoDia } from '@/lib/gemini'

export async function generateDailyWord() {
  const palavra = await getPalavraDoDia()

  // Evita duplicar se já existir uma de hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.dailyWord.findFirst({
    where: { date: { gte: today } },
  })

  if (existing) {
    await prisma.dailyWord.update({
      where: { id: existing.id },
      data: {
        text: palavra.text,
        verseReference: palavra.verseReference,
        reflection: palavra.reflection,
      },
    })
  } else {
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
}