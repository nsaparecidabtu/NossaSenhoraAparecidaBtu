// src/components/ContactForm.tsx
'use client'

import { useActionState } from 'react'
import { createContactRequest } from '@/actions/contactRequest'

type ActionState = { success: boolean; error?: string }

type Props = {
  type: 'PRAYER' | 'MASS_INTENTION' | 'SACRAMENT' | 'GENERAL'
  isLoggedIn: boolean
  showDateField?: boolean
  showSacramentField?: boolean
  showPublicWallCheckbox?: boolean
}

export function ContactForm({
  type,
  isLoggedIn,
  showDateField,
  showSacramentField,
  showPublicWallCheckbox,
}: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createContactRequest,
    { success: false }
  )

  if (state.success) {
    return (
      <div className="rounded-lg border border-line bg-white p-6 text-center">
        <p className="font-display text-lg font-semibold">Recebemos sua mensagem!</p>
        <p className="mt-2 font-body text-sm text-navy/60">
          Alguém da paróquia vai entrar em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-line bg-white p-6">
      <input type="hidden" name="type" value={type} />

      {!isLoggedIn && (
        <div className="rounded border border-dashed border-line bg-cream/40 p-3">
          <p className="font-body text-xs text-navy/60">
            Prefere entrar com Google? Ajuda a gente a acompanhar melhor seu pedido — mas não é
            obrigatório, pode preencher direto abaixo.
          </p>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Nome
        </label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Telefone ou e-mail
        </label>
        <input
          name="contact"
          required
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {showSacramentField && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
            Sacramento
          </label>
          <select
            name="sacramentType"
            required
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
          >
            <option value="BAPTISM">Batismo</option>
            <option value="MARRIAGE">Casamento</option>
            <option value="CONFIRMATION">Crisma</option>
            <option value="FIRST_COMMUNION">Primeira Comunhão</option>
          </select>
        </div>
      )}

      {showDateField && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
            Data desejada
          </label>
          <input
            name="preferredDate"
            type="date"
            className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/60">
          Mensagem
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {showPublicWallCheckbox && (
        <label className="flex items-start gap-2 font-body text-sm text-navy/70">
          <input type="checkbox" name="wantsPublicWall" className="mt-1" />
          Quero que este pedido apareça (após aprovação) no mural público de orações
        </label>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? 'Enviando...' : 'Enviar'}
      </button>

      {state.error && <p className="font-body text-sm text-red-600">{state.error}</p>}
    </form>
  )
}