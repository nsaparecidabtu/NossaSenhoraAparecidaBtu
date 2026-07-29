// src/app/api/upload/route.ts
//
// Gera o token de upload direto-do-navegador pro Vercel Blob e valida quem
// pode subir imagem. O arquivo em si NUNCA passa por esta rota — o browser
// envia direto pro Blob storage; aqui só autorizamos e (opcionalmente)
// registramos quando terminou.

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Qualquer staff (SUPER_ADMIN ou MINISTRY_LEADER) pode gerar um
        // token de upload — a autorização fina de "pode editar isto aqui"
        // já é checada depois, na Server Action que salva a URL no banco
        // (requireSuperAdmin / requirePermission). Isto aqui só impede
        // gente não-autenticada de subir arquivo pro nosso storage.
        const session = await auth()
        if (!session?.user?.staffRole) {
          throw new Error('Acesso negado.')
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Sem efeito colateral no banco aqui de propósito: a URL só vira
        // "oficial" quando o admin salva o formulário correspondente
        // (updateParishSettings, criação de evento/galeria etc.).
        // Isto roda em background depois do upload concluir — não
        // funciona em localhost (Vercel não alcança seu dev server),
        // só em produção/preview.
        console.log('Upload concluído no Blob:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}