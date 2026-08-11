import { prisma } from '@/lib/prisma'
import { toggleWeekOpen } from '@/actions/catechism/admin-catechism'
import { CreateWeekForm } from '../forms/CreateWeekForm'
import { ExportQrPdfButton } from '../ExportQrPdfButton'

export async function WeekTab({ baseUrl }: { baseUrl: string }) {
  const openWeek = await prisma.catechismWeek.findFirst({ 
    where: { isOpen: true }, 
    orderBy: { startsAt: 'desc' } 
  })
  
  const weeks = await prisma.catechismWeek.findMany({ 
    orderBy: { startsAt: 'desc' }, 
    take: 12 
  })

  // URL real de acesso para a presença
  const weekLink = openWeek ? `${baseUrl}/catequese?s=${openWeek.token}` : null
  
  // Imagem visual para exibir apenas na tela do admin
  const qrSrc = weekLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(weekLink)}`
    : null

  return (
    <div className="space-y-4 animate-[fadein_0.3s_ease]">
      <div className="rounded-lg border border-line bg-white p-5 text-center shadow-sm">
        {openWeek && weekLink ? (
          <>
            <p className="font-body text-xs font-bold uppercase tracking-wide text-green-700">
              Semana aberta
            </p>
            <p className="mt-1 font-display text-xl font-semibold">{openWeek.title}</p>
            
            {/* Visualização na interface (tela) */}
            {qrSrc && (
              <img src={qrSrc} alt="QR da semana" className="mx-auto mt-3 h-52 w-52" />
            )}
            
            <p className="mt-3 break-all font-mono text-xs text-navy/60">{weekLink}</p>
            
            <div className="flex flex-col items-center justify-center">
               {/* Componente Client injetado aqui! */}
              <ExportQrPdfButton title={openWeek.title} link={weekLink} />
            </div>

            <form action={async () => {
              'use server';
              await toggleWeekOpen(openWeek.id, false);
            }} className="mt-6">
              <button type="submit" className="font-body text-xs font-semibold text-red-600 hover:underline">
                Encerrar esta semana
              </button>
            </form>
          </>
        ) : (
          <p className="font-body text-sm text-navy/60">
            Nenhuma semana aberta no momento.
          </p>
        )}
      </div>
      
      <CreateWeekForm />

      {weeks.length > 0 && (
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/50">
            Semanas anteriores
          </p>
          <div className="mt-2 space-y-1">
            {weeks.map((w) => (
              <p key={w.id} className="font-body text-xs text-navy/50">
                {w.title} — {w.isOpen ? 'aberta' : 'encerrada'}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}