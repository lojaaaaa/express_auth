import { UserService } from '@/services/user/user.service'
import { Request, Response } from 'express'

const userService = new UserService()

export class UserController {
	async getUserProfile(req: Request, res: Response) {
		const userId = req.user.id
		const user = await userService.getById(userId)
		res.json(user)
	}

	async getUsers(req: Request, res: Response) {
		const users = await userService.getUsers()
		res.json(users)
	}

	async getPremium (req: Request, res: Response) {
		res.json({ text: 'Premium content' })
	}

	async getManager(req: Request, res: Response) {
		res.json({ text: 'Manager content' })
	}
}

