// src/app/admin/configuracoes/components/tabs/HelpSettingsTab.tsx

export function HelpSettingsTab() {
  return (
    <div className="space-y-6 rounded-xl border border-line bg-white p-6 shadow-sm animate-[fadein_0.3s_ease]">
      <div>
        <h2 className="font-display text-lg font-bold text-navy">Manual de Instruções — Configurações</h2>
        <p className="mt-1 font-body text-xs text-navy/60">
          Guia rápido para orientar a administração sobre o preenchimento correto dos dados institucionais e links do rodapé.
        </p>
      </div>

      <div className="space-y-4 font-body text-sm text-navy/80">
        <div className="rounded-lg border border-line/60 bg-cream/30 p-4">
          <h3 className="font-bold text-navy">1. Geral & Tema (Identidade Visual)</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-navy/70">
            <li><strong>Nome da Paróquia:</strong> Nome oficial exibido no cabeçalho, rodapé e SEO da página.</li>
            <li><strong>Frase de Destaque (Hero):</strong> O slogan principal que aparece em destaque na página inicial.</li>
            <li><strong>Atmosfera Litúrgica:</strong> Altera o tom visual do site de acordo com o tempo litúrgico (ex: Advento, Quaresma, Comum). O modo <em>Full Color</em> aplica tintas temáticas nos botões e barras.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-line/60 bg-cream/30 p-4">
          <h3 className="font-bold text-navy">2. Rodapé & Dinâmicos (Cards de Contato)</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-navy/70">
            <li><strong>Redes Sociais:</strong> Insira sempre o link completo (ex: <code className="bg-white px-1 py-0.5 rounded border">https://instagram.com/suaparoquia</code>). O sistema identifica o link e exibe o ícone correspondente no rodapé de forma automática.</li>
            <li><strong>Endereços e Mapas:</strong> Ao cadastrar a Matriz ou Capelas, preencha o campo de texto com o logradouro e utilize o campo opcional <em>Link do Google Maps</em> colando o link curto de compartilhamento do Google Maps. Isso gerará o botão interativo para os fiéis traçarem a rota pelo celular.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-line/60 bg-cream/30 p-4">
          <h3 className="font-bold text-navy">3. Boas Práticas de Manutenção</h3>
          <p className="mt-1 text-xs text-navy/70 leading-relaxed">
            Todas as alterações feitas nestas abas entram em vigor instantaneamente no site público graças ao sistema de revalidação de cache. Não é necessário realizar novo deploy na Vercel para atualizar telefones, endereços ou redes sociais.
          </p>
        </div>
      </div>
    </div>
  )
}