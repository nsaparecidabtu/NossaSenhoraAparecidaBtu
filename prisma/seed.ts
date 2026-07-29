// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.parishSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'Paróquia Nossa Senhora Aparecida',
      patronSaintName: 'Nossa Senhora Aparecida',
      heroTagline: 'Lar de fé, esperança e devoção',
    },
  })

  // ---- 1 exemplo de cada, pra visualizar o layout preenchido ----
  // TODO: apagar/substituir pelo conteúdo real assim que as telas de
  // admin estiverem em uso — tudo aqui é dado de demonstração.

  const scheduleCount = await prisma.massSchedule.count()
  if (scheduleCount === 0) {
    await prisma.massSchedule.createMany({
      data: [
        { label: 'Domingo', times: ['08h00', '10h00', '18h00'], order: 0 },
        { label: 'Segunda a Sexta', times: ['07h00', '19h00'], order: 1 },
        { label: 'Sábado', times: ['07h00', '19h00'], order: 2 },
        { label: 'Adoração ao Santíssimo', times: ['19h30 (quintas-feiras)'], order: 3 },
      ],
    })
  }

  const eventCount = await prisma.event.count()
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: '[EXEMPLO] Novena de Nossa Senhora Aparecida',
        description: 'Participe conosco deste tempo especial de oração e preparação.',
        eventDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        location: 'Igreja Matriz',
        imageUrl: 'https://picsum.photos/seed/novena/600/400',
      },
    })
  }

  const galleryCount = await prisma.galleryImage.count()
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        { imageUrl: 'https://picsum.photos/seed/igreja1/600/600', caption: '[EXEMPLO] Fachada da igreja', order: 0 },
        { imageUrl: 'https://picsum.photos/seed/igreja2/600/600', caption: '[EXEMPLO] Altar', order: 1 },
        { imageUrl: 'https://picsum.photos/seed/igreja3/600/600', caption: '[EXEMPLO] Comunidade reunida', order: 2 },
      ],
    })
  }

  const ministryCount = await prisma.ministry.count()
  if (ministryCount === 0) {
    await prisma.ministry.create({
      data: {
        name: 'Ministério da Acolhida',
        slug: 'acolhida',
        description: '[EXEMPLO] Recebe e acolhe os fiéis antes e depois das celebrações.',
        meetingSchedule: 'Reuniões às terças, 20h',
      },
    })
  }

  const faqCount = await prisma.faqItem.count()
  if (faqCount === 0) {
    await prisma.faqItem.create({
      data: {
        question: '[EXEMPLO] Como faço pra agendar um batizado?',
        answer: 'Use o formulário "Agendar Sacramento" na seção Fale Conosco, ou entre em contato pela secretaria.',
        order: 0,
      },
    })
  }

  const dailyWordCount = await prisma.dailyWord.count()
  if (dailyWordCount === 0) {
    await prisma.dailyWord.create({
      data: {
        date: new Date(),
        verseReference: '[EXEMPLO] João 2,5',
        text: 'Fazei tudo o que Ele vos disser.',
        reflection: 'Palavra de Nossa Senhora aos servos nas bodas de Caná.',
      },
    })
  }

  console.log('✅ Seed concluído (ParishSettings + 1 exemplo de cada modelo).')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })