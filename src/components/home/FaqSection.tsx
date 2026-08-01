// src/components/home/FaqSection.tsx

type Faq = { id: string; question: string; answer: string }

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold text-gold">Perguntas Frequentes</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="rounded-lg border border-line bg-white p-4">
            <summary className="cursor-pointer font-body font-semibold">{f.question}</summary>
            <p className="mt-2 font-body text-sm text-navy/70">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}