// src/app/admin/eventos/components/tabs/HelpEventosTab.tsx
import { CalendarDays, ListOrdered } from 'lucide-react'
import { HelpRoot, HelpHeader, HelpSection } from '@/components/admin/HelpManual'

export function HelpEventosTab() {
  return (
    <HelpRoot>
      <HelpHeader
        title="Manual de Instruções — Eventos"
        description="Como cadastrar e organizar os próximos eventos da paróquia exibidos na home."
      />

      <HelpSection icon={CalendarDays} title="1. Cadastro de Eventos">
        <p>
          Preencha título, descrição, data/horário e local. A imagem é opcional, mas deixa o
          card mais atrativo na home.
        </p>
      </HelpSection>

      <HelpSection icon={ListOrdered} title="2. Exibição na Home">
        <p>
          A home mostra sempre os 3 próximos eventos, ordenados automaticamente pela data
          cadastrada — eventos passados somem sozinhos da lista pública.
        </p>
      </HelpSection>
    </HelpRoot>
  )
}
