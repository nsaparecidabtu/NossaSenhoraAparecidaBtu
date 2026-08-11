// src/actions/catechism/public-attendance.ts
'use server'

import { prisma } from '@/lib/prisma'
import { parseStage } from './helpers' // Funções utilitárias compartilhadas se necessário
import type { CatechismStage } from '@prisma/client'

const VALID_STAGES: CatechismStage[] = ['PRE', 'ETAPA_1', 'ETAPA_2', 'PERSEVERANCE', 'ADULT']

function validateStage(value: FormDataEntryValue | null | string): CatechismStage {
  const s = String(value ?? '').trim()
  if (!VALID_STAGES.includes(s as CatechismStage)) {
    throw new Error('Etapa inválida.')
  }
  return s as CatechismStage
}

async function requireOpenWeek(token: string) {
  const week = await prisma.catechismWeek.findUnique({ where: { token } })
  if (!week || !week.isOpen) {
    throw new Error('Este link não está mais disponível.')
  }
  return week
}

export async function searchStudents(token: string, query: string) {
  await requireOpenWeek(token)

  const q = query.trim()
  if (q.length < 2) return []

  const students = await prisma.catechismStudent.findMany({
    where: { active: true, name: { contains: q, mode: 'insensitive' } },
    include: { catechist: { select: { name: true } } },
    take: 8,
    orderBy: { name: 'asc' },
  })

  return students.map((s) => ({
    id: s.id,
    name: s.name,
    stage: s.stage,
    catechistName: s.catechist.name,
  }))
}

export async function quickRegisterStudent(
  token: string,
  data: { name: string; stage: string; catechistId: string }
) {
  await requireOpenWeek(token)

  const name = data.name.trim()
  const stage = validateStage(data.stage)
  const catechistId = data.catechistId

  if (!name || !catechistId) {
    throw new Error('Preencha nome, etapa e catequista.')
  }

  const catechist = await prisma.catechist.findUnique({ where: { id: catechistId } })
  if (!catechist || !catechist.stages.includes(stage)) {
    throw new Error('Catequista inválido pra essa etapa.')
  }

  const student = await prisma.catechismStudent.create({
    data: { name, stage, catechistId },
  })

  return {
    id: student.id,
    name: student.name,
    stage: student.stage,
    catechistName: catechist.name,
  }
}

export async function submitAttendance(token: string, studentId: string, massLabel: string) {
  const week = await requireOpenWeek(token)

  const student = await prisma.catechismStudent.findUnique({
    where: { id: studentId },
    include: { catechist: { select: { id: true, name: true } } },
  })
  if (!student || !student.active) {
    throw new Error('Catequizando não encontrado.')
  }

  await prisma.catechismAttendance.create({
    data: {
      studentId: student.id,
      studentName: student.name,
      weekId: week.id,
      massLabel,
      stage: student.stage,
      catechistId: student.catechist.id,
      catechistName: student.catechist.name,
      attendedAt: new Date(),
      source: 'SELF',
    },
  })

  return { success: true }
}