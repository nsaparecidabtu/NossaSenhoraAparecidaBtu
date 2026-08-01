// src/app/api/cron/palavra-do-dia/route.ts

import { NextResponse } from 'next/server'
import { generateDailyWord } from '@/lib/dailyWord'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET

  // Falha fechado se a env não estiver configurada
  if (!secret) {
    console.error('CRON_SECRET não configurado')
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const result = await generateDailyWord()
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao gerar a Palavra do Dia.'
    console.error('Cron Palavra do Dia falhou:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}