// src/app/admin/galeria/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminTabsNav } from '@/components/admin/AdminTabsNav'
import { AdminGalleryClient } from './AdminGalleryClient'
import { HelpGaleriaTab } from './components/tabs/HelpGaleriaTab'

const TABS = [
  { id: 'conteudo', label: 'Galeria' },
  { id: 'ajuda', label: 'Manual & Ajuda' },
]

type PageProps = { searchParams: Promise<{ tab?: string }> }

export default async function AdminGalleryPage({ searchParams }: PageProps) {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    
      session?.user?.permissions?.includes('MANAGE_GALLERY')

  if (!canManage) redirect('/')

  const { tab } = await searchParams
  const activeTab = tab || 'conteudo'

  const images = await prisma.galleryImage.findMany({ orderBy: { order: 'asc' } })

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Galeria</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          A home mostra as 6 primeiras fotos, ordenadas pelo campo &quot;Ordem&quot;.
        </p>

        <AdminTabsNav tabs={TABS} currentTab={activeTab} />

        <div className="mt-6">
          {activeTab === 'conteudo' && <AdminGalleryClient images={images} />}
          {activeTab === 'ajuda' && <HelpGaleriaTab />}
        </div>
      </div>
    </main>
  )
}
