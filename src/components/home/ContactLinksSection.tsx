// src/components/home/ContactLinksSection.tsx
import Link from 'next/link'

const LINKS = [
  { href: '/contato/oracao', label: 'Pedido de Oração' },
  { href: '/contato/intencao', label: 'Intenção de Missa' },
  { href: '/contato/sacramento', label: 'Agendar Sacramento' },
  { href: '/contato/geral', label: 'Contato Geral' },
]

export function ContactLinksSection() {
  return (
    <section id="contato" className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold text-gold">Fale Conosco</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-line bg-white p-4 text-center font-body font-semibold transition-colors hover:border-gold"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}