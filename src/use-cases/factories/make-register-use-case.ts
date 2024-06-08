import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase(): RegisterUseCase {
  const repository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(repository)
  return registerUseCase
}
