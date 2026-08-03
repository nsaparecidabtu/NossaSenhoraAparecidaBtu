// src/app/teste-instagram/page.tsx
//
// Página de rascunho SÓ pra testar o InstagramEmbed isolado, sem
// depender do banco, do admin ou do formulário. Apaga depois de resolver.

import { InstagramEmbed } from '@/components/InstagramEmbed'

export default function TesteInstagramPage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
          Rascunho — teste isolado
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold">Teste do InstagramEmbed</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Se o Reels aparecer abaixo, o componente funciona e o problema está no fluxo de dados
          (formulário/banco). Se não aparecer nada, o problema é o componente/bloqueio do
          navegador.
        </p>

        <div className="mt-6 flex justify-center rounded-lg border border-dashed border-line p-4">
          <InstagramEmbed url="https://www.instagram.com/reel/DbhabOLsrFd/" />
        </div>
      </div>
    </main>
  )
}