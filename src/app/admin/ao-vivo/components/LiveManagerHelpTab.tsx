//src/app/admin/ao-vivo/components/LiveManagerHelpTab.tsx

import { Radio, AlertTriangle } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'
import { FaYoutube } from 'react-icons/fa'

export function LiveManagerHelpTab() {
  return (
    <HelpRoot>
      <HelpHeader 
        title="Manual Operacional de Transmissões"
        description="Central de documentação para controle de canais do YouTube e acionamento do modo de emergência da paróquia."
      />

      <HelpSection icon={FaYoutube} title="1. Canais do YouTube Conectados">
        <p>
          O sistema permite vincular múltiplos canais do YouTube, definindo qual deles é o <strong>Principal</strong> para exibição automática das transmissões.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Adicionar Canal:</strong> Cole a URL completa do canal ou o handle (ex: <code>@paroquiaaparecidabotucatu</code>). O sistema identificará automaticamente os metadados.</li>
          <li><strong>Canal Principal:</strong> Apenas um canal pode ser o principal por vez. Ele é a referência para varreduras automáticas de lives ativas.</li>
          <li><strong>Suspender / Excluir:</strong> Use "Suspender" para ocultar temporariamente o canal das varreduras sem perder o histórico, ou "Excluir" para removê-lo definitivamente.</li>
        </ul>
      </HelpSection>

      <HelpSection icon={Radio} title="2. Controle de Emergência / Modo Manual">
        <p>
          Caso a API do YouTube demore a atualizar o status da transmissão automática ou ocorra algum imprevisto técnico, você pode assumir o controle manual da exibição no site.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Status da Transmissão:</strong> Ative a chave seletora para forçar a exibição imediata do player de vídeo na página pública (<code>/ao-vivo</code>).</li>
          <li><strong>Link da Live:</strong> Cole a URL exata do vídeo gerada no YouTube Studio (ex: <code>https://www.youtube.com/watch?v=ExemploID</code>).</li>
        </ul>
      </HelpSection>

      <HelpSection icon={AlertTriangle} title="3. Encerramento da Missa">
        <p>
          Se você utilizou o <strong>Controle de Emergência</strong>, é obrigatório desativar a chave seletora ao término da missa. Caso contrário, o site continuará exibindo o player fixo para os visitantes.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}