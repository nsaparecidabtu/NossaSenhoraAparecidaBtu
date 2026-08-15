// src/app/admin/palavra-do-dia/components/tabs/HelpPalavraDoDiaTab.tsx
import { Sparkles, PenLine } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'
import { FaInstagram } from 'react-icons/fa'

export function HelpPalavraDoDiaTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Palavra do Dia"
        description="Como funciona a geração automática e a edição manual da Palavra do Dia exibida na home."
      />

      <HelpSection icon={Sparkles} title="1. Geração Automática">
        <p>
          Todo dia às 6h o Gemini gera uma Palavra do Dia automaticamente. Você pode gerar de
          novo manualmente a qualquer momento se quiser uma nova sugestão.
        </p>
      </HelpSection>

      <HelpSection icon={FaInstagram} title="2. Reels do Instagram">
        <p>
          É possível colar o link de um Reels do Instagram para exibir junto à Palavra do Dia,
          com a opção de mostrar ou não o texto junto ao vídeo.
        </p>
      </HelpSection>

      <HelpSection icon={PenLine} title="3. Edição Manual">
        <p>
          Você também pode escrever a sua própria Palavra do Dia. O que for salvo por último —
          automático ou manual — é o que fica no ar.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
