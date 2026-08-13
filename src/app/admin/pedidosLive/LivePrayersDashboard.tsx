// src/app/admin/pedidosLive/LivePrayersDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { togglePrayerWallApproval, archivePrayer } from '@/actions/prayers'
import type { ContactRequestStatus } from '@prisma/client'

export type Prayer = {
  id: string
  name: string
  message: string
  contact: string
  approvedForWall: boolean
  status: ContactRequestStatus
  createdAt: string
}

export function LivePrayersDashboard({ initialPrayers }: { initialPrayers: Prayer[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'WALL' | 'PENDING'>('ALL')

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 15000)
    return () => clearInterval(interval)
  }, [router])

  const handleToggleWall = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    await togglePrayerWallApproval(id, currentStatus)
    setLoadingId(null)
  }

  const handleArchive = async (id: string) => {
    setLoadingId(id)
    await archivePrayer(id)
    setLoadingId(null)
  }

  const displayedPrayers = initialPrayers.filter((p) => {
    if (filter === 'WALL') return p.approvedForWall
    if (filter === 'PENDING') return p.status === 'PENDING' && !p.approvedForWall
    return p.status !== 'RESOLVED'
  })

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm font-body text-navy">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <h2 className="font-display text-lg font-bold text-navy">
            Intenções da Transmissão ({initialPrayers.length})
          </h2>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              filter === 'ALL' ? 'bg-navy text-cream' : 'bg-cream text-navy hover:bg-line/50'
            }`}
          >
            Todas ({initialPrayers.filter((p) => p.status !== 'RESOLVED').length})
          </button>
          <button
            onClick={() => setFilter('WALL')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              filter === 'WALL' ? 'bg-navy text-cream' : 'bg-cream text-navy hover:bg-line/50'
            }`}
          >
            No Mural ({initialPrayers.filter((p) => p.approvedForWall).length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPrayers.map((prayer) => (
          <div
            key={prayer.id}
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
              prayer.approvedForWall
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-line/60 bg-cream/20'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-navy text-sm">{prayer.name}</span>
                <span className="text-[10px] font-mono text-navy/40">
                  {new Date(prayer.createdAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-navy/80 leading-relaxed whitespace-pre-wrap">
                "{prayer.message}"
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-line/40 pt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-navy/50">Status no Mural:</span>
                <span
                  className={`font-semibold ${
                    prayer.approvedForWall ? 'text-green-700' : 'text-navy/40'
                  }`}
                >
                  {prayer.approvedForWall ? '● Visível no Mural' : '○ Oculto'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={loadingId === prayer.id}
                  onClick={() => handleToggleWall(prayer.id, prayer.approvedForWall)}
                  className={`flex-1 rounded py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                    prayer.approvedForWall
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-navy text-cream hover:bg-gold hover:text-navy'
                  }`}
                >
                  {prayer.approvedForWall ? 'Remover do Mural' : 'Publicar no Mural'}
                </button>

                <button
                  disabled={loadingId === prayer.id}
                  onClick={() => handleArchive(prayer.id)}
                  className="rounded border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-navy hover:bg-black/5 disabled:opacity-50"
                  title="Marcar como lida e arquivar"
                >
                  Lido ✓
                </button>
              </div>
            </div>
          </div>
        ))}

        {displayedPrayers.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-navy/40">
            Nenhuma intenção encontrada para este filtro.
          </div>
        )}
      </div>
    </div>
  )
}