import { AuthDto } from '@/dto/auth.dto'
import { PrismaClient, User } from '@prisma/client'
import { hash } from 'argon2'

export class UserService {
	private prisma = new PrismaClient()

	async getUsers() {
		const users = this.prisma.user.findMany({
			select: {
				name: true,
				email: true,
				id: true,
				password: false
			}
		})
		return users
	}

	async getById(id: string) {
		const user = this.prisma.user.findUnique({
			where: {
				id
			}
		})
		return user
	}

	async getByEmail(email: string) {
		const user = this.prisma.user.findUnique({
			where: {
				email
			}
		})
		return user
	}

	async create(dto: AuthDto) {
		const user = this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})
		return user
	}

	async update(id: string, data: Partial<User>) {
		const user = this.prisma.user.update({
			where: {
				id
			},
			data
		})
		return user
	}
}
