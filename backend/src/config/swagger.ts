import { existsSync } from 'fs'
import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'PulseVote API',
    version: '1.0.0',
    description:
      'REST API for a real-time polling system with JWT authentication, role-based access control, voting and dashboard results.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and current user' },
    { name: 'Polls', description: 'Poll CRUD and results' },
    { name: 'Votes', description: 'Cast votes (USER)' },
    { name: 'Dashboard', description: 'Metrics and live results' },
    { name: 'Health', description: 'Service health' },
  ],
}

function resolveSwaggerDocFiles(): string[] {
  const base = path.join(__dirname, '../docs')
  return ['schemas.swagger', 'paths.swagger'].map((name) => {
    const jsPath = path.join(base, `${name}.js`)
    if (existsSync(jsPath)) return jsPath
    return path.join(base, `${name}.ts`)
  })
}

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: resolveSwaggerDocFiles(),
})
