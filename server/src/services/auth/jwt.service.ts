import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export class JwtService {
	private readonly TOKEN_EXPIRATION_ACCESS = '1m'
	private readonly TOKEN_EXPIRATION_REFRESH = '7d'

	sign(payload: object, options?: jwt.SignOptions) {
		return jwt.sign(payload, JWT_SECRET, options)
	}

	verify(token: string, options?: jwt.VerifyOptions) {
		try {
			return jwt.verify(token, JWT_SECRET, options)
		} catch (e) {
			return null
		}
	}

	signAccessToken(payload: object) {
		const accessToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_ACCESS })
		return accessToken
	}

	signRefreshToken(payload: object) {
		const refreshToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_REFRESH })
		return refreshToken
	}
}
