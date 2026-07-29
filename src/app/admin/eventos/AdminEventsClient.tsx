// src/app/admin/eventos/AdminEventsClient.tsx
'use client'

import { useActionState, useState } from 'react'
import { createEvent, updateEvent, deleteEvent } from '@/actions/event'
import { ImageUpload } from '@/components/admin/ImageUpload'

type Event = {
  id: string
  title: string
  description: string | null
  eventDate: Date
  location: string | null
  imageUrl: string | null
}

type ActionState = { success: boolean; error?: string }

// datetime-local espera "YYYY-MM-DDTHH:mm" em horário local
function toLocalInputValue(date: Date) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function TextField({
  name,
  label,
  defaultValue,
  textarea,
  type,
  required,
}: {
  name: string
  label: string
  defaultValue?: string | null
  textarea?: boolean
  type?: string
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
          type={type ?? 'text'}
          defaultValue={defaultValue ?? ''}
          required={required}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      )}
    </div>
  )
}

function CreateEventForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createEvent, {
    success: false,
  })

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-line bg-white p-6">
      <TextField name="title" label="Título" required />
      <TextField name="eventDate" label="Data e hora" type="datetime-local" required />
      <TextField name="location" label="Local" />
      <TextField name="description" label="Descrição" textarea />
      <ImageUpload name="imageUrl" label="Imagem do evento" />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Adicionar Evento'}
      </button>

      {state?.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="font-body text-sm text-green-700">Salvo!</p>}
    </form>
  )
}

function EditEventForm({ event, onDone }: { event: Event; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateEvent, {
    success: false,
  })

  return (
    <form
      action={formAction}
      className="mt-3 space-y-3 rounded border border-dashed border-line bg-cream/40 p-4"
    >
      <input type="hidden" name="id" value={event.id} />
      <TextField name="title" label="Título" defaultValue={event.title} required />
      <TextField
        name="eventDate"
        label="Data e hora"
        type="datetime-local"
        defaultValue={toLocalInputValue(event.eventDate)}
        required
      />
      <TextField name="location" label="Local" defaultValue={event.location} />
      <TextField name="description" label="Descrição" defaultValue={event.description} textarea />
      <ImageUpload name="imageUrl" label="Imagem do evento" defaultValue={event.imageUrl} />

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

export function AdminEventsClient({ events }: { events: Event[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-cream px-6 py-12 text-navy">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Próximos Eventos</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          A home mostra os 3 próximos eventos, ordenados por data.
        </p>

        <div className="mt-8">
          <CreateEventForm />
        </div>

        <div className="mt-8 space-y-3">
          {events.map((e) =>
            editingId === e.id ? (
              <div key={e.id} className="rounded-lg border border-line bg-white p-4">
                <EditEventForm event={e} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={e.id} className="rounded-lg border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-navy/50">
                      {new Date(e.eventDate).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="mt-1 font-display font-semibold">{e.title}</p>
                    {e.location && (
                      <p className="mt-1 font-body text-xs text-navy/60">{e.location}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => setEditingId(e.id)}
                      className="font-body text-xs font-semibold text-navy/60 hover:underline"
                    >
                      Editar
                    </button>
                    <form
                      action={async () => {
                        await deleteEvent(e.id)
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