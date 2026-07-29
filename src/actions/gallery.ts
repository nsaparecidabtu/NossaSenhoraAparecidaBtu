// src/actions/gallery.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'

export async function createGalleryImage(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_GALLERY')

    const imageUrl = formData.get('imageUrl') as string
    const caption = (formData.get('caption') as string) || null
    const order = Number(formData.get('order') ?? 0)

    if (!imageUrl) throw new Error('Envie ou cole a URL de uma imagem.')

    const image = await prisma.galleryImage.create({
      data: { imageUrl, caption, order },
    })

    revalidatePath('/admin/galeria')
    revalidatePath('/')
    return { success: true, data: image }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao adicionar imagem.' }
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requirePermission('MANAGE_GALLERY')
    await prisma.galleryImage.delete({ where: { id } })
    revalidatePath('/admin/galeria')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir.' }
  }
}