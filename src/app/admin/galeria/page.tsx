// src/app/admin/galeria/page.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminGalleryClient } from './AdminGalleryClient'

export default async function AdminGalleryPage() {
  const session = await auth()

  const canManage =
    session?.user?.staffRole === 'SUPER_ADMIN' ||
    (session?.user?.staffRole === 'MINISTRY_LEADER' &&
      session.user.permissions.includes('MANAGE_GALLERY'))

  if (!canManage) redirect('/')

  const images = await prisma.galleryImage.findMany({ orderBy: { order: 'asc' } })

  return <AdminGalleryClient images={images} />
}