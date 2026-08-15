// src/app/admin/galeria/components/tabs/HelpGaleriaTab.tsx
import { Image as ImageIcon, ArrowUpDown } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpGaleriaTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Galeria"
        description="Como adicionar e organizar as fotos exibidas na galeria da home."
      />

      <HelpSection icon={ImageIcon} title="1. Upload de Fotos">
        <p>
          Envie a imagem e, se quiser, uma legenda curta. As fotos ficam salvas no armazenamento
          do site (Vercel Blob).
        </p>
      </HelpSection>

      <HelpSection icon={ArrowUpDown} title="2. Ordem de Exibição">
        <p>
          A home mostra as 6 primeiras fotos, ordenadas pelo campo &quot;Ordem&quot;. Ajuste esse número
          pra controlar quais aparecem em destaque.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
