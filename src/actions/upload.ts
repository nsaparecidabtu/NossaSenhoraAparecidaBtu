// src/actions/upload.ts
'use server'

import { put } from '@vercel/blob'
import { auth } from '@/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    // Qualquer staff autenticado pode subir imagem — a autorização fina de
    // "pode editar isto aqui" já é checada na Server Action que salva a URL
    // no banco (requireSuperAdmin / requirePermission).
    const session = await auth()
    if (!session?.user?.staffRole) {
      return { error: 'Acesso negado.' }
    }

    const file = formData.get('file') as File | null
    if (!file) return { error: 'Nenhum arquivo enviado.' }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: 'Formato não suportado. Use JPG, PNG, WEBP ou GIF.' }
    }
    if (file.size > MAX_SIZE) {
      return { error: 'Arquivo muito grande (máximo 5MB).' }
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return { url: blob.url }
  } catch (error: any) {
    return { error: error.message || 'Falha ao enviar imagem.' }
  }
}