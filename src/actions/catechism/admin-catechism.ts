// src/actions/catechism/admin-catechism.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'
import { generateWeekToken } from '@/lib/catechism'
import type { CatechismStage } from '@prisma/client'

const VALID_STAGES: CatechismStage[] = ['PRE', 'ETAPA_1', 'ETAPA_2', 'PERSEVERANCE', 'ADULT']

function parseStage(value: FormDataEntryValue | null | string): CatechismStage {
  const s = String(value ?? '').trim()
  if (!VALID_STAGES.includes(s as CatechismStage)) {
    throw new Error('Etapa inválida.')
  }
  return s as CatechismStage
}

function parseStages(values: FormDataEntryValue[]): CatechismStage[] {
  const stages = values
    .map((v) => String(v).trim())
    .filter((s): s is CatechismStage => VALID_STAGES.includes(s as CatechismStage))

  if (stages.length === 0) {
    throw new Error('Selecione ao menos uma etapa.')
  }
  return stages
}

export async function createWeek(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_CATECHISM')

    const title = (formData.get('title') as string)?.trim()
    if (!title) throw new Error('Digite o título da semana.')

    await prisma.catechismWeek.updateMany({
      where: { isOpen: true },
      data: { isOpen: false, endsAt: new Date() },
    })

    const token = generateWeekToken()
    await prisma.catechismWeek.create({ data: { title, token } })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao criar semana.'
    return { success: false, error: message }
  }
}

export async function toggleWeekOpen(id: string, isOpen: boolean) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechismWeek.update({
      where: { id },
      data: { isOpen, endsAt: isOpen ? null : new Date() },
    })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar.'
    return { success: false, error: message }
  }
}

export async function createCatechist(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_CATECHISM')

    const name = (formData.get('name') as string)?.trim()
    const stages = parseStages(formData.getAll('stages'))

    if (!name) throw new Error('Digite o nome e selecione ao menos uma etapa.')

    await prisma.catechist.create({ data: { name, stages } })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao cadastrar catequista.'
    return { success: false, error: message }
  }
}

export async function toggleCatechistActive(id: string, active: boolean) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechist.update({ where: { id }, data: { active } })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar.'
    return { success: false, error: message }
  }
}

export async function createStudentAdmin(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_CATECHISM')

    const name = (formData.get('name') as string)?.trim()
    const stage = parseStage(formData.get('stage'))
    const catechistId = formData.get('catechistId') as string

    if (!name || !catechistId) {
      throw new Error('Preencha nome, etapa e catequista.')
    }

    await prisma.catechismStudent.create({ data: { name, stage, catechistId } })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao cadastrar catequizando.'
    return { success: false, error: message }
  }
}

export async function toggleStudentActive(id: string, active: boolean) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechismStudent.update({ where: { id }, data: { active } })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar.'
    return { success: false, error: message }
  }
}

export async function markAttendanceManual(_prevState: unknown, formData: FormData) {
  try {
    const session = await requirePermission('MANAGE_CATECHISM')

    const weekId = formData.get('weekId') as string
    const studentId = formData.get('studentId') as string
    const massLabel = (formData.get('massLabel') as string)?.trim()
    const note = (formData.get('note') as string)?.trim() || null

    if (!weekId || !studentId || !massLabel) {
      throw new Error('Preencha semana, catequizando e missa.')
    }

    const student = await prisma.catechismStudent.findUnique({
      where: { id: studentId },
      include: { catechist: { select: { id: true, name: true } } },
    })
    if (!student) throw new Error('Catequizando não encontrado.')

    await prisma.catechismAttendance.create({
      data: {
        studentId: student.id,
        studentName: student.name,
        weekId,
        massLabel,
        stage: student.stage,
        catechistId: student.catechist.id,
        catechistName: student.catechist.name,
        attendedAt: new Date(),
        source: 'MANUAL',
        markedByUserId: session.user.id,
        note,
      },
    })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao marcar presença.'
    return { success: false, error: message }
  }
}

export async function deleteAttendance(id: string) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechismAttendance.delete({ where: { id } })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao remover.'
    return { success: false, error: message }
  }
}

// Relatório integrado com escopo dinâmico
export async function getAttendancesReport(filters: { 
  weekId?: string; 
  catechistName?: string; 
  stage?: string; 
  viewAll?: boolean;
}) {
  try {
    const session = await auth()
    if (!session?.user) throw new Error('Não autenticado.')

    const isSuperAdmin = session.user.staffRole === 'SUPER_ADMIN'
    const hasGlobalPermission = session.user.permissions?.includes('MANAGE_CATECHISM')

    const whereClause: any = {}
    
    if (filters.weekId && filters.weekId !== 'all') {
      whereClause.weekId = filters.weekId
    }
    if (filters.stage && filters.stage !== 'all') {
      whereClause.stage = filters.stage
    }

    // Regra de escopo por perfil
    if (!isSuperAdmin && !hasGlobalPermission) {
      const catechistProfile = await prisma.catechist.findUnique({
        where: { userId: session.user.id }
      })

      if (!catechistProfile) {
        throw new Error('Perfil de catequista não vinculado ao seu usuário.')
      }

      if (!filters.viewAll) {
        whereClause.catechistId = catechistProfile.id
      }
    } else {
      if (filters.catechistName && filters.catechistName !== 'all') {
        whereClause.catechistName = filters.catechistName
      }
    }

    const data = await prisma.catechismAttendance.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        week: { select: { title: true } }
      }
    })

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao gerar relatório' }
  }
}