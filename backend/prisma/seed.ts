import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de PulseVote...')

  await prisma.vote.deleteMany()
  await prisma.pollOption.deleteMany()
  await prisma.poll.deleteMany()
  await prisma.user.deleteMany()

  const adminHash = await hashPassword('Admin123!')
  const userHash = await hashPassword('User123!')

  const admin = await prisma.user.create({
    data: {
      name: 'Admin PulseVote',
      email: 'admin@pulsevote.app',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  })

  const user = await prisma.user.create({
    data: {
      name: 'User PulseVote',
      email: 'user@pulsevote.app',
      passwordHash: userHash,
      role: Role.USER,
    },
  })

  const poll1 = await prisma.poll.create({
    data: {
      question: '¿Qué stack prefieres para un MVP en 24 horas?',
      description: 'Encuesta de ejemplo para pruebas técnicas',
      isActive: true,
      createdById: admin.id,
      options: {
        create: [
          { text: 'Node + React + PostgreSQL' },
          { text: 'Django + Vue + MySQL' },
          { text: 'Laravel + Inertia' },
          { text: 'Firebase + Next.js' },
        ],
      },
    },
    include: { options: true },
  })

  const poll2 = await prisma.poll.create({
    data: {
      question: '¿Cuál es tu prioridad al diseñar una API REST?',
      isActive: true,
      createdById: admin.id,
      options: {
        create: [
          { text: 'Consistencia y validaciones' },
          { text: 'Documentación OpenAPI' },
          { text: 'Performance extrema' },
        ],
      },
    },
    include: { options: true },
  })

  const poll3 = await prisma.poll.create({
    data: {
      question: '¿Cómo prefieres actualizar resultados en tiempo real?',
      isActive: true,
      createdById: admin.id,
      options: {
        create: [
          { text: 'Polling cada 3s' },
          { text: 'WebSockets' },
          { text: 'Server-Sent Events' },
        ],
      },
    },
    include: { options: true },
  })

  await prisma.poll.create({
    data: {
      question: 'Encuesta archivada: ¿Trabajas remoto o híbrido?',
      isActive: false,
      createdById: admin.id,
      options: {
        create: [
          { text: '100% remoto' },
          { text: 'Híbrido' },
          { text: 'Presencial' },
        ],
      },
    },
  })

  // Votos de ejemplo para el dashboard
  const sampleVotes = [
    { poll: poll1, optionIndex: 0, count: 8 },
    { poll: poll1, optionIndex: 1, count: 3 },
    { poll: poll2, optionIndex: 0, count: 5 },
    { poll: poll3, optionIndex: 0, count: 4 },
  ]

  for (const { poll, optionIndex, count } of sampleVotes) {
    const option = poll.options[optionIndex]
    for (let i = 0; i < count; i++) {
      const voter = await prisma.user.create({
        data: {
          name: `Voter ${poll.id}-${i}`,
          email: `voter_${poll.id}_${optionIndex}_${i}@pulsevote.test`,
          passwordHash: userHash,
          role: Role.USER,
        },
      })
      await prisma.vote.create({
        data: {
          userId: voter.id,
          pollId: poll.id,
          optionId: option.id,
        },
      })
    }
  }

  // Un voto del usuario demo en la primera encuesta
  await prisma.vote.create({
    data: {
      userId: user.id,
      pollId: poll1.id,
      optionId: poll1.options[0].id,
    },
  })

  console.log('✅ Seed completado')
  console.log('   Admin: admin@pulsevote.app / Admin123!')
  console.log('   User:  user@pulsevote.app / User123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
