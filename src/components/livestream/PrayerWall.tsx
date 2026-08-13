// src/components/livestream/PrayerWall.tsx
'use client'

import { useState, useTransition } from 'react'
import { submitLivePrayer } from '@/actions/prayers'

type PrayerItem = {
  id: string
  name: string
  message: string
  createdAt: Date
}

export function PrayerWall({ initialRequests }: { initialRequests: PrayerItem[] }) {
  const [requests] = useState<PrayerItem[]>(initialRequests)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Controle de transição assíncrona do React 18+
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !message.trim()) return

    startTransition(async () => {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('message', message)

      const result = await submitLivePrayer(fd)

      if (result.success) {
        setSent(true)
        setName('')
        setMessage('')
        
        // Remove a mensagem de sucesso após 5 segundos para permitir nova intenção
        setTimeout(() => setSent(false), 5000)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-navy flex items-center justify-between">
        <span>Pedidos de Oração</span>
        <span className="text-xs font-body font-normal text-navy/50">{requests.length} intenções</span>
      </h2>

      {/* Formulário de Envio */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-b border-line pb-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
          className="w-full rounded-lg border border-line px-3 py-2 text-xs focus:border-gold focus:outline-none disabled:opacity-60"
        />
        <textarea
          placeholder="Escreva sua intenção para esta missa..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
          disabled={isPending}
          className="w-full rounded-lg border border-line px-3 py-2 text-xs focus:border-gold focus:outline-none resize-none disabled:opacity-60"
        />
        {/* Toggle / Checkbox de Privacidade (Ligado por padrão) */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="shareOnWall"
            id="shareOnWall"
            defaultChecked={true}
            className="h-4 w-4 rounded border-line text-navy focus:ring-gold cursor-pointer"
          />
          <label htmlFor="shareOnWall" className="text-[11px] text-navy/70 cursor-pointer select-none">
            Permitir exibir meu pedido publicamente no mural da transmissão
          </label>
        </div>


        {/* Botão de Envio com estado de carregamento e feedback visual*/}

        <button
          type="submit"
          disabled={isPending || sent}
          className="w-full rounded-lg bg-navy py-2 font-body text-xs font-semibold uppercase tracking-wider text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enviando...' : 'Enviar Intenção'}
        </button>

        {error && (
          <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 text-center">
            {error}
          </p>
        )}

        {sent && (
          <p className="text-[11px] font-medium text-green-700 bg-green-50 p-2 rounded border border-green-200 text-center animate-[fadein_0.3s_ease]">
            Sua intenção foi enviada à equipe paroquial com sucesso!
          </p>
        )}
      </form>

      {/* Lista de Intenções Aprovadas do Mural */}
      <div className="mt-4 flex-1 space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {requests.map((item) => (
          <div key={item.id} className="rounded-xl border border-line/60 bg-cream/30 p-3 text-xs">
            <p className="font-bold text-navy">{item.name}</p>
            <p className="mt-1 text-navy/80 leading-relaxed">{item.message}</p>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="py-6 text-center text-xs text-navy/40">Seja o primeiro a enviar uma intenção de oração hoje.</p>
        )}
      </div>
    </div>
  )
}