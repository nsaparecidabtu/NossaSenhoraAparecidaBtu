// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paroquiaaparecidabtu.com.br'
 
  // Rotas públicas estáticas do portal paroquial
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/a-paroquia', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/catequese', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/ao-vivo', priority: 0.8, changeFrequency: 'weekly' as const },
    // Páginas institucionais/legais — conteúdo estável, baixa prioridade de rastreio
    { path: '/termos-de-uso', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/politica-privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
  ]
 
  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
 