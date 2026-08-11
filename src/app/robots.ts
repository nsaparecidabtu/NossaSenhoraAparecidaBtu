// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paroquiaaparecidabtu.com.br'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protege e oculta o painel administrativo e as rotas de API dos buscadores
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}