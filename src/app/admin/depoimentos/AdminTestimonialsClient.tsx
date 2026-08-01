// src/app/admin/depoimentos/AdminTestimonialsClient.tsx
'use client'

import { approveTestimonial, deleteTestimonial } from '@/actions/testimonial'

type Testimonial = {
  id: string
  message: string
  approved: boolean
  createdAt: Date
  user: { name: string | null; image: string | null }
}

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function AdminTestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  const pending = testimonials.filter((t) => !t.approved)
  const approved = testimonials.filter((t) => t.approved)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Depoimentos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Só entram no ar depois de aprovados aqui.
        </p>

        <h2 className="mt-8 font-body text-xs font-bold uppercase tracking-wide text-navy/50">
          Aguardando aprovação ({pending.length})
        </h2>
        <div className="mt-3 space-y-3">
          {pending.length === 0 && (
            <p className="font-body text-sm text-navy/40">Nada pendente. 🎉</p>
          )}
          {pending.map((t) => (
            <div key={t.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start gap-3">
                {t.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.user.image} alt="" className="h-8 w-8 shrink-0 rounded-full" />
                )}
                <div className="flex-1">
                  <p className="font-body text-xs font-semibold text-navy/60">
                    {t.user.name ?? 'Anônimo'} · {fmtDate(t.createdAt)}
                  </p>
                  <p className="mt-1 font-body text-sm text-navy/80">{t.message}</p>
                  <div className="mt-3 flex gap-3">
                    <form
                      action={async () => {
                        await approveTestimonial(t.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded bg-navy px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-cream"
                      >
                        Aprovar e publicar
                      </button>
                    </form>
                    <form
                      action={async () => {
                        await deleteTestimonial(t.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="font-body text-xs font-semibold text-red-600 hover:underline"
                      >
                        Descartar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-body text-xs font-bold uppercase tracking-wide text-navy/50">
          Publicados ({approved.length})
        </h2>
        <div className="mt-3 space-y-3">
          {approved.map((t) => (
            <div key={t.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs font-semibold text-navy/60">
                    {t.user.name ?? 'Anônimo'} · {fmtDate(t.createdAt)}
                  </p>
                  <p className="mt-1 font-body text-sm text-navy/80">{t.message}</p>
                </div>
                <form
                  action={async () => {
                    await deleteTestimonial(t.id)
                  }}
                >
                  <button
                    type="submit"
                    className="shrink-0 font-body text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}