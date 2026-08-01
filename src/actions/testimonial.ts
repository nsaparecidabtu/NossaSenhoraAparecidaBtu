// src/actions/testimonial.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requirePermission } from '@/lib/permissions'

// Qualquer pessoa logada (paroquiano comum, não precisa ser staff) pode
// enviar — mas nasce com approved: false. Só aparece no site depois que
// um admin/coordenador aprovar em /admin/depoimentos.
export async function createTestimonial(_prevState: unknown, formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Você precisa estar logado pra deixar um depoimento.')
    }

    const message = (formData.get('message') as string)?.trim()
    if (!message) throw new Error('Escreva seu depoimento.')
    if (message.length > 1000) throw new Error('Depoimento muito longo (máximo 1000 caracteres).')

    await prisma.testimonial.create({
      data: { userId: session.user.id, message },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao enviar depoimento.' }
  }
}

export async function approveTestimonial(id: string) {
  try {
    await requirePermission('MANAGE_TESTIMONIALS')
    await prisma.testimonial.update({ where: { id }, data: { approved: true } })
    revalidatePath('/admin/depoimentos')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao aprovar.' }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requirePermission('MANAGE_TESTIMONIALS')
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/admin/depoimentos')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}