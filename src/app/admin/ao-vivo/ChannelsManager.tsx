// src/app/admin/ao-vivo/ChannelsManager.tsx
'use client'

import { useActionState, useState } from 'react'
import {
  createYoutubeChannel,
  toggleChannelStatus,
  setPrimaryChannel,
  deleteYoutubeChannel,
  type ChannelActionState,
} from '@/actions/youtubeChannels'
import type { YoutubeChannel } from '@prisma/client'

export function ChannelsManager({ channels }: { channels: YoutubeChannel[] }) {
  const [state, formAction, pending] = useActionState<ChannelActionState, FormData>(
    createYoutubeChannel,
    { success: false }
  )
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggle = async (id: string, status: boolean) => {
    setLoadingId(id)
    await toggleChannelStatus(id, status)
    setLoadingId(null)
  }

  const handlePrimary = async (id: string) => {
    setLoadingId(id)
    await setPrimaryChannel(id)
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este canal?')) {
      setLoadingId(id)
      await deleteYoutubeChannel(id)
      setLoadingId(null)
    }
  }

  return (
    <div className="mt-4 space-y-6">
      
      {/* Formulário de Adicionar Canal */}
      <form action={formAction} className="rounded-xl border border-line bg-cream/40 p-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">
          Adicionar Novo Canal do YouTube
        </label>
        <p className="text-xs text-navy/50 mt-0.5 mb-2">
          Cole a URL do canal (ex: <code className="bg-white px-1 py-0.5 rounded border border-line">https://www.youtube.com/@paroquiaaparecidabotucatu</code>) ou o handle @.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            name="channelUrl"
            type="text"
            required
            placeholder="https://www.youtube.com/@seu-canal"
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none bg-white"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-navy px-5 py-2 text-xs font-bold uppercase tracking-wider text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
          >
            {pending ? 'Buscando...' : 'Adicionar Canal'}
          </button>
        </div>
        {state.error && (
          <p className="mt-2 rounded bg-red-50 p-2 text-xs text-red-600 border border-red-200">
            {state.error}
          </p>
        )}
      </form>

      {/* Lista de Canais Cadastrados */}
      <div className="space-y-3">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
              ch.isPrimary
                ? 'border-gold/60 bg-gold/5 shadow-sm'
                : ch.isActive
                ? 'border-line bg-white'
                : 'border-line/40 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              {ch.avatarUrl ? (
                <img
                  src={ch.avatarUrl}
                  alt={ch.name}
                  className="h-12 w-12 rounded-full border border-line object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-cream font-bold">
                  YT
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-navy">{ch.name}</h3>
                  {ch.isPrimary && (
                    <span className="rounded bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-navy">
                      Principal
                    </span>
                  )}
                  {!ch.isActive && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase text-navy/60">
                      Suspenso
                    </span>
                  )}
                </div>
                <p className="text-xs text-navy/60">{ch.handle || ch.channelId}</p>
                {ch.subscriberCount && (
                  <p className="text-[11px] text-navy/40 mt-0.5">
                    {Number(ch.subscriberCount).toLocaleString('pt-BR')} inscritos no YouTube
                  </p>
                )}
              </div>
            </div>

            {/* Ações Granulares */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60 justify-end">
              {!ch.isPrimary && (
                <button
                  type="button"
                  disabled={loadingId === ch.id}
                  onClick={() => handlePrimary(ch.id)}
                  className="rounded border border-line px-2.5 py-1 text-[11px] font-semibold text-navy hover:bg-gold hover:text-navy transition-colors"
                >
                  Tornar Principal
                </button>
              )}

              <button
                type="button"
                disabled={loadingId === ch.id}
                onClick={() => handleToggle(ch.id, ch.isActive)}
                className={`rounded border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  ch.isActive
                    ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
                }`}
              >
                {ch.isActive ? 'Suspender' : 'Ativar'}
              </button>

              <button
                type="button"
                disabled={loadingId === ch.id}
                onClick={() => handleDelete(ch.id)}
                className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {channels.length === 0 && (
          <p className="py-6 text-center text-xs text-navy/40">
            Nenhum canal do YouTube cadastrado ainda. Use o campo acima para adicionar o canal da paróquia.
          </p>
        )}
      </div>

    </div>
  )
}