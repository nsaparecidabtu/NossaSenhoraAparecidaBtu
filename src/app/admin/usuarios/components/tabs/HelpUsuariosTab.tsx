// src/app/admin/usuarios/components/tabs/HelpUsuariosTab.tsx
import { ShieldCheck, Users, UserPlus, KeyRound } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpUsuariosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Usuários e Permissões"
        description="Como funciona a organização por papel e a concessão de acesso ao painel administrativo."
      />

      <HelpSection icon={ShieldCheck} title="1. Papéis (Cargos)">
        <p>
          A equipe do painel é dividida em 3 níveis, sempre visíveis por inteiro no topo da
          página:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Super Admin:</strong> acesso total, sem precisar marcar permissões.</li>
          <li><strong>Líder de Ministério:</strong> acesso restrito às áreas marcadas manualmente.</li>
          <li><strong>Equipe Operacional / Staff:</strong> mesmo esquema de permissões marcadas manualmente — uso típico de catequistas e secretaria.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={KeyRound} title="2. Permissões por Área">
        <p>
          Para Staff e Líder de Ministério, cada card mostra badges com as áreas liberadas (ex:
          Catequese, Eventos, Galeria) — dá pra ver de relance quem pode mexer em quê, sem abrir
          o formulário de edição.
        </p>
      </HelpSection>

      <HelpSection icon={UserPlus} title="3. Promovendo um Fiel a Staff">
        <p>
          Fiéis que só têm login (sem papel no painel) ficam numa lista separada embaixo, com
          busca por nome ou e-mail. Clique em &quot;Editar acesso&quot; e escolha um cargo pra dar
          permissão a alguém.
        </p>
      </HelpSection>

      <HelpSection icon={Users} title="4. Removendo Acesso">
        <p>
          Pra tirar o acesso de alguém da equipe, edite o cargo dela e selecione &quot;Sem acesso ao
          painel&quot;. Você não consegue alterar seu próprio cargo por essa tela, por segurança.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
