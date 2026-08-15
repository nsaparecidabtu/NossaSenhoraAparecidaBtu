// src/app/admin/faq/components/tabs/HelpFaqTab.tsx
import { HelpCircle, ArrowUpDown } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpFaqTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Perguntas Frequentes"
        description="Como cadastrar e organizar as perguntas frequentes exibidas na home."
      />

      <HelpSection icon={HelpCircle} title="1. Cadastro">
        <p>
          Cada FAQ tem uma pergunta, uma resposta e uma categoria opcional para agrupar temas
          relacionados.
        </p>
      </HelpSection>

      <HelpSection icon={ArrowUpDown} title="2. Ordem de Exibição">
        <p>
          O campo &quot;Ordem&quot; define a sequência em que as perguntas aparecem na home — quanto
          menor o número, mais no topo ela fica.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
