// src/app/admin/ministerios/AdminMinistriesClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { createMinistry, updateMinistry, deleteMinistry } from '@/actions/ministry'

type Ministry = {
  id: string
  name: string
  slug: string
  description: string | null
  contactInfo: string | null
  meetingSchedule: string | null
  order: number
}

type ActionState = { success: boolean; error?: string }

function TextField({
  name,
  label,
  defaultValue,
  textarea,
  required,
}: {
  name: string
  label: string
  defaultValue?: string | null
  textarea?: boolean
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ''}
          rows={3}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue ?? ''}
          required={required}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      )}
    </div>
  )
}

function CreateMinistryForm({ nextOrder }: { nextOrder: number }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createMinistry, {
    success: false,
  })

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-line bg-white p-6">
      <TextField name="name" label="Nome" required />
      <TextField name="slug" label="Slug (ex: acolhida)" required />
      <TextField name="description" label="Descrição" textarea />
      <TextField name="contactInfo" label="Contato" />
      <TextField name="meetingSchedule" label="Horário de reunião" />
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Ordem de exibição
        </label>
        <input
          name="order"
          type="number"
          defaultValue={nextOrder}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Adicionar Ministério'}
      </button>

      {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
    </form>
  )
}

function EditMinistryForm({ ministry, onDone }: { ministry: Ministry; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateMinistry, {
    success: false,
  })

  return (
    <form
      action={formAction}
      className="mt-3 space-y-3 rounded border border-dashed border-line bg-cream/40 p-4"
    >
      <input type="hidden" name="id" value={ministry.id} />
      <TextField name="name" label="Nome" defaultValue={ministry.name} required />
      <TextField name="slug" label="Slug" defaultValue={ministry.slug} required />
      <TextField
        name="description"
        label="Descrição"
        defaultValue={ministry.description}
        textarea
      />
      <TextField name="contactInfo" label="Contato" defaultValue={ministry.contactInfo} />
      <TextField
        name="meetingSchedule"
        label="Horário de reunião"
        defaultValue={ministry.meetingSchedule}
      />
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Ordem de exibição
        </label>
        <input
          name="order"
          type="number"
          defaultValue={ministry.order}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded bg-navy py-2 font-body text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-60"
        >
          {pending ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded border border-line py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy/60"
        >
          Cancelar
        </button>
      </div>

      {state?.error && <p className="font-body text-xs text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-xs text-green-700">Salvo!</p>}
    </form>
  )
}

export function AdminMinistriesClient({ ministries }: { ministries: Ministry[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Pastorais e Ministérios</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Aparecem na home na ordem definida abaixo.
        </p>

        <div className="mt-8">
          <CreateMinistryForm nextOrder={ministries.length} />
        </div>

        <div className="mt-8 space-y-3">
          {ministries.map((m) =>
            editingId === m.id ? (
              <div key={m.id} className="rounded-lg border border-line bg-white p-4">
                <EditMinistryForm ministry={m} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={m.id} className="rounded-lg border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold">{m.name}</p>
                    <p className="font-mono text-xs text-navy/50">/{m.slug}</p>
                    {m.meetingSchedule && (
                      <p className="mt-1 font-body text-xs text-navy/60">{m.meetingSchedule}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => setEditingId(m.id)}
                      className="font-body text-xs font-semibold text-navy/60 hover:underline"
                    >
                      Editar
                    </button>
                    <form
                      action={async () => {
                        await deleteMinistry(m.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="font-body text-xs font-semibold text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}