// src/components/home/MinistriesSection.tsx

type Ministry = {
  id: string
  name: string
  description: string | null
  meetingSchedule: string | null
}

export function MinistriesSection({ ministries }: { ministries: Ministry[] }) {
  if (ministries.length === 0) return null

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold text-gold">Pastorais e Ministérios</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ministries.map((m) => (
          <div key={m.id} className="rounded-lg border border-line bg-white p-4">
            <p className="font-display text-lg font-semibold">{m.name}</p>
            {m.description && <p className="mt-1 font-body text-sm text-navy/70">{m.description}</p>}
            {m.meetingSchedule && (
              <p className="mt-2 font-mono text-xs text-navy/50">{m.meetingSchedule}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}