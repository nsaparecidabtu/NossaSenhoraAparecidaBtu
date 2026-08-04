// src/lib/catechism.ts
//
// Decide quais missas de hoje estão "abertas" pra auto atribuição de
// presença da catequese, e em qual janela de horário cada uma libera.
// Heurística por rótulo (mesma lógica do ícone dos cards de Horários) —
// se a paróquia usar rótulos muito diferentes de "Domingo"/"Sábado"/
// "Segunda a Sexta", isso precisa evoluir pra um campo estruturado.

type MassSchedule = { id: string; label: string; times: string[] }

export type EligibleMass = {
  scheduleId: string
  label: string
  time: string // "08h00"
  attendedAt: Date
  windowOpensAt: Date
  windowClosesAt: Date
  isOpenNow: boolean
}

function scheduleAppliesToday(label: string, weekday: number): boolean {
  const l = label.toLowerCase()
  if (l.includes('adora')) return false // adoração não é missa
  if (l.includes('domingo')) return weekday === 0
  if (l.includes('sábado') || l.includes('sabado')) return weekday === 6
  if (l.includes('segunda') && l.includes('sexta')) return weekday >= 1 && weekday <= 5
  return false // rótulo não reconhecido — não conta pra presença automática
}

function parseTimeToDate(time: string, base: Date): Date | null {
  // aceita "08h00", "08:00", "8h"
  const match = time.match(/(\d{1,2})[h:](\d{0,2})/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = match[2] ? Number(match[2]) : 0
  const d = new Date(base)
  d.setHours(hours, minutes, 0, 0)
  return d
}

const WINDOW_BEFORE_MIN = 15
const WINDOW_AFTER_MIN = 120

export function getTodayEligibleMasses(massSchedules: MassSchedule[]): EligibleMass[] {
  const now = new Date()
  const weekday = now.getDay()

  const result: EligibleMass[] = []

  for (const schedule of massSchedules) {
    if (!scheduleAppliesToday(schedule.label, weekday)) continue

    for (const time of schedule.times) {
      const attendedAt = parseTimeToDate(time, now)
      if (!attendedAt) continue

      const windowOpensAt = new Date(attendedAt.getTime() - WINDOW_BEFORE_MIN * 60_000)
      const windowClosesAt = new Date(attendedAt.getTime() + WINDOW_AFTER_MIN * 60_000)

      result.push({
        scheduleId: schedule.id,
        label: `${schedule.label} ${time}`,
        time,
        attendedAt,
        windowOpensAt,
        windowClosesAt,
        isOpenNow: now >= windowOpensAt && now <= windowClosesAt,
      })
    }
  }

  return result.sort((a, b) => a.attendedAt.getTime() - b.attendedAt.getTime())
}

// Chave de semana (ano-semana ISO) — usada só pro relatório do catequista
// agrupar "quem já marcou presença essa semana"
export function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}