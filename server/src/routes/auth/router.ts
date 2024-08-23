import { AuthController } from '@/controllers/authController'
import { Router } from 'express'

const router = Router()
const authController = new AuthController()

router.post(
	'/login',
  authController.login
)

router.post(
	'/register',
  authController.register
)

router.post(
  '/access-token',
  authController.refresh
)

router.post(
  '/logout',
  authController.logout 
)

export { router as authRouter }
