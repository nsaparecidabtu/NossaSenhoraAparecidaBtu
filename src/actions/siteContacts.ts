// src/actions/siteContacts.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/permissions' // Usando sua validação existente

export async function addContact(_prevState: unknown, formData: FormData) {
  try {
    await requireSuperAdmin()

    const category = formData.get('category') as string
    const label = formData.get('label') as string
    const value = formData.get('value') as string
    const mapUrl = formData.get('mapUrl') as string | null

    if (!category || !label || !value) {
      throw new Error('Preencha os campos obrigatórios.')
    }

    await prisma.siteContact.create({
      data: { category, label, value, mapUrl: mapUrl || null },
    })

    revalidatePath('/admin/configuracoes')
    revalidatePath('/')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function removeContact(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.siteContact.delete({ where: { id } })
    
    revalidatePath('/admin/configuracoes')
    revalidatePath('/')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}