import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env'
import routes from './routes'
import { errorMiddleware } from './middlewares/error.middleware'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  )
  app.use(morgan('dev'))
  app.use(express.json())

  app.use('/api', routes)

  app.use(errorMiddleware)

  return app
}
