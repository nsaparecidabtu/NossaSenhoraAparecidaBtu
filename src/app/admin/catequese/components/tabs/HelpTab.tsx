// src/app/admin/catequese/components/tabs/HelpTab.tsx
import { QrCode, Users, GraduationCap, FileText } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpTab() {
  return (
    <HelpRoot>
      <HelpHeader 
        title="Manual Operacional do Sistema"
        description="Central de documentação interna. Utilize este guia para tirar dúvidas sobre os fluxos de chamada, cadastros e geração de relatórios oficiais da paróquia."
      />

      <HelpSection icon={QrCode} title="1. Gestão da Semana e Cartaz QR Code">
        <p>
          O sistema opera baseado em <strong>Semanas Abertas</strong>. Enquanto uma semana estiver ativa, o link público aceita o registro de presença dos catequizandos[cite: 1].
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Como abrir:</strong> Na aba <em>Semana / QR</em>, insira um título descritivo (ex: "1ª Semana - Setembro") e clique em abrir[cite: 1]. A semana anterior será encerrada automaticamente[cite: 1].</li>
          <li><strong>Cartaz para Impressão:</strong> Clique em <em>"Imprimir Cartaz A4"</em> para baixar um PDF oficial contendo o logotipo da paróquia e o QR Code centralizado pronto para o mural da igreja[cite: 1].</li>
          <li><strong>Encerramento:</strong> Após os horários de missa de domingo, clique em <em>"Encerrar esta semana"</em> para bloquear novas submissões retroativas[cite: 1].</li>
        </ul>
      </HelpSection>

      <HelpSection icon={Users} title="2. Cadastro e Controle de Catequistas">
        <p>
          Gerencie a equipe pastoral vinculada às etapas de formação[cite: 1]. Ao cadastrar um catequista, selecione todas as etapas em que ele atua[cite: 1]. Caso haja desligamento ou afastamento, utilize o botão de alternância de status para desativá-lo sem apagar o histórico de chamadas[cite: 1].
        </p>
      </HelpSection>

      <HelpSection icon={GraduationCap} title="3. Gestão de Catequizandos (Alunos)">
        <p>
          A listagem oficial dos matriculados[cite: 1]. O sistema possui validação cruzada: ao selecionar a etapa do aluno, o campo de catequista é filtrado dinamicamente para exibir apenas os responsáveis autorizados para aquela turma específica[cite: 1].
        </p>
      </HelpSection>

      <HelpSection icon={FileText} title="4. Relatórios, Auditoria e Exportação">
        <p>
          Na aba de relatórios, utilize os filtros Server-Side por semana, catequista ou etapa para refinar os dados instantaneamente[cite: 1].
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Lançamento Manual:</strong> Caso algum aluno compareça mas não consiga registrar via celular, utilize o formulário de exceções no topo da aba de relatórios[cite: 1].</li>
          <li><strong>Exportação em Lote:</strong> Utilize os botões de <em>CSV</em> (para planilhas do Excel/Google Sheets) ou <em>PDF</em> (para relatórios tabulares oficiais formatados) gerados diretamente no navegador do usuário com custo zero de processamento no servidor[cite: 1].</li>
        </ul>
      </HelpSection>
    </HelpRoot>
  )
}