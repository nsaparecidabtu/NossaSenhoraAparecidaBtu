// src/lib/settings.ts
import { prisma } from '@/lib/prisma'
import { unstable_cache as cache } from 'next/cache'

// Tipo exportado para consumo seguro nos componentes
export type SiteContactItem = {
  id: string
  category: string
  label: string
  value: string
  mapUrl: string | null
}

/**
 * Busca todos os contatos e links do site com cache otimizado.
 * O cache é invalidado automaticamente sempre que uma Server Action altera os contatos.
 */
export const getSiteContacts = cache(
  async (): Promise<SiteContactItem[]> => {
    try {
      const contacts = await prisma.siteContact.findMany({
        orderBy: { createdAt: 'asc' },
      })
      return contacts
    } catch (error) {
      console.error('Erro ao buscar contatos do site:', error)
      return []
    }
  },
  ['site-contacts-cache'],
  { revalidate: 3600, tags: ['site-contacts'] } // Revalida a cada 1 hora ou via revalidatePath
)