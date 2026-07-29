// src/actions/parishSettings.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/permissions'
import type { LiturgicalThemeMode } from '@prisma/client'

// Só SUPER_ADMIN mexe aqui — dados institucionais (endereço, PIX, etc.)
// não fazem parte de nenhuma capacidade delegável de ministério.
export async function updateParishSettings(_prevState: unknown, formData: FormData) {
  try {
    await requireSuperAdmin()

    const get = (key: string) => (formData.get(key) as string) || null
    const liturgicalThemeMode = formData.get('liturgicalThemeMode') as LiturgicalThemeMode | null

    await prisma.parishSettings.upsert({
      where: { id: 'singleton' },
      update: {
        name: get('name') || undefined,
        patronSaintName: get('patronSaintName') || undefined,
        address: get('address'),
        phone: get('phone'),
        email: get('email'),
        pixKey: get('pixKey'),
        instagramUrl: get('instagramUrl'),
        facebookUrl: get('facebookUrl'),
        youtubeUrl: get('youtubeUrl'),
        heroImageUrl: get('heroImageUrl'),
        heroTagline: get('heroTagline'),
        aboutText: get('aboutText'),
        aboutImageUrl: get('aboutImageUrl'),
        patronStoryText: get('patronStoryText'),
        liturgicalThemeMode: liturgicalThemeMode || undefined,
      },
      create: {
        id: 'singleton',
        name: get('name') || 'Paróquia Nossa Senhora Aparecida',
        patronSaintName: get('patronSaintName') || 'Nossa Senhora Aparecida',
        address: get('address'),
        phone: get('phone'),
        email: get('email'),
        pixKey: get('pixKey'),
        instagramUrl: get('instagramUrl'),
        facebookUrl: get('facebookUrl'),
        youtubeUrl: get('youtubeUrl'),
        heroImageUrl: get('heroImageUrl'),
        heroTagline: get('heroTagline'),
        aboutText: get('aboutText'),
        aboutImageUrl: get('aboutImageUrl'),
        patronStoryText: get('patronStoryText'),
        liturgicalThemeMode: liturgicalThemeMode || undefined,
      },
    })

    revalidatePath('/admin/configuracoes')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao salvar.' }
  }
}