// src/app/admin/ministerios/components/tabs/HelpMinisteriosTab.tsx
import { Users, ArrowUpDown } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpMinisteriosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Pastorais e Ministérios"
        description="Como cadastrar e organizar as pastorais e ministérios exibidos na home."
      />

      <HelpSection icon={Users} title="1. Cadastro">
        <p>
          Preencha nome, descrição, informações de contato e horário de encontro de cada
          pastoral ou ministério.
        </p>
      </HelpSection>

      <HelpSection icon={ArrowUpDown} title="2. Ordem de Exibição">
        <p>
          Aparecem na home na ordem definida pelo campo &quot;Ordem&quot;.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
