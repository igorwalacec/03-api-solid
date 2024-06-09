import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInsUseCase
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInsUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-id',
      description: 'gyms',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '123456',
      title: 'gym name',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 0, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 1, 1, 1, 0, 0))
    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 1, 2, 0, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: 'gyms',
      latitude: new Decimal(-140.0),
      longitude: new Decimal(-132.0),
      phone: '123456',
      title: 'gym name',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
