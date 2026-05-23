import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'

const app = createApp()

const server = app.listen(env.PORT, () => {
  console.log(`🚀 PulseVote API en http://localhost:${env.PORT}`)
  console.log(`   Health: http://localhost:${env.PORT}/api/health`)
})

async function shutdown() {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
