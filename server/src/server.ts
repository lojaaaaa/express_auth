import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'

import { router } from './routes'

dotenv.config()

export const prisma = new PrismaClient()

const app = express()

async function main() {
	// Middleware для обработки JSON и cookies
	app.use(bodyParser.json())
	app.use(cookieParser())

	app.use(
		cors({
			origin: ['http://localhost:3000'],
			credentials: true,
			exposedHeaders: 'set-cookie'
		})
	)

	app.use('/api', router)

	app.all('*', (req: Request, res: Response) => {
		res.status(404).json({ error: `Route ${req.originalUrl} not found` })
	})

	const PORT = process.env.PORT || 4200
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`)
	})
}

// Подключение к Prisma
main()
	.then(async () => {
		await prisma.$connect()
		console.log('prisma connected')	
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
