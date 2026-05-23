import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import { swaggerSpec } from './config/swagger'
import routes from './routes'
import { errorMiddleware } from './middlewares/error.middleware'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(morgan('dev'))
  app.use(express.json())

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'PulseVote API',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  )

  app.use('/api', routes)

  app.use(errorMiddleware)

  return app
}
