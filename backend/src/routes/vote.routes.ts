import { Router } from 'express'
import { voteController } from '../controllers/vote.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { authorizeRoles } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import { voteBodySchema, votePollParamSchema } from '../schemas/vote.schema'

const router = Router({ mergeParams: true })

router.post(
  '/:id/vote',
  authenticate,
  authorizeRoles('USER'),
  validate(votePollParamSchema, 'params'),
  validate(voteBodySchema),
  voteController.vote,
)

export default router
