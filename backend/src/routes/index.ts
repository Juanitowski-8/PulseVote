import { Router } from 'express'
import authRoutes from './auth.routes'
import pollRoutes from './poll.routes'
import voteRoutes from './vote.routes'
import dashboardRoutes from './dashboard.routes'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pulsevote-api' })
})

router.use('/auth', authRoutes)
router.use('/polls', pollRoutes)
router.use('/polls', voteRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
