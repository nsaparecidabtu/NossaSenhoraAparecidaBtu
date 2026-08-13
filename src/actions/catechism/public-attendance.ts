// src/actions/catechism/public-attendance.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { CatechismStage } from '@prisma/client'

/**
 * 1. Busca alunos em tempo real no formulário público
 */
export async function searchStudents(query: string) {
  if (!query || query.trim().length < 2) return []

  const terms = query.trim().split(/\s+/)
  const conditions = terms.map((term) => ({
    name: { contains: term, mode: 'insensitive' as const },
  }))

  const students = await prisma.catechismStudent.findMany({
    where: {
      active: true,
      AND: conditions,
    },
    include: {
      catechist: { select: { name: true } },
    },
    take: 10,
    orderBy: { name: 'asc' },
  })

  // Mapeamos para o formato que o Client espera
  return students.map((s) => ({
    id: s.id,
    name: s.name,
    stage: s.stage,
    catechistId: s.catechistId,
    catechistName: s.catechist?.name ?? 'Sem catequista',
  }))
}

/**
 * 2. Cadastro rápido de aluno na porta da igreja
 */
export async function quickRegisterStudent(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const catechistId = formData.get('catechistId') as string
    const stage = formData.get('stage') as CatechismStage

    if (!name || !catechistId || !stage) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' }
    }

    const newStudent = await prisma.catechismStudent.create({
      data: {
        name: name.trim(),
        catechistId,
        stage,
        active: true,
      },
    })

    return { success: true, student: newStudent }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao registrar aluno.' }
  }
}

/**
 * 3. Registro de Presença (Otimizado sem campos legados)
 */
export async function submitAttendance(prevState: any, formData: FormData) {
  try {
    const weekId = formData.get('weekId') as string
    const studentId = formData.get('studentId') as string
    const massLabel = formData.get('massLabel') as string
    const note = (formData.get('note') as string) || null

    if (!weekId || !studentId || !massLabel) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' }
    }

    const student = await prisma.catechismStudent.findUnique({
      where: { id: studentId },
      select: { id: true, catechistId: true, active: true },
    })

    if (!student || !student.active) {
      return { success: false, error: 'Aluno não encontrado ou inativo.' }
    }

    // Validação de segurança extra contra presenças duplicadas
    const existing = await prisma.catechismAttendance.findFirst({
      where: { weekId, studentId },
    })

    if (existing) {
      return { success: false, error: 'Presença já confirmada para esta semana.' }
    }

    // Inserção normalizada (Note que 'stage' e 'studentName' não estão aqui)
    await prisma.catechismAttendance.create({
      data: {
        weekId,
        studentId: student.id,
        catechistId: student.catechistId,
        massLabel,
        attendedAt: new Date(),
        source: 'SELF',
        note,
      },
    })

    revalidatePath('/catequese')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao registrar presença.' }
  }
}