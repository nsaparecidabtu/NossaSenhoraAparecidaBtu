// src/lib/catechism.ts
import { randomBytes } from 'crypto'

export const STAGE_LABELS: Record<string, string> = {
  PRE: 'Pré Catequese',
  ETAPA_1: '1ª Etapa',
  ETAPA_2: '2ª Etapa',
}

export type MassOption = {
  label: string
  day: 'SAT' | 'SUN'
  hour: number
  minute: number
}

// "Missa Dominical" pra este projeto começa sábado ao meio-dia e termina
// depois da última missa de domingo — daí só ter opções de sábado à
// tarde/noite e domingo.
export const MASS_OPTIONS: MassOption[] = [
  { label: 'Sábado - 15h', day: 'SAT', hour: 15, minute: 0 },
  { label: 'Sábado - 19h', day: 'SAT', hour: 19, minute: 0 },
  { label: 'Domingo - 8h', day: 'SUN', hour: 8, minute: 0 },
  { label: 'Domingo - 9:30h', day: 'SUN', hour: 9, minute: 30 },
  { label: 'Domingo - 17h', day: 'SUN', hour: 17, minute: 0 },
  { label: 'Domingo - 19h', day: 'SUN', hour: 19, minute: 0 },
]

// Sugere a missa mais próxima do horário atual (a que a pessoa
// provavelmente acabou de participar), pra perguntar direto sem ela
// precisar escolher numa lista.
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
  return randomBytes(6).toString('hex') // 12 caracteres, único por semana
}