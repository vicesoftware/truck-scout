import { PrismaClient } from '@prisma/client'

export interface CarrierSeed {
  name: string
  mcNumber: string | null
  dotNumber: string | null
  phone: string | null
  status: 'Active' | 'Pending'
  rating: number
}

// Parse carriers from init.sql data
export const carriers: CarrierSeed[] = [
  {
    name: 'FastTruck Inc.',
    mcNumber: 'MC123456',
    dotNumber: 'DOT7890123',
    phone: '(555) 123-4567',
    status: 'Active',
    rating: 4.8
  },
  {
    name: 'SpeedyHaul Co.',
    mcNumber: 'MC234567',
    dotNumber: 'DOT8901234',
    phone: '(555) 234-5678',
    status: 'Pending',
    rating: 4.5
  },
  // ... rest of carriers from init.sql
]

// Utility function to get a subset of carriers
export const getCarriers = (count: number): CarrierSeed[] => {
  return carriers.slice(0, count)
}

// Utility function to seed carriers
export const seedCarriers = async (
  prisma: PrismaClient,
  carriers: CarrierSeed[]
): Promise<void> => {
  for (const carrier of carriers) {
    await prisma.carrier.create({
      data: carrier
    })
  }
}
