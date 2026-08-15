// src/app/admin/liturgico/components/tabs/HelpLiturgicoTab.tsx
import { Palette, CalendarRange } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpLiturgicoTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Cores Litúrgicas Especiais"
        description="Como cadastrar uma cor manual para sobrepor o cálculo automático do tempo litúrgico."
      />

      <HelpSection icon={CalendarRange} title="1. Quando Usar">
        <p>
          Use para períodos específicos que não seguem o calendário litúrgico padrão — como uma
          novena, tríduo ou a festa da padroeira.
        </p>
      </HelpSection>

      <HelpSection icon={Palette} title="2. Prioridade da Cor">
        <p>
          Enquanto a data de hoje estiver dentro do período cadastrado, essa cor manual tem
          prioridade sobre o cálculo automático (Advento, Quaresma, Tempo Comum etc.).
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
