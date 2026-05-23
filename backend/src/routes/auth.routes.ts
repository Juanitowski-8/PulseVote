import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { loginSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/login', validate(loginSchema), authController.login)
router.get('/me', authenticate, authController.me)

export default router
