// src/actions/catechism.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requirePermission } from '@/lib/permissions'
import { getTodayEligibleMasses } from '@/lib/catechism'

// ------- Auto atribuição (responsável/aluno logado) -------

export async function markAttendanceSelf(_prevState: unknown, formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      throw new Error('Você precisa estar logado.')
    }

    const studentId = formData.get('studentId') as string
    const scheduleId = formData.get('scheduleId') as string
    if (!studentId || !scheduleId) throw new Error('Selecione o aluno e a missa.')

    // Confirma que esse aluno pertence mesmo a quem está logado — nunca
    // confia no studentId vindo do form sem checar o dono.
    const student = await prisma.catechismStudent.findUnique({ where: { id: studentId } })
    if (!student || student.guardianEmail !== session.user.email) {
      throw new Error('Aluno não encontrado pra esse login.')
    }

    // Recalcula a janela no servidor — nunca confia no horário que o
    // navegador mandou, senão dá pra burlar mudando o relógio do celular.
    const massSchedules = await prisma.massSchedule.findMany({ orderBy: { order: 'asc' } })
    const eligible = getTodayEligibleMasses(massSchedules)
    const mass = eligible.find((m) => m.scheduleId === scheduleId && m.isOpenNow)

    if (!mass) {
      throw new Error('Essa missa não está mais com a presença liberada no momento.')
    }

    const already = await prisma.catechismAttendance.findFirst({
      where: { studentId, attendedAt: mass.attendedAt },
    })
    if (already) {
      throw new Error('Presença já registrada pra essa missa.')
    }

    await prisma.catechismAttendance.create({
      data: {
        studentId,
        massLabel: mass.label,
        attendedAt: mass.attendedAt,
        source: 'SELF',
        markedByUserId: session.user.id,
      },
    })

    revalidatePath('/catequese')
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao marcar presença.' }
  }
}

// ------- Portal do catequista -------

export async function createStudent(_prevState: unknown, formData: FormData) {
  try {
    await requirePermission('MANAGE_CATECHISM')

    const name = (formData.get('name') as string)?.trim()
    const className = (formData.get('className') as string)?.trim()
    const guardianEmail = (formData.get('guardianEmail') as string)?.trim().toLowerCase()

    if (!name || !className || !guardianEmail) {
      throw new Error('Preencha nome, turma e e-mail do responsável.')
    }

    await prisma.catechismStudent.create({ data: { name, className, guardianEmail } })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao cadastrar aluno.' }
  }
}

export async function toggleStudentActive(id: string, active: boolean) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechismStudent.update({ where: { id }, data: { active } })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar.' }
  }
}

// Marcação manual pelo catequista (ex: aluno sem celular, ou correção)
export async function markAttendanceManual(_prevState: unknown, formData: FormData) {
  try {
    const session = await requirePermission('MANAGE_CATECHISM')

    const studentId = formData.get('studentId') as string
    const massLabel = (formData.get('massLabel') as string)?.trim()
    const dateRaw = formData.get('date') as string
    const note = (formData.get('note') as string)?.trim() || null

    if (!studentId || !massLabel || !dateRaw) {
      throw new Error('Preencha aluno, missa e data.')
    }

    await prisma.catechismAttendance.create({
      data: {
        studentId,
        massLabel,
        attendedAt: new Date(dateRaw),
        source: 'MANUAL',
        markedByUserId: session.user.id,
        note,
      },
    })

    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao marcar presença.' }
  }
}

export async function removeAttendance(id: string) {
  try {
    await requirePermission('MANAGE_CATECHISM')
    await prisma.catechismAttendance.delete({ where: { id } })
    revalidatePath('/admin/catequese')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao remover.' }
  }
}