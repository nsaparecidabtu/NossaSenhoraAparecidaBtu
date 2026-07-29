// src/app/a-paroquia/page.tsx

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AParoquiaPage() {
  const settings = await prisma.parishSettings.findUnique({ where: { id: 'singleton' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50 hover:text-gold"
        >
          ← Voltar para o início
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
          {settings?.name ?? 'Nossa Paróquia'}
        </h1>

        {settings?.aboutImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.aboutImageUrl}
            alt={settings?.name ?? 'Nossa paróquia'}
            className="mt-6 aspect-[16/9] w-full rounded-lg object-cover"
          />
        )}

        <section className="mt-8">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
            Nossa História
          </p>
          <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-navy/80">
            {settings?.aboutText ?? 'Em breve, a história da nossa comunidade.'}
          </p>
        </section>

        {settings?.patronStoryText && (
          <section className="mt-10">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
              Nossa Padroeira{settings.patronSaintName ? ` — ${settings.patronSaintName}` : ''}
            </p>
            <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-navy/80">
              {settings.patronStoryText}
            </p>
          </section>
        )}
      </div>
    </main>
  )
}