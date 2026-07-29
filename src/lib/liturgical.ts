// src/lib/liturgical.ts
//
// Calcula a "estação litúrgica" do dia. Prioridade:
//   1. Override manual cadastrado no banco (coordenador litúrgico)
//   2. Dia especial fixo (Festa da Padroeira, Finados)
//   3. Domingo especial móvel (Gaudete, Laetare)
//   4. Estação normal (Advento, Natal, Quaresma, etc.)
//
// Agora é async porque o passo 1 consulta o banco.

import { prisma } from '@/lib/prisma'

export type LiturgicalSeason = {
  name: string
  colorHex: string
  /** Só preenchido quando é um dia/domingo especial ou override manual */
  specialNote?: string
}

const COLORS = {
  purple: '#5b2a86',
  gold: '#d4a017',
  green: '#2f6b3a',
  red: '#a11d1d',
  rose: '#c9838f',
  blue: '#1e5f9c',
  black: '#2b2b2b',
} as const

const DAY_MS = 24 * 60 * 60 * 1000

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Algoritmo de Meeus/Jones/Butcher para a Páscoa (calendário gregoriano)
function computeEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) // 3 = março, 4 = abril
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function fourthAdventSunday(year: number) {
  const dec24 = new Date(year, 11, 24)
  return addDays(dec24, -dec24.getDay())
}

function firstAdventSunday(year: number) {
  return addDays(fourthAdventSunday(year), -21)
}

function computeBaseSeason(date: Date): LiturgicalSeason {
  const year = date.getFullYear()
  const easter = computeEaster(year)
  const ashWednesday = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const holyThursday = addDays(easter, -3)
  const pentecost = addDays(easter, 49)
  const adventStart = firstAdventSunday(year)
  const christmas = new Date(year, 11, 25)
  const endOfChristmasSeason = new Date(year, 0, 12) // Batismo do Senhor, aproximado

  if (date >= christmas || date <= endOfChristmasSeason) {
    return { name: 'Natal', colorHex: COLORS.gold }
  }
  if (date >= adventStart && date < christmas) {
    return { name: 'Advento', colorHex: COLORS.purple }
  }
  if (date >= holyThursday && date < easter) {
    return { name: 'Tríduo Pascal', colorHex: COLORS.red }
  }
  if (date >= palmSunday && date < holyThursday) {
    return { name: 'Semana Santa', colorHex: COLORS.purple }
  }
  if (date >= ashWednesday && date < palmSunday) {
    return { name: 'Quaresma', colorHex: COLORS.purple }
  }
  if (date >= easter && date <= pentecost) {
    return { name: 'Tempo Pascal', colorHex: COLORS.gold }
  }
  return { name: 'Tempo Comum', colorHex: COLORS.green }
}

function checkFixedSpecialDay(date: Date): LiturgicalSeason | null {
  const month = date.getMonth() // 0-indexado
  const day = date.getDate()

  if (month === 9 && day === 12) {
    return {
      name: 'Festa da Padroeira',
      colorHex: COLORS.blue,
      specialNote: 'Nossa Senhora Aparecida',
    }
  }

  if (month === 10 && day === 2) {
    return {
      name: 'Finados',
      colorHex: COLORS.black,
      specialNote: 'Comemoração dos Fiéis Defuntos',
    }
  }

  return null
}

function checkMovableSpecialDay(date: Date): LiturgicalSeason | null {
  const year = date.getFullYear()
  const easter = computeEaster(year)
  const ashWednesday = addDays(easter, -46)
  const adventStart = firstAdventSunday(year)

  const gaudete = addDays(adventStart, 14)
  if (isSameDay(date, gaudete)) {
    return { name: 'Domingo Gaudete', colorHex: COLORS.rose, specialNote: 'Alegrai-vos no Senhor' }
  }

  const firstSundayOfLent = addDays(ashWednesday, 4)
  const laetare = addDays(firstSundayOfLent, 21)
  if (isSameDay(date, laetare)) {
    return { name: 'Domingo Laetare', colorHex: COLORS.rose, specialNote: 'Alegra-te, Jerusalém' }
  }

  return null
}

async function checkManualOverride(date: Date): Promise<LiturgicalSeason | null> {
  const override = await prisma.liturgicalOverride.findFirst({
    where: { startDate: { lte: date }, endDate: { gte: date } },
    orderBy: { createdAt: 'desc' },
  })

  if (!override) return null

  return { name: override.label, colorHex: override.colorHex, specialNote: override.label }
}

export async function getLiturgicalSeason(date: Date = new Date()): Promise<LiturgicalSeason> {
  const override = await checkManualOverride(date)
  if (override) return override

  const fixedSpecial = checkFixedSpecialDay(date)
  if (fixedSpecial) return fixedSpecial

  const movableSpecial = checkMovableSpecialDay(date)
  if (movableSpecial) return movableSpecial

  return computeBaseSeason(date)
}