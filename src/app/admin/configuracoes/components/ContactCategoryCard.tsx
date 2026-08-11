// src/app/admin/configuracoes/components/ContactCategoryCard.tsx
'use client'

import { useActionState, useRef } from 'react'
import { addContact, removeContact } from '@/actions/siteContacts'

type Contact = { id: string; label: string; value: string; mapUrl: string | null }
type ActionState = { success: boolean; error?: string | null }

export function ContactCategoryCard({
  category, title, placeholder, contacts,
}: {
  category: string
  title: string
  placeholder: string
  contacts: Contact[]
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await addContact(prevState, formData)
      if (res.success) formRef.current?.reset()
      return res
    },
    { success: false, error: null }
  )

  const isAddress = category === 'ADDRESS'

  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-sm">
      <h3 className="font-display text-base font-bold text-navy">{title}</h3>
      
      <form ref={formRef} action={formAction} className="mt-3 space-y-2 border-b border-line pb-4">
        <input type="hidden" name="category" value={category} />
        <input 
          name="label" required placeholder='Ex: "Matriz" ou "Oficial"' 
          className="w-full rounded border border-line px-3 py-1.5 text-xs focus:border-gold focus:outline-none"
        />
        <input 
          name="value" required placeholder={placeholder} 
          className="w-full rounded border border-line px-3 py-1.5 text-xs focus:border-gold focus:outline-none"
        />
        {isAddress && (
          <input 
            name="mapUrl" placeholder="Link do Google Maps (Opcional)" 
            className="w-full rounded border border-line px-3 py-1.5 text-xs focus:border-gold focus:outline-none"
          />
        )}
        <button disabled={pending} className="w-full rounded bg-navy/5 py-2 text-xs font-bold uppercase tracking-wide text-navy hover:bg-navy hover:text-cream transition-colors disabled:opacity-50">
          {pending ? 'Salvando...' : 'Adicionar'}
        </button>
        {state.error && <p className="text-[10px] text-red-600">{state.error}</p>}
      </form>

      <div className="mt-3 flex-1 space-y-2 overflow-y-auto max-h-48">
        {contacts.map((c) => (
          <div key={c.id} className="flex items-start justify-between gap-2 rounded bg-cream/30 p-2 text-xs">
            <div className="truncate">
              <span className="font-bold text-navy">{c.label}: </span>
              <span className="text-navy/70 truncate block">{c.value}</span>
            </div>
            <form action={async () => {
              if (window.confirm(`Remover ${c.label}?`)) await removeContact(c.id)
            }}>
              <button type="submit" className="text-red-500 opacity-60 hover:opacity-100 font-bold px-1">✕</button>
            </form>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-xs text-navy/40 italic">Nenhum item.</p>}
      </div>
    </div>
  )
}