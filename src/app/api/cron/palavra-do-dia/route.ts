// src/app/api/cron/palavra-do-dia/route.ts
import { NextResponse } from 'next/server'
import { generateDailyWord } from '@/lib/dailyWord'
// ou de onde estiver: '@/actions/dailyWord'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET ausente' }, { status: 401 })
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const result = await generateDailyWord()
    return NextResponse.json({ ok: true, result })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro no cron'
    console.error('Cron falhou:', e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}