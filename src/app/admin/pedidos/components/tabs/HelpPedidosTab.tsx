// src/app/admin/pedidos/components/tabs/HelpPedidosTab.tsx
import { Inbox, Filter, CheckCircle2 } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpPedidosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Pedidos Recebidos"
        description="Como acompanhar e dar andamento aos pedidos enviados pelos formulários de contato da home."
      />

      <HelpSection icon={Inbox} title="1. Tipos de Pedido">
        <p>
          Chegam aqui os pedidos de oração geral, intenções de missa, agendamento de sacramento
          e contato geral, todos enviados pelos formulários da home.
        </p>
      </HelpSection>

      <HelpSection icon={Filter} title="2. Filtros">
        <p>
          Use os filtros no topo da lista para visualizar só um tipo de pedido por vez quando o
          volume estiver alto.
        </p>
      </HelpSection>

      <HelpSection icon={CheckCircle2} title="3. Status e Mural Público">
        <p>
          Atualize o status conforme for entrando em contato (Pendente → Contatado → Resolvido).
          Pedidos que marcaram interesse no mural público podem ser aprovados pra exibição.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
