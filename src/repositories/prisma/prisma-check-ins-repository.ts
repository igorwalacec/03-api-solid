import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: new Date(date.toDateString()),
          lt: new Date(
            new Date(date.toDateString()).setDate(date.getDate() + 1),
          ),
        },
      },
    })

    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const user = await prisma.checkIn.create({
      data: {
        gym_id: data.gym_id,
        user_id: data.user_id,
      },
    })

    return user
  }
}
