

// src/app/api/cron/cleanup-prayers/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Validação de segurança para garantir que apenas a Vercel chama essa URL
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Arquiva todas as orações do mural com mais de 24 horas
    const result = await prisma.contactRequest.updateMany({
      where: {
        type: 'PRAYER',
        approvedForWall: true,
        createdAt: { lt: twentyFourHoursAgo },
      },
      data: {
        approvedForWall: false,
        status: 'RESOLVED',
      },
    })

    return NextResponse.json({
      success: true,
      archivedCount: result.count,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}