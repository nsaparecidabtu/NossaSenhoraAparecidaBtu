// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paroquiaaparecidabtu.com.br'

  // Páginas estáticas principais da paróquia
  const routes = [
    '',
    '/a-paroquia',
    '/catequese',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return [...routes]
}
