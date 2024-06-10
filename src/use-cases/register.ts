import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UserEmailAlreadyExistsError } from './errors/user-already-exists-error'
import { Role, User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  role: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserEmailAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role: role as Role,
    })

    return {
      user,
    }
  }
}
