// src/app/admin/pedidos/LivePrayersDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { togglePrayerWallApproval, archivePrayer } from '@/actions/prayers'

type Prayer = {
  id: string
  name: string
  message: string
  approvedForWall: boolean
  createdAt: Date
}

export function LivePrayersDashboard({ initialPrayers }: { initialPrayers: Prayer[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Auto-refresh inteligente (Polling a cada 15 segundos)
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

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
        <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          Novas Intenções ({initialPrayers.length})
        </h2>
        <p className="text-xs text-navy/40">Atualizando a cada 15s...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialPrayers.map((prayer) => (
          <div 
            key={prayer.id} 
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 ${
              prayer.approvedForWall ? 'border-gold bg-gold/5' : 'border-line/60 bg-cream/30'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-navy text-sm">{prayer.name}</p>
                <span className="text-[10px] font-mono text-navy/40">
                  {new Date(prayer.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                </span>
              </div>
              <p className="text-xs text-navy/80 leading-relaxed whitespace-pre-wrap">
                "{prayer.message}"
              </p>
            </div>

            <div className="mt-4 flex gap-2 border-t border-line/50 pt-3">
              <button
                disabled={loadingId === prayer.id}
                onClick={() => handleToggleWall(prayer.id, prayer.approvedForWall)}
                className={`flex-1 rounded py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                  prayer.approvedForWall 
                    ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'bg-navy text-cream hover:bg-gold hover:text-navy'
                }`}
              >
                {prayer.approvedForWall ? 'Tirar do Mural' : 'Aprovar p/ Mural'}
              </button>
              
              <button
                disabled={loadingId === prayer.id}
                onClick={() => handleArchive(prayer.id)}
                className="rounded border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-navy hover:bg-black/5 disabled:opacity-50"
                title="Arquivar após o padre ler"
              >
                Lido ✓
              </button>
            </div>
          </div>
        ))}

        {initialPrayers.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-sm text-navy/50">Nenhuma intenção nova nas últimas 24 horas.</p>
          </div>
        )}
      </div>
    </div>
  )
}