// src/app/layout.tsx

import type { Metadata } from 'next'
import { Cormorant_Garamond, Nunito } from 'next/font/google'
import { SiteHeader } from '@/components/layout/SiteHeader'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Paróquia Nossa Senhora Aparecida — Botucatu',
  description: 'Lar de fé, esperança e devoção.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${nunito.variable} antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}