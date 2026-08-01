// src/components/TestimonialsSection.tsx
//
// Isolado num componente próprio (renderizado dentro de <Suspense> no
// page.tsx) porque auth() usa headers() por baixo dos panos — sem esse
// isolamento, o build do Next tenta avaliar isso fora do contexto de uma
// requisição real e quebra com "headers() was called outside a request
// scope", mesmo com `export const dynamic = 'force-dynamic'`.

import { auth, signIn } from '@/auth'
import { TestimonialForm } from '@/components/TestimonialForm'

export async function TestimonialsSubmitArea() {
  const session = await auth()

  if (session?.user) {
    return <TestimonialForm />
  }

  return (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}
      className="rounded-lg border border-dashed border-line bg-white p-4 text-center"
    >
      <p className="font-body text-sm text-navy/60">
        Quer compartilhar sua história com a comunidade?
      </p>
      <button
        type="submit"
        className="mt-3 rounded bg-navy px-5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream transition-opacity hover:opacity-90"
      >
        Entrar com Google e deixar um depoimento
      </button>
    </form>
  )
}