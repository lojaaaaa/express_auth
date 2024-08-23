import { AuthDto } from '@/dto/auth.dto'
import { AuthService } from '@/services/auth/auth.service'
import { RefreshTokenService } from '@/services/auth/refresh-token.service'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

const authService = new AuthService()
const refreshTokenService = new RefreshTokenService()

export class AuthController {
	async login(req: Request, res: Response) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const dto: AuthDto = req.body
		const { refreshToken, ...response } = await authService.login(dto)
		refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		res.status(200).json(response)
	}

	async register(req: Request, res: Response) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const dto: AuthDto = req.body
		const { refreshToken, ...response } = await authService.register(dto)
		refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		res.status(200).json(response)
	}

	async refresh (req: Request, res: Response) {
		const refreshTokenFromCookies =
			req.cookies[refreshTokenService.REFRESH_TOKEN_NAME]
	
		if (!refreshTokenFromCookies) {
			refreshTokenService.removeRefreshTokenFromResponse(res)
			return res.status(401).json({ message: 'Refresh token not passed' })
		}
	
		const { refreshToken, ...response } = await authService.getNewTokens(
			refreshTokenFromCookies
		)
		refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		res.status(200).json(response)
	}

	async logout(req: Request, res: Response) {
		refreshTokenService.removeRefreshTokenFromResponse(res)
		res.status(200).json(true)
	}
}
