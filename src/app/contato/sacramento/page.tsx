// src/app/contato/sacramento/page.tsx
import { auth } from '@/auth'
import { ContactForm } from '@/components/ContactForm'

export default async function SacramentoPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-bold">Agendar Sacramento</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Preencha os dados e a secretaria entra em contato pra confirmar data e preparação.
        </p>
        <div className="mt-6">
          <ContactForm
            type="SACRAMENT"
            isLoggedIn={!!session?.user}
            showSacramentField
            showDateField
          />
        </div>
      </div>
    </main>
  )
}