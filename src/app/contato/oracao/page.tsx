// src/app/contato/oracao/page.tsx
import { auth } from '@/auth'
import { ContactForm } from '@/components/ContactForm'

export default async function OracaoPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-bold">Pedido de Oração</h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Compartilhe seu pedido — nossa comunidade vai rezar por você.
        </p>
        <div className="mt-6">
          <ContactForm type="PRAYER" isLoggedIn={!!session?.user} showPublicWallCheckbox />
        </div>
      </div>
    </main>
  )
}