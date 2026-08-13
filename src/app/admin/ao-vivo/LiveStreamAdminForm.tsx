// src/app/admin/ao-vivo/LiveStreamAdminForm.tsx
'use client'

import { useActionState, useState } from 'react'
import { updateLiveStreamSettings, type LiveStreamActionState } from '@/actions/livestream'
import type { LiveStreamSettings } from '@prisma/client'

export function LiveStreamAdminForm({ settings }: { settings: LiveStreamSettings | null }) {
  const [isLiveNow, setIsLiveNow] = useState<boolean>(settings?.isLiveNow ?? false)
  const [state, formAction, pending] = useActionState<LiveStreamActionState, FormData>(
    updateLiveStreamSettings,
    { success: false }
  )

  return (
    <form action={formAction} className="space-y-6 font-body">
      <input type="hidden" name="isLiveNow" value={isLiveNow ? 'true' : 'false'} />

      {/* Switch Toggle do Status Ao Vivo */}
      <div className="flex items-center justify-between rounded-xl border border-line bg-cream/30 p-4">
        <div>
          <p className="font-bold text-sm text-navy">Status da Transmissão</p>
          <p className="text-xs text-navy/60">Ative para exibir o player em destaque no site.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsLiveNow(!isLiveNow)}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isLiveNow ? 'bg-red-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isLiveNow ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* URL ou Video ID do YouTube */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">
          Link da Live do YouTube
        </label>
        <input
          name="youtubeUrl"
          type="text"
          placeholder="https://www.youtube.com/watch?v=ExemploID"
          defaultValue={settings?.youtubeVideoId ? `https://www.youtube.com/watch?v=${settings.youtubeVideoId}` : ''}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <p className="mt-1 text-xs text-navy/50">
          Cole a URL completa do vídeo ou live gerada no YouTube Studio.
        </p>
      </div>

      {/* ID do Canal para carrossel gravado */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy/60">
          ID do Canal no YouTube (Opcional)
        </label>
        <input
          name="youtubeChannelId"
          type="text"
          placeholder="UC..."
          defaultValue={settings?.youtubeChannelId ?? ''}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-navy py-3 font-body text-xs font-bold uppercase tracking-wider text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
      >
        {pending ? 'Atualizando...' : 'Salvar Alterações'}
      </button>

      {state.error && (
        <p className="rounded bg-red-50 p-2.5 text-xs font-medium text-red-600 border border-red-200">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded bg-green-50 p-2.5 text-xs font-medium text-green-700 border border-green-200">
          Configurações da live salvas com sucesso!
        </p>
      )}
    </form>
  )
}