// src/app/page.tsx

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getLiturgicalSeason } from '@/lib/liturgical'

export const dynamic = 'force-dynamic' // conteúdo editado no admin deve refletir na hora

export default async function Home() {
  const [settings, massSchedules, events, gallery, ministries, faqs, dailyWord, liveStream, season] =
    await Promise.all([
      prisma.parishSettings.findUnique({ where: { id: 'singleton' } }),
      prisma.massSchedule.findMany({ orderBy: { order: 'asc' } }),
      prisma.event.findMany({
        where: { eventDate: { gte: new Date() } },
        orderBy: { eventDate: 'asc' },
        take: 3,
      }),
      prisma.galleryImage.findMany({ orderBy: { order: 'asc' }, take: 6 }),
      prisma.ministry.findMany({ orderBy: { order: 'asc' } }),
      prisma.faqItem.findMany({ orderBy: { order: 'asc' } }),
      prisma.dailyWord.findFirst({ orderBy: { date: 'desc' } }),
      prisma.liveStreamSettings.findUnique({ where: { id: 'singleton' } }),
      getLiturgicalSeason(),
    ])

  const themeMode = settings?.liturgicalThemeMode ?? 'DISCRETO'

 
    return (
    <main className="min-h-screen bg-cream text-navy">
      {/* Barra de acento sazonal — some no modo Padrão */}
      {themeMode !== 'PADRAO' && (
        <div className="h-1.5 w-full" style={{ backgroundColor: season.colorHex }} />
      )}

      {/* Hero */}
      <section className="bg-navy px-6 py-20 text-center text-cream">
        <div className="mx-auto max-w-3xl">
          {themeMode !== 'PADRAO' && (
            <span
              className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${season.colorHex}33`, color: season.colorHex }}
            >
              Tempo Litúrgico: {season.name}
              {season.specialNote ? ` — ${season.specialNote}` : ''}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            {settings?.name ?? 'Paróquia Nossa Senhora Aparecida'}
          </h1>
          <p className="mt-3 font-body text-cream/80">
            {settings?.heroTagline ?? 'Lar de fé, esperança e devoção'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#horarios"
              className="rounded-full bg-gold px-5 py-2.5 font-body text-sm font-semibold text-navy"
            >
              Horários das Missas
            </a>
            <a
              href="#contato"
              className="rounded-full border border-cream/40 px-5 py-2.5 font-body text-sm font-semibold text-cream"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </section>

      {/* Transmissão ao vivo — só aparece se isLiveNow estiver ligado no admin */}
      {liveStream?.isLiveNow && liveStream.youtubeVideoId && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">Assista Agora</h2>
          <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-line">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${liveStream.youtubeVideoId}`}
              title="Transmissão ao vivo"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Horários de Missa — label sempre segue a cor da estação (exceto Padrão); cards só tingem no Full color */}
      <section id="horarios" className="mx-auto max-w-3xl px-6 py-10">
        <h2
          className={`text-center font-display text-2xl font-bold ${
            themeMode === 'PADRAO' ? 'text-gold' : ''
          }`}
          style={themeMode === 'PADRAO' ? undefined : { color: season.colorHex }}
        >
          Horários das Missas
        </h2>
        {massSchedules.length === 0 ? (
          <p className="mt-4 text-center font-body text-sm text-navy/50">
            Horários em breve — cadastre no painel admin.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {massSchedules.map((m) => (
              <div
                key={m.id}
                className={
                  themeMode === 'FULLCOLOR'
                    ? 'rounded-lg border p-4 text-center'
                    : 'rounded-lg border border-line bg-white p-4 text-center'
                }
                style={
                  themeMode === 'FULLCOLOR'
                    ? { backgroundColor: `${season.colorHex}0d`, borderColor: `${season.colorHex}40` }
                    : undefined
                }
              >
                <p className="font-body text-xs font-bold uppercase tracking-wide text-navy/60">
                  {m.label}
                </p>
                <div className="mt-2 space-y-1">
                  {m.times.map((t) => (
                    <p key={t} className="font-display text-lg font-semibold">
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

{/* Sobre Nós — cor sazonal só no modo Full color */}
      <section
        className="mx-auto max-w-3xl rounded-lg px-6 py-10"
        style={themeMode === 'FULLCOLOR' ? { backgroundColor: `${season.colorHex}0d` } : undefined}
      >
        <p
          className={`font-body text-xs font-bold uppercase tracking-widest ${
            themeMode === 'FULLCOLOR' ? '' : 'text-gold'
          }`}
          style={themeMode === 'FULLCOLOR' ? { color: season.colorHex } : undefined}
        >
          Sobre Nós
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
          {settings?.aboutImageUrl && (
            <img
              src={settings.aboutImageUrl}
              alt={settings?.name ?? 'Nossa paróquia'}
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-body leading-relaxed text-navy/80">
              {settings?.aboutText ?? 'Em breve, a história da nossa comunidade.'}
            </p>
            <Link
              href="/a-paroquia"
              className="mt-4 inline-block rounded bg-navy px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-opacity hover:opacity-90"
              style={themeMode === 'FULLCOLOR' ? { backgroundColor: season.colorHex } : undefined}
            >
              Saiba mais sobre nossa história →
            </Link>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-2xl font-bold text-gold">Próximos Eventos</h2>
        {events.length === 0 ? (
          <p className="mt-4 font-body text-sm text-navy/50">
            Nenhum evento agendado no momento.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {events.map((e) => (
              <div key={e.id} className="overflow-hidden rounded-lg border border-line bg-white">
                {e.imageUrl && (
                  <img src={e.imageUrl} alt={e.title} className="h-32 w-full object-cover" />
                )}
                <div className="p-4">
                  <p className="font-mono text-xs text-navy/50">
                    {e.eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{e.title}</p>
                  {e.location && (
                    <p className="mt-1 font-body text-xs text-navy/60">{e.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Galeria */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">Galeria</h2>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {gallery.map((g) => (
              <img
                key={g.id}
                src={g.imageUrl}
                alt={g.caption ?? ''}
                className="aspect-square w-full rounded-md object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {/* Pastorais/Ministérios */}
      {ministries.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">Pastorais e Ministérios</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ministries.map((m) => (
              <div key={m.id} className="rounded-lg border border-line bg-white p-4">
                <p className="font-display text-lg font-semibold">{m.name}</p>
                {m.description && (
                  <p className="mt-1 font-body text-sm text-navy/70">{m.description}</p>
                )}
                {m.meetingSchedule && (
                  <p className="mt-2 font-mono text-xs text-navy/50">{m.meetingSchedule}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Doação PIX */}
      {settings?.pixKey && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">
            Sua Doação Transforma Vidas
          </h2>
          <div className="mt-6 rounded-lg border border-line bg-white p-6">
            <p className="font-body text-sm text-navy/70">Chave PIX:</p>
            <p className="mt-1 font-mono text-lg font-semibold">{settings.pixKey}</p>
          </div>
        </section>
      )}

      {/* Formulários de contato — rotas ainda não construídas, ver aviso na resposta */}
      <section id="contato" className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-2xl font-bold text-gold">Fale Conosco</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/contato/oracao"
            className="rounded-lg border border-line bg-white p-4 text-center font-body font-semibold transition-colors hover:border-gold"
          >
            Pedido de Oração
          </Link>
          <Link
            href="/contato/intencao"
            className="rounded-lg border border-line bg-white p-4 text-center font-body font-semibold transition-colors hover:border-gold"
          >
            Intenção de Missa
          </Link>
          <Link
            href="/contato/sacramento"
            className="rounded-lg border border-line bg-white p-4 text-center font-body font-semibold transition-colors hover:border-gold"
          >
            Agendar Sacramento
          </Link>
          <Link
            href="/contato/geral"
            className="rounded-lg border border-line bg-white p-4 text-center font-body font-semibold transition-colors hover:border-gold"
          >
            Contato Geral
          </Link>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">Perguntas Frequentes</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="rounded-lg border border-line bg-white p-4">
                <summary className="cursor-pointer font-body font-semibold">
                  {f.question}
                </summary>
                <p className="mt-2 font-body text-sm text-navy/70">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Palavra do Dia */}
      {dailyWord && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-display text-2xl font-bold text-gold">Palavra do Dia</h2>
          <div className="mt-4 rounded-lg border border-line bg-white p-6">
            <p className="font-mono text-xs uppercase text-navy/50">
              {dailyWord.verseReference}
            </p>
            <p className="mt-2 font-display text-lg italic">&ldquo;{dailyWord.text}&rdquo;</p>
            {dailyWord.reflection && (
              <p className="mt-3 font-body text-sm text-navy/70">{dailyWord.reflection}</p>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-line bg-navy px-6 py-10 text-cream">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-lg font-bold">
            {settings?.name ?? 'Paróquia Nossa Senhora Aparecida'}
          </p>
          {settings?.address && (
            <p className="mt-2 font-body text-sm text-cream/70">{settings.address}</p>
          )}
          {settings?.phone && <p className="font-body text-sm text-cream/70">{settings.phone}</p>}
          <p className="mt-4 font-mono text-xs text-cream/40">
            © {new Date().getFullYear()} Paróquia Nossa Senhora Aparecida — Botucatu
          </p>
        </div>
      </footer>
    </main>
  )
}