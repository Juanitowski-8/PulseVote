import { Router } from 'express'
import { pollController } from '../controllers/poll.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { authorizeRoles } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import {
  createPollSchema,
  pollIdParamSchema,
  updatePollSchema,
} from '../schemas/poll.schema'

const router = Router()

router.use(authenticate)

router.get('/', pollController.list)
router.get('/:id/results', validate(pollIdParamSchema, 'params'), pollController.results)
router.get('/:id', validate(pollIdParamSchema, 'params'), pollController.getById)

router.post(
  '/',
  authorizeRoles('ADMIN'),
  validate(createPollSchema),
  pollController.create,
)

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(pollIdParamSchema, 'params'),
  validate(updatePollSchema),
  pollController.update,
)

router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(pollIdParamSchema, 'params'),
  pollController.remove,
)

export default router
