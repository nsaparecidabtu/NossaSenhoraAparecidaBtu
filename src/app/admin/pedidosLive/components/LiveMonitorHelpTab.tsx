import { MonitorPlay, MessageSquare, Trash2 } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function LiveMonitorHelpTab() {
  return (
    <HelpRoot>
      <HelpHeader 
        title="Manual do Monitor de Intenções"
        description="Orientações de moderação em tempo real para controle de exibição de pedidos de oração durante as Santas Missas."
      />

      <HelpSection icon={MessageSquare} title="1. Recepção e Moderação em Tempo Real">
        <p>
          As intenções enviadas pelos fiéis através do site aparecem automaticamente nesta tela, sem necessidade de atualizar a página.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Aprovar para o Mural:</strong> Ao clicar no botão de aprovação, a intenção é projetada instantaneamente na tela da transmissão ao vivo para que o sacerdote possa acompanhá-la.</li>
          <li><strong>Ocultar do Mural:</strong> Se uma intenção já aprovada precisar ser retirada da tela antes do fim da missa, basta desmarcá-la.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={MonitorPlay} title="2. Navegação e Filtros">
        <p>
          Utilize as abas de filtro no topo da lista para manter a organização durante os momentos de pico da transmissão.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Todas:</strong> Exibe o fluxo completo de mensagens que estão chegando.</li>
          <li><strong>No Mural:</strong> Exibe estritamente as intenções que estão visíveis na tela do público no momento atual.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={Trash2} title="3. Encerramento e Limpeza da Missa">
        <p>
          Ao término da celebração, é fundamental preparar o sistema para a próxima transmissão.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Arquivar Individualmente:</strong> Marque como "Resolvida" uma intenção que já foi lida, retirando-a da sua fila de moderação.</li>
          <li><strong>Limpar Mural (Ação Global):</strong> Utilize o botão vermelho de limpeza ao final da missa para retirar todas as intenções do ar simultaneamente, arquivando-as no banco de dados.</li>
        </ul>
      </HelpSection>
    </HelpRoot>
  )
}