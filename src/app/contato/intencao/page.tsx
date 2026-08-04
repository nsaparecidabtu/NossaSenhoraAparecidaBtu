// src/app/contato/intencao/page.tsx
import { auth } from '@/auth'
import { ContactForm } from '@/components/ContactForm'

export default async function IntencaoPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-bold">Intenção de Missa</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Conte pra gente por quem ou por qual intenção você quer que a missa seja celebrada.
        </p>
        <div className="mt-6">
          <ContactForm type="MASS_INTENTION" isLoggedIn={!!session?.user} showDateField />
        </div>
      </div>
    </main>
  )
}