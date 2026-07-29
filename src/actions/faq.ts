// src/actions/faq.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createFaqItem(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_FAQ')

    const question = formData.get('question') as string
    const answer = formData.get('answer') as string
    const category = (formData.get('category') as string) || null
    const order = Number(formData.get('order') ?? 0)

    if (!question || !answer) throw new Error('Preencha a pergunta e a resposta.')

    const faq = await prisma.faqItem.create({
      data: { question, answer, category, order },
    })

    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true, data: faq }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao criar pergunta.' }
  }
}

export async function deleteFaqItem(id: string) {
  try {
    await requirePermission('MANAGE_FAQ')
    await prisma.faqItem.delete({ where: { id } })
    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}