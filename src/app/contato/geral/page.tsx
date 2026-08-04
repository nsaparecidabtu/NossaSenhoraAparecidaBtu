// src/app/contato/geral/page.tsx
import { auth } from '@/auth'
import { ContactForm } from '@/components/ContactForm'

export default async function ContatoGeralPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-bold">Contato Geral</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Dúvidas, sugestões ou qualquer outro assunto — escreva pra gente.
        </p>
        <div className="mt-6">
          <ContactForm type="GENERAL" isLoggedIn={!!session?.user} />
        </div>
      </div>
    </main>
  )
}