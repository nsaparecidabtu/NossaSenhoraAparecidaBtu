// src/app/layout.tsx

import type { Metadata } from 'next'
import { Cormorant_Garamond, Nunito } from 'next/font/google'
import { SiteHeader } from '@/components/layout/SiteHeader'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.paroquiaaparecidabtu.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  
  title: {
    default: 'Paróquia Nossa Senhora Aparecida — Botucatu',
    template: '%s | Paróquia Nossa Senhora Aparecida',
  },
  
  description:
    'Lar de fé, esperança e devoção. Horários de missas, pastorais, eventos e informações da Paróquia Nossa Senhora Aparecida em Botucatu - SP.',
  
  keywords: [
    'Paróquia Nossa Senhora Aparecida',
    'Botucatu',
    'Missas Botucatu',
    'Igreja Católica Botucatu',
    'Nossa Senhora Aparecida',
  ],

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Paróquia Nossa Senhora Aparecida — Botucatu',
    title: 'Paróquia Nossa Senhora Aparecida — Botucatu',
    description:
      'Lar de fé, esperança e devoção. Horários de missas, pastorais e informações da comunidade.',
    images: [
      {
        url: '/og-image.jpg', // coloque a imagem em public/og-image.jpg (1200x630)
        width: 1200,
        height: 630,
        alt: 'Paróquia Nossa Senhora Aparecida - Botucatu',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Paróquia Nossa Senhora Aparecida — Botucatu',
    description: 'Lar de fé, esperança e devoção.',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${nunito.variable} antialiased`}>
        <SiteHeader />
        {children}
        <Analytics /> {/* Injetado apenas uma vez aqui */}
      </body>
    </html>
  )
}

  