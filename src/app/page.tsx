// src/app/page.tsx

import { prisma } from '@/lib/prisma'
import { getLiturgicalSeason } from '@/lib/liturgical'
import { Hero } from '@/components/home/Hero'
import { LiveStreamSection } from '@/components/home/LiveStreamsection'
import { MassScheduleSection } from '@/components/home/MassScheduleSection'
import { AboutSection } from '@/components/home/AboutSection'
import { TestimonialsBlock } from '@/components/home/TestimonialsBlock'
import { EventsSection } from '@/components/home/EventsSection'
import { GallerySection } from '@/components/home/GallerySection'
import { MinistriesSection } from '@/components/home/MinistriesSection'
import { DonationSection } from '@/components/home/DonationSection'
import { ContactLinksSection } from '@/components/home/ContactLinksSection'
import { FaqSection } from '@/components/home/FaqSection'
import { DailyWordSection } from '@/components/home/DailyWordSection'
import { SiteFooter } from '@/components/home/SiteFooter'

export const dynamic = 'force-dynamic' // conteúdo editado no admin deve refletir na hora

export default async function Home() {
  const [settings, massSchedules, events, gallery, ministries, faqs, dailyWord, liveStream, season, testimonials] =
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
      prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { name: true, image: true } } },
      }),
    ])

    console.log('DB HOST:', process.env.DATABASE_URL?.split('@')[1])
    console.log('DAILY WORD:', dailyWord)

  const themeMode = settings?.liturgicalThemeMode ?? 'DISCRETO'
  const mapsUrl = settings?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
    : null

  return (
    <main className="min-h-screen bg-cream text-navy">
      {themeMode !== 'PADRAO' && (
        <div className="h-1.5 w-full" style={{ backgroundColor: season.colorHex }} />
      )}

      <Hero
        name={settings?.name}
        heroImageUrl={settings?.heroImageUrl}
        heroTagline={settings?.heroTagline}
        themeMode={themeMode}
        season={season}
        mapsUrl={mapsUrl}
      />

      <LiveStreamSection youtubeVideoId={liveStream?.youtubeVideoId} isLiveNow={liveStream?.isLiveNow} />

      <MassScheduleSection massSchedules={massSchedules} themeMode={themeMode} season={season} />

      <AboutSection
        name={settings?.name}
        aboutText={settings?.aboutText}
        aboutImageUrl={settings?.aboutImageUrl}
        themeMode={themeMode}
        season={season}
      />

      <TestimonialsBlock testimonials={testimonials} />

      <EventsSection events={events} />

      <GallerySection gallery={gallery} />

      <MinistriesSection ministries={ministries} />

      <DonationSection pixKey={settings?.pixKey} />

      <ContactLinksSection />

      <FaqSection faqs={faqs} />

      <DailyWordSection dailyWord={dailyWord} />

      <SiteFooter
        name={settings?.name}
        phone={settings?.phone}
        email={settings?.email}
        address={settings?.address}
        instagramUrl={settings?.instagramUrl}
        facebookUrl={settings?.facebookUrl}
        youtubeUrl={settings?.youtubeUrl}
      />
    </main>
  )
}