// src/app/admin/configuracoes/components/tabs/HelpSettingsTab.tsx
import { Settings, Link as LinkIcon, ShieldCheck } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpSettingsTab() {
  return (
    <HelpRoot>
      <HelpHeader 
        title="Manual de Instruções — Configurações"
        description="Guia rápido para orientar a administração sobre o preenchimento correto dos dados institucionais e links do rodapé."
      />

      <HelpSection icon={Settings} title="1. Geral & Tema (Identidade Visual)">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Nome da Paróquia:</strong> Nome oficial exibido no cabeçalho, rodapé e SEO da página.</li>
          <li><strong>Frase de Destaque (Hero):</strong> O slogan principal que aparece em destaque na página inicial.</li>
          <li><strong>Atmosfera Litúrgica:</strong> Altera o tom visual do site de acordo com o tempo litúrgico. O modo <em>Full Color</em> aplica tintas temáticas nos botões.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={LinkIcon} title="2. Rodapé & Dinâmicos (Cards de Contato)">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Redes Sociais:</strong> Insira sempre o link completo (ex: <code>https://instagram.com/suaparoquia</code>). O sistema exibe o ícone de forma automática.</li>
          <li><strong>Endereços e Mapas:</strong> Utilize o campo opcional <em>Link do Google Maps</em> colando o link curto de compartilhamento para gerar o botão interativo.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={ShieldCheck} title="3. Boas Práticas de Manutenção">
        <p>
          Todas as alterações feitas nestas abas entram em vigor instantaneamente no site público graças ao sistema de revalidação de cache. Não é necessário realizar novo deploy na Vercel para atualizar telefones, endereços ou redes sociais.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}