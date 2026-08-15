// src/app/admin/depoimentos/components/tabs/HelpDepoimentosTab.tsx
import { MessageCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpDepoimentosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Depoimentos"
        description="Como aprovar e gerenciar os depoimentos enviados pelos fiéis antes de irem ao ar na home."
      />

      <HelpSection icon={MessageCircle} title="1. Recebimento">
        <p>
          Os depoimentos enviados pelo site ficam parados em &quot;Aguardando aprovação&quot; até que
          um administrador revise o conteúdo.
        </p>
      </HelpSection>

      <HelpSection icon={CheckCircle2} title="2. Aprovação">
        <p>
          Só depois de aprovado o depoimento passa a ser exibido publicamente na home da
          paróquia. Use esse controle para filtrar mensagens ofensivas, incompletas ou fora do
          contexto.
        </p>
      </HelpSection>

      <HelpSection icon={Trash2} title="3. Remoção">
        <p>
          Depoimentos aprovados também podem ser removidos a qualquer momento, caso a pessoa
          peça retratação ou o conteúdo deixe de ser adequado.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
