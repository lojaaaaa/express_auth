import { UserController } from '@/controllers/userController'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { Role } from '@prisma/client'
import { Router } from 'express'

const router = Router()
const userController = new UserController()

router.get(
  '/profile', 
  authenticate, 
  userController.getUserProfile
)

router.get(
  '/premium', 
  authenticate, 
  authorize([Role.PREMIUM]), 
  userController.getPremium
)

router.get(
  '/manager', 
  authenticate, 
  authorize([Role.ADMIN, Role.MANAGER]), 
  userController.getManager
)

router.get(
  '/list', 
  authenticate, 
  authorize([Role.ADMIN]), 
  userController.getUsers
)

export { router as userRouter }