// src/app/admin/catequese/components/tabs/HelpTab.tsx
import { BookOpen, QrCode, Users, GraduationCap, FileText, Printer, HelpCircle } from 'lucide-react'

export function HelpTab() {
  return (
    <div className="space-y-6 animate-[fadein_0.3s_ease] pb-12">
      
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-gold">
          <BookOpen className="h-6 w-6" />
          <h2 className="font-display text-xl font-bold text-navy">Manual Operacional do Sistema</h2>
        </div>
        <p className="mt-2 font-body text-sm text-navy/70 leading-relaxed">
          Central de documentação interna. Utilize este guia para tirar dúvidas sobre os fluxos de chamada, cadastros e geração de relatórios oficiais da paróquia.
        </p>
      </div>

      {/* Seção 1: Semana e QR Code */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-navy">
          <QrCode className="h-5 w-5 text-gold" />
          <h3 className="font-display text-base font-bold">1. Gestão da Semana e Cartaz QR Code</h3>
        </div>
        <p className="font-body text-sm text-navy/70">
          O sistema opera baseado em <strong>Semanas Abertas</strong>. Enquanto uma semana estiver ativa, o link público aceita o registro de presença dos catequizandos.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 font-body text-sm text-navy/70">
          <li><strong>Como abrir:</strong> Na aba <em>Semana / QR</em>, insira um título descritivo (ex: &quot;1ª Semana - Setembro&quot;) e clique em abrir. A semana anterior será encerrada automaticamente.</li>
          <li><strong>Cartaz para Impressão:</strong> Clique em <em>&quot;Imprimir Cartaz A4&quot;</em> para baixar um PDF oficial contendo o logotipo da paróquia e o QR Code centralizado pronto para o mural da igreja.</li>
          <li><strong>Encerramento:</strong> Após os horários de missa de domingo, clique em <em>&quot;Encerrar esta semana&quot;</em> para bloquear novas submissões retroativas.</li>
        </ul>
      </div>

      {/* Seção 2: Catequistas */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-navy">
          <Users className="h-5 w-5 text-gold" />
          <h3 className="font-display text-base font-bold">2. Cadastro e Controle de Catequistas</h3>
        </div>
        <p className="font-body text-sm text-navy/70">
          Gerencie a equipe pastoral vinculada às etapas de formação. Ao cadastrar um catequista, selecione todas as etapas em que ele atua. Caso haja desligamento ou afastamento, utilize o botão de alternância de status para desativá-lo sem apagar o histórico de chamadas.
        </p>
      </div>

      {/* Seção 3: Catequizandos */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-navy">
          <GraduationCap className="h-5 w-5 text-gold" />
          <h3 className="font-display text-base font-bold">3. Gestão de Catequizandos (Alunos)</h3>
        </div>
        <p className="font-body text-sm text-navy/70">
          A listagem oficial dos matriculados. O sistema possui validação cruzada: ao selecionar a etapa do aluno, o campo de catequista é filtrado dinamicamente para exibir apenas os responsáveis autorizados para aquela turma específica.
        </p>
      </div>

      {/* Seção 4: Relatórios e Lançamentos */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-navy">
          <FileText className="h-5 w-5 text-gold" />
          <h3 className="font-display text-base font-bold">4. Relatórios, Auditoria e Exportação</h3>
        </div>
        <p className="font-body text-sm text-navy/70">
          Na aba de relatórios, utilize os filtros Server-Side por semana, catequista ou etapa para refinar os dados instantaneamente.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 font-body text-sm text-navy/70">
          <li><strong>Lançamento Manual:</strong> Caso algum aluno compareça mas não consiga registrar via celular, utilize o formulário de exceções no topo da aba de relatórios.</li>
          <li><strong>Exportação em Lote:</strong> Utilize os botões de <em>CSV</em> (para planilhas do Excel/Google Sheets) ou <em>PDF</em> (para relatórios tabulares oficiais formatados) gerados diretamente no navegador do usuário com custo zero de processamento no servidor.</li>
        </ul>
      </div>

    </div>
  )
}