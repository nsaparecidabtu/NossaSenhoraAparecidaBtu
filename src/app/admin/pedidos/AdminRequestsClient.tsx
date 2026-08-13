// src/app/admin/pedidos/AdminRequestsClient.tsx
'use client'

import { useState } from 'react'
import { updateContactRequestStatus, approveForWall } from '@/actions/contactRequest'

type Request = {
  id: string
  type: 'PRAYER_GENERAL' | 'MASS_INTENTION' | 'SACRAMENT' | 'GENERAL_CONTACT'
  name: string
  contact: string
  message: string
  preferredDate: Date | null
  sacramentType: string | null
  wantsPublicWall: boolean
  approvedForWall: boolean
  status: 'PENDING' | 'APPROVED' | 'RESOLVED'
  createdAt: Date
}

const TYPE_LABELS: Record<Request['type'], string> = {
  PRAYER_GENERAL: 'Pedido de Oração',
  MASS_INTENTION: 'Intenção de Missa',
  SACRAMENT: 'Agendar Sacramento',
  GENERAL_CONTACT: 'Contato Geral',
}

const STATUS_LABELS: Record<Request['status'], string> = {
  PENDING: 'Pendente',
  APPROVED: 'Contatado',
  RESOLVED: 'Resolvido',
}

function fmtDate(date: Date | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR')
}

export function AdminRequestsClient({ requests }: { requests: Request[] }) {
  const [filter, setFilter] = useState<'ALL' | Request['type']>('ALL')

  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.type === filter)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Pedidos Recebidos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Tudo que chega pelos formulários de contato da home.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(['ALL', 'PRAYER_GENERAL', 'MASS_INTENTION', 'SACRAMENT', 'GENERAL_CONTACT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide ${
                filter === t
                  ? 'border-navy bg-navy text-cream'
                  : 'border-line text-navy/60 hover:border-navy/40'
              }`}
            >
              {t === 'ALL' ? 'Todos' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <p className="font-body text-sm text-navy/40">Nenhum pedido por aqui.</p>
          )}

          {filtered.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/40">
                    {TYPE_LABELS[r.type]} · {fmtDate(r.createdAt)}
                  </p>
                  <p className="mt-1 font-display font-semibold">{r.name}</p>
                  <p className="font-body text-xs text-navy/50">{r.contact}</p>
                  {r.sacramentType && (
                    <p className="mt-1 font-mono text-xs text-navy/50">{r.sacramentType}</p>
                  )}
                  {r.preferredDate && (
                    <p className="font-mono text-xs text-navy/50">
                      Data desejada: {fmtDate(r.preferredDate)}
                    </p>
                  )}
                  <p className="mt-2 font-body text-sm text-navy/80">{r.message}</p>
                  {r.wantsPublicWall && (
                    <p className="mt-2 font-body text-xs text-navy/50">
                      {r.approvedForWall
                        ? '✅ Aprovado no mural público'
                        : '⏳ Quer aparecer no mural público — aguardando aprovação'}
                    </p>
                  )}
                </div>

                <select
                  value={r.status}
                  onChange={(e) =>
                    updateContactRequestStatus(r.id, e.target.value as Request['status'])
                  }
                  className="shrink-0 rounded border border-line bg-white px-2 py-1 font-body text-xs"
                >
                  {(['PENDING', 'APPROVED', 'RESOLVED'] as const).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {r.wantsPublicWall && !r.approvedForWall && (
                <form
                  action={async () => {
                    await approveForWall(r.id)
                  }}
                  className="mt-3"
                >
                  <button
                    type="submit"
                    className="rounded bg-navy px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-cream"
                  >
                    Aprovar pro mural público
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}