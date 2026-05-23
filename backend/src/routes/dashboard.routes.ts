import { Router } from 'express'
import { dashboardController } from '../controllers/dashboard.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { authorizeRoles } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import { pollIdParamSchema } from '../schemas/poll.schema'

const router = Router()

router.use(authenticate, authorizeRoles('ADMIN', 'USER'))

router.get('/summary', dashboardController.summary)
router.get(
  '/polls/:id/results',
  validate(pollIdParamSchema, 'params'),
  dashboardController.pollResults,
)

export default router
