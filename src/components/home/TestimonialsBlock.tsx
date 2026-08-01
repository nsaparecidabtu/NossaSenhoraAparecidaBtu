// src/components/home/TestimonialsBlock.tsx
import { Suspense } from 'react'
import { TestimonialsSubmitArea } from '@/components/TestimonialsSection'

type Testimonial = {
  id: string
  message: string
  user: { name: string | null; image: string | null }
}

export function TestimonialsBlock({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
        O Que Nossa Comunidade Diz
      </p>

      {testimonials.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-line bg-white p-4">
              <p className="font-display text-2xl leading-none text-gold">&ldquo;</p>
              <p className="-mt-2 font-body text-sm italic text-navy/80">{t.message}</p>
              <div className="mt-3 flex items-center gap-2">
                {t.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.user.image} alt="" className="h-6 w-6 rounded-full" />
                )}
                <p className="font-body text-xs font-semibold text-navy/60">
                  {t.user.name ?? 'Paroquiano(a)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Suspense
          fallback={<div className="h-24 animate-pulse rounded-lg border border-line bg-white" />}
        >
          <TestimonialsSubmitArea />
        </Suspense>
      </div>
    </section>
  )
}