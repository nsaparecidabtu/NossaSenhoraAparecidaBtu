// src/lib/catechism.ts
import { randomBytes } from 'crypto'
import type { CatechismStage } from '@prisma/client'

export const STAGE_LABELS: Record<CatechismStage | 'PERSEVERANCE' | 'ADULT', string> = {
  PRE: 'Pré Catequese',
  ETAPA_1: '1ª Etapa',
  ETAPA_2: '2ª Etapa',
  PERSEVERANCE: 'Perseverança / Crisma',
  ADULT: 'Catequese de Adultos',
}

export type MassOption = {
  label: string
  day: 'SAT' | 'SUN'
  hour: number
  minute: number
}

// Missa Dominical: começa sábado ao meio-dia e termina após a última missa de domingo
export const MASS_OPTIONS: MassOption[] = [
  { label: 'Sábado - 15h', day: 'SAT', hour: 15, minute: 0 },
  { label: 'Sábado - 19h', day: 'SAT', hour: 19, minute: 0 },
  { label: 'Domingo - 8h', day: 'SUN', hour: 8, minute: 0 },
  { label: 'Domingo - 9:30h', day: 'SUN', hour: 9, minute: 30 },
  { label: 'Domingo - 17h', day: 'SUN', hour: 17, minute: 0 },
  { label: 'Domingo - 19h', day: 'SUN', hour: 19, minute: 0 },
]

// Sugere a missa mais próxima do horário atual (para o check-in fluido)
export function suggestMass(now: Date = new Date()): MassOption {
  let best = MASS_OPTIONS[0]
  let bestDiff = Infinity

  for (const option of MASS_OPTIONS) {
    const candidate = new Date(now)
    const dow = now.getDay() // 0=domingo, 6=sábado
    const targetDow = option.day === 'SAT' ? 6 : 0
    const dayDiff = targetDow - dow
    candidate.setDate(now.getDate() + dayDiff)
    candidate.setHours(option.hour, option.minute, 0, 0)

    const diff = Math.abs(now.getTime() - candidate.getTime())
    if (diff < bestDiff) {
      bestDiff = diff
      best = option
    }
  }

  return best
}

export function generateWeekToken(): string {
  return randomBytes(6).toString('hex') // 12 caracteres hexadecimais, único por semana
}