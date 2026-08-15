// src/app/admin/horarios/components/tabs/HelpHorariosTab.tsx
import { Clock, ArrowUpDown } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpHorariosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Horários de Missa"
        description="Como cadastrar e organizar os horários de missa exibidos na home."
      />

      <HelpSection icon={Clock} title="1. Cadastro de Horários">
        <p>
          Cada grupo tem um rótulo (ex: &quot;Domingo&quot;) e uma lista de horários associados a ele.
        </p>
      </HelpSection>

      <HelpSection icon={ArrowUpDown} title="2. Ordem de Exibição">
        <p>
          Aparecem na home na ordem definida pelo campo &quot;Ordem&quot; — organize do primeiro dia da
          semana ao último pra facilitar a leitura dos fiéis.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
