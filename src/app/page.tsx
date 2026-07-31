// src/app/page.tsx

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getLiturgicalSeason } from '@/lib/liturgical'
import { CopyPixButton } from '@/components/CopyPixButton'
import { Sun, Church, Cross, Flame, Clock, MapPin, ChevronDown } from 'lucide-react'
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";

export const dynamic = 'force-dynamic' // conteúdo editado no admin deve refletir na hora

function scheduleIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('domingo')) return Sun
  if (l.includes('sábado') || l.includes('sabado')) return Cross
  if (l.includes('adora')) return Flame
  return Church
}

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
  const mapsUrl = settings?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
    : null

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* Barra de acento sazonal — some no modo Padrão */}
      {themeMode !== 'PADRAO' && (
        <div className="h-1.5 w-full" style={{ backgroundColor: season.colorHex }} />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy px-6 py-24 text-center text-cream sm:py-28">
        {settings?.heroImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.heroImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/80" />
          </>
        )}

        <div className="relative mx-auto max-w-3xl">
          {themeMode !== 'PADRAO' && (
            <span
              className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${season.colorHex}33`, color: season.colorHex }}
            >
              Tempo Litúrgico: {season.name}
              {season.specialNote ? ` — ${season.specialNote}` : ''}
            </span>
          )}

          <p className="mt-6 font-body text-sm font-semibold uppercase tracking-widest text-gold">
            Bem-vindo à
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {settings?.name ?? 'Paróquia Nossa Senhora Aparecida'}
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-gold" />

          <p className="mt-5 font-body text-lg text-cream/80">
            {settings?.heroTagline ?? 'Lar de fé, esperança e devoção'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#horarios"
              className="rounded-full bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              Horários das Missas
            </a>
            <a
              href={mapsUrl ?? '#contato'}
              target={mapsUrl ? '_blank' : undefined}
              rel={mapsUrl ? 'noopener noreferrer' : undefined}
              className="rounded-full border border-cream/40 px-6 py-3 font-body text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Faça uma Visita
            </a>
          </div>
        </div>

        <a
          href="#horarios"
          aria-label="Rolar para baixo"
          className="relative mx-auto mt-14 flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-cream"
        >
          <ChevronDown className="h-4 w-4" />
        </a>
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
        <p
          className={`text-center font-body text-xs font-bold uppercase tracking-widest ${
            themeMode === 'PADRAO' ? 'text-gold' : ''
          }`}
          style={themeMode === 'PADRAO' ? undefined : { color: season.colorHex }}
        >
          Horários das Missas
        </p>
        {massSchedules.length === 0 ? (
          <p className="mt-4 text-center font-body text-sm text-navy/50">
            Horários em breve — cadastre no painel admin.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {massSchedules.map((m) => {
              const Icon = scheduleIcon(m.label)
              return (
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
                  <Icon className="mx-auto h-5 w-5 text-gold" strokeWidth={1.75} />
                  <p className="mt-2 font-body text-xs font-bold uppercase tracking-wide text-navy/60">
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
              )
            })}
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
            // eslint-disable-next-line @next/next/no-img-element
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
      <section id="eventos" className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
          Próximos Eventos
        </p>
        {events.length === 0 ? (
          <p className="mt-4 text-center font-body text-sm text-navy/50">
            Nenhum evento agendado no momento.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {events.map((e) => (
              <div
                key={e.id}
                className="overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative h-36 w-full bg-navy/10">
                  {e.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                  )}
                  <div className="absolute left-3 top-3 rounded bg-navy px-2.5 py-1.5 text-center leading-none text-cream">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wide">
                      {e.eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </p>
                    <p className="font-display text-base font-bold">
                      {e.eventDate.toLocaleDateString('pt-BR', { day: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg font-semibold leading-snug">{e.title}</p>
                  {e.description && (
                    <p className="mt-1 line-clamp-2 font-body text-sm text-navy/60">
                      {e.description}
                    </p>
                  )}
                  <div className="mt-3 space-y-1">
                    <p className="flex items-center gap-1.5 font-body text-xs text-navy/50">
                      <Clock className="h-3.5 w-3.5" />
                      {e.eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {e.location && (
                      <p className="flex items-center gap-1.5 font-body text-xs text-navy/50">
                        <MapPin className="h-3.5 w-3.5" />
                        {e.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Galeria */}
      {gallery.length > 0 && (
        <section id="galeria" className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
            Galeria
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {gallery.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={g.id}
                src={g.imageUrl}
                alt={g.caption ?? ''}
                className="aspect-square w-full rounded-md object-cover transition-opacity hover:opacity-80"
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
        <section id="doacao" className="bg-[#f3ede0] px-6 py-14">
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
                Sua Doação Transforma Vidas
              </p>
              <p className="mt-4 font-body leading-relaxed text-navy/80">
                Com sua ajuda, podemos continuar nossa missão de evangelizar, acolher e servir a
                comunidade.
              </p>
              <p className="mt-2 font-display font-semibold">Doe com amor. Doe com fé.</p>
            </div>

            <div className="rounded-lg border border-line bg-white p-6 text-center">
              <span className="inline-block rounded-full bg-gold px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-navy">
                Chave PIX
              </span>
              <div className="mt-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(settings.pixKey)}`}
                  alt="QR Code da chave PIX"
                  className="h-44 w-44"
                />
              </div>
              <p className="mt-3 font-mono text-sm font-semibold text-navy/80">{settings.pixKey}</p>
              <CopyPixButton pixKey={settings.pixKey} />
            </div>
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
          <p className="text-center font-body text-xs font-bold uppercase tracking-widest text-gold">
            Palavra do Dia
          </p>
          <div className="mt-4 rounded-lg border border-line bg-white p-6 text-center">
            <span className="inline-block rounded-full bg-navy px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cream">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </span>
            <p className="mt-3 font-mono text-xs uppercase text-navy/50">
              {dailyWord.verseReference}
            </p>
            <p className="mt-2 font-display text-lg italic">&ldquo;{dailyWord.text}&rdquo;</p>
            {dailyWord.reflection && (
              <p className="mx-auto mt-3 max-w-md font-body text-sm text-navy/70">
                {dailyWord.reflection}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-line bg-navy px-6 py-12 text-cream">
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="" className="h-7 w-7" />
              <p className="font-display text-base font-bold">
                {settings?.name ?? 'Paróquia Nossa Senhora Aparecida'}
              </p>
            </div>
            <p className="mt-3 font-body text-sm italic text-cream/60">
              &ldquo;Fazei tudo o que Ele vos disser.&rdquo;
              <br />
              (João 2,5)
            </p>
          </div>

          <div>
            <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
              Contato
            </p>
            <div className="mt-3 space-y-1.5 font-body text-sm text-cream/70">
              {settings?.phone && <p>{settings.phone}</p>}
              {settings?.email && <p>{settings.email}</p>}
            </div>
          </div>

          <div>
            <p className="font-body text-xs font-bold uppercase tracking-widest text-gold">
              Endereço
            </p>
            <p className="mt-3 font-body text-sm text-cream/70">
              {settings?.address ?? 'Endereço em breve'}
            </p>

            {(settings?.instagramUrl || settings?.facebookUrl || settings?.youtubeUrl) && (
              <div className="mt-4 flex gap-3">
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                  >
                    <FaFacebook className="h-4 w-4" />
                  </a>
                )}
                {settings?.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:text-gold"
                  >
                    <FaYoutube className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl border-t border-cream/10 pt-6 text-center font-mono text-xs text-cream/40">
          © {new Date().getFullYear()} {settings?.name ?? 'Paróquia Nossa Senhora Aparecida'}. Todos
          os direitos reservados.
        </p>
      </footer>
    </main>
  )
}