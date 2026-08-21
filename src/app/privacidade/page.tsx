// src/app/politica-privacidade/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Paróquia Nossa Senhora Aparecida',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
      <div className="mt-2 space-y-3 font-body leading-relaxed text-navy/80">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: string[][]
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse font-body text-sm">
        <thead>
          <tr className="bg-navy text-cream">
            {columns.map((col) => (
              <th key={col} className="p-3 text-left text-xs font-bold uppercase tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cream/60'}>
              {row.map((cell, j) => (
                <td key={j} className="p-3 align-top text-navy/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50 hover:text-gold"
        >
          ← Voltar para o início
        </Link>

        <p className="mt-4 font-body text-xs font-bold uppercase tracking-widest text-gold">
          Paróquia Nossa Senhora Aparecida — Botucatu/SP
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="mt-2 font-body text-sm text-navy/50">Última atualização: Agosto de 2026</p>

        <div className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 font-body text-sm leading-relaxed text-navy/70">
          Este documento está em fase de revisão e pode ser ajustado antes da publicação final.
        </div>

        <Section title="1. Quem é o controlador dos dados">
          <p>
            A <strong>Paróquia Nossa Senhora Aparecida</strong> 
               Razão Social: ARQUIDIOCESE DE SANTANA DE BOTUCATU, Nome Fantasia: PAROQUIA NOSSA SENHORA APARECIDA DE BOTUCATU, CNPJ 45.424.520/0047-42, com endereço em R. Nossa Sra. Aparecida, s/nº - Vila Sao Lucio, Botucatu - SP, 18603-196,
              é a controladora dos dados pessoais
              tratados através deste site, nos termos da Lei Geral de Proteção de Dados - Lei
              13.709/2018 — LGPD.
          </p>
          <p>
            <strong>Encarregado de Proteção de Dados (DPO):</strong> ***
          </p>
          <p>
            <strong>Contato para assuntos de privacidade:</strong> PAROQUIANSAPARECIDABTU@GMAIL.COM
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <DataTable
            columns={['Categoria', 'Dados', 'Quando é coletado']}
            rows={[
              ['Conta de acesso', 'Nome, e-mail, foto de perfil (via login Google)', 'Ao fazer login no site'],
              ['Formulários de contato', 'Nome, forma de contato, mensagem, data preferida, tipo de sacramento (quando aplicável)', 'Ao enviar pedido de oração, intenção de missa, agendamento de sacramento ou contato geral'],
              ['Depoimentos', 'Nome (se identificado), texto do depoimento', 'Ao enviar um depoimento'],
              ['Catequese', 'Nome do catequizando, turma/etapa, registros de presença, vínculo com catequista responsável', 'Cadastro feito por catequista/coordenação, com base em dado fornecido pelo responsável'],
              ['Equipe/colaboradores', 'Nome, e-mail, cargo/função no painel administrativo, permissões de acesso', 'Ao ser cadastrado como colaborador do site'],
              ['Dizimistas (quando aplicável)', 'Nome, contato, endereço, vínculo familiar, status de contribuição', 'Cadastro pela secretaria/tesouraria'],
              ['Uso do site', 'Cookies de sessão/autenticação, dados técnicos de acesso', 'Automaticamente, durante a navegação'],
            ]}
          />
          <p className="mt-3">
            Não coletamos, através do site, dados de pagamento (cartão, conta bancária) — qualquer
            contribuição financeira hoje ocorre por canais externos ao sistema.
          </p>
        </Section>

        <Section title="3. Para que usamos esses dados (finalidade e base legal)">
          <DataTable
            columns={['Finalidade', 'Base legal (LGPD)']}
            rows={[
              ['Autenticar seu acesso e manter sua conta', 'Execução de contrato / consentimento (art. 7º, V e I)'],
              ['Responder pedidos de oração, intenções de missa e solicitações de sacramento', 'Execução de procedimento preliminar relacionado a contrato, e legítimo interesse pastoral (art. 7º, V e IX)'],
              ['Publicar depoimentos e pedidos no mural público', 'Consentimento específico do usuário (art. 7º, I)'],
              ['Gerir a catequese (turmas, presença, comunicação com responsáveis)', 'Consentimento do responsável legal, combinado com o legítimo interesse da atividade catequética (art. 7º, IX c/c art. 14)'],
              ['Controlar acesso de colaboradores às áreas administrativas', 'Legítimo interesse / execução de atividades da Paróquia (art. 7º, IX)'],
              ['Gestão de dizimistas', 'Consentimento do titular e legítimo interesse na administração paroquial (art. 7º, I e IX)'],
              ['Segurança e prevenção de uso indevido do site', 'Legítimo interesse (art. 7º, IX)'],
            ]}
          />
        </Section>

        <Section title="4. Dados de crianças e adolescentes (Catequese)">
          <p>O módulo de catequese trata dados de menores de idade. Nesse caso:</p>
          <Bullets
            items={[
              'O cadastro é feito com base em informação fornecida pelos pais ou responsáveis legais, que podem, a qualquer momento, solicitar acesso, correção ou exclusão dos dados do catequizando.',
              'O acesso a esses dados é restrito ao catequista responsável pela turma e à coordenação/administração da catequese — não é exibido publicamente no site.',
              'Não realizamos, no módulo de catequese, tratamento automatizado de dados para tomada de decisão sobre a criança.',
              'Em conformidade com o art. 14 da LGPD, o tratamento é limitado ao melhor interesse da criança e do adolescente, restrito à finalidade catequética.',
            ]}
          />
        </Section>

        <Section title="5. Com quem compartilhamos dados">
          <p>Não vendemos nem alugamos dados pessoais. Compartilhamos dados apenas com:</p>
          <Bullets
            items={[
              'Provedores de infraestrutura técnica que operam o site em nosso nome, como serviço de hospedagem (Vercel) e banco de dados (Neon/PostgreSQL) — atuam como operadores, sob nossas instruções;',
              'Google, para autenticação via login (Google OAuth) e incorporação de vídeos (YouTube);',
              'Serviço de geração de conteúdo por IA (Google Gemini), utilizado exclusivamente para auxiliar na geração de textos institucionais como a "Palavra do Dia" — não são enviados dados pessoais de usuários a esse serviço;',
              'Serviço de armazenamento de imagens (Vercel Blob), para hospedar fotos enviadas nos módulos de galeria e depoimentos;',
              'Autoridades públicas, quando exigido por lei ou ordem judicial.',
            ]}
          />
          <p>
            Alguns desses provedores podem processar dados em servidores localizados fora do
            Brasil. Nesses casos, buscamos utilizar fornecedores que ofereçam garantias adequadas
            de proteção de dados, conforme exigido pela LGPD.
          </p>
        </Section>

        <Section title="6. Por quanto tempo guardamos os dados">
          <p>
            Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas nesta
            Política, ou conforme exigido por lei. Ao encerrar seu vínculo com a Paróquia (ex:
            saída da catequese, pedido de exclusão de conta), você pode solicitar a exclusão dos
            seus dados, ressalvadas informações que devamos manter por obrigação legal (ex:
            registros sacramentais, que têm caráter também eclesiástico e histórico).
          </p>
        </Section>

        <Section title="7. Seus direitos como titular dos dados">
          <p>Nos termos da LGPD, você pode solicitar, a qualquer momento:</p>
          <Bullets
            items={[
              'Confirmação de que tratamos seus dados, e acesso a eles;',
              'Correção de dados incompletos, inexatos ou desatualizados;',
              'Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;',
              'Portabilidade dos dados a outro fornecedor de serviço;',
              'Eliminação dos dados tratados com base no seu consentimento;',
              'Informação sobre com quem compartilhamos seus dados;',
              'Revogação do consentimento, a qualquer momento;',
              'Revisão de decisões automatizadas, quando aplicável (não utilizamos esse tipo de decisão hoje).',
            ]}
          />
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail{' '}
            <strong>[E-MAIL DE CONTATO]</strong>. Responderemos dentro dos prazos estabelecidos
            pela LGPD.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            Utilizamos cookies estritamente necessários para manter sua sessão autenticada no
            site. Não utilizamos cookies de rastreamento publicitário.
          </p>
        </Section>

        <Section title="9. Segurança">
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais
            tratados, incluindo controle de acesso por perfil/permissão nas áreas administrativas
            e uso de conexão segura (HTTPS). Nenhum sistema é totalmente livre de risco; em caso
            de incidente de segurança que possa acarretar risco relevante aos titulares,
            comunicaremos conforme exigido pela LGPD.
          </p>
        </Section>

        <Section title="10. Alterações desta Política">
          <p>
            Esta Política pode ser atualizada periodicamente para refletir mudanças no site ou na
            legislação. A versão vigente estará sempre disponível nesta página, com a data da
            última atualização indicada no topo.
          </p>
        </Section>

        <Section title="11. Contato">
          <p>
            Dúvidas, solicitações ou reclamações relacionadas a esta Política podem ser enviadas
            para <strong>PAROQUIANSAPARECIDABTU@GMAIL.COM</strong>.
          </p>
        </Section>
      </div>
    </main>
  )
}
