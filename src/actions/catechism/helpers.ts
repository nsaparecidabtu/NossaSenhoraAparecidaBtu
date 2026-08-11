// src/actions/catechism/helpers.ts
import type { CatechismStage } from '@prisma/client'

const VALID_STAGES: CatechismStage[] = ['PRE', 'ETAPA_1', 'ETAPA_2', 'PERSEVERANCE', 'ADULT']

export function parseStage(value: FormDataEntryValue | null | string): CatechismStage {
  const s = String(value ?? '').trim()
  if (!VALID_STAGES.includes(s as CatechismStage)) {
    throw new Error('Etapa inválida.')
  }
  return s as CatechismStage
}

export function parseStages(values: FormDataEntryValue[]): CatechismStage[] {
  const stages = values
    .map((v) => String(v).trim())
    .filter((s): s is CatechismStage => VALID_STAGES.includes(s as CatechismStage))

  if (stages.length === 0) {
    throw new Error('Selecione ao menos uma etapa.')
  }
  return stages
}