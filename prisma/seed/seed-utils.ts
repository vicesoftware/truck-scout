import { PrismaClient } from '@prisma/client'

export interface CarrierSeed {
  name: string
  mcNumber: string | null
  dotNumber: string | null
  phone: string | null
  status: 'Active' | 'Pending'
  rating: number
}

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
  {
    name: 'ReliableRoad Ltd.',
    mcNumber: 'MC345678',
    dotNumber: 'DOT9012345',
    phone: '(555) 345-6789',
    status: 'Active',
    rating: 4.9
  },
  {
    name: 'QuickShip Logistics',
    mcNumber: 'MC456789',
    dotNumber: 'DOT1234567',
    phone: '(555) 456-7890',
    status: 'Active',
    rating: 4.7
  },
  {
    name: 'EcoFreight Systems',
    mcNumber: 'MC567890',
    dotNumber: 'DOT2345678',
    phone: '(555) 567-8901',
    status: 'Pending',
    rating: 4.2
  },
  {
    name: 'PrimeHaul Express',
    mcNumber: 'MC678901',
    dotNumber: 'DOT3456789',
    phone: '(555) 678-9012',
    status: 'Active',
    rating: 4.6
  },
  {
    name: 'GreenMile Logistics',
    mcNumber: 'MC789012',
    dotNumber: 'DOT4567890',
    phone: '(555) 789-0123',
    status: 'Pending',
    rating: 4.0
  },
  {
    name: 'SwiftLine Transport',
    mcNumber: 'MC890123',
    dotNumber: 'DOT5678901',
    phone: '(555) 890-1234',
    status: 'Active',
    rating: 4.3
  },
  {
    name: 'MegaMove Carriers',
    mcNumber: 'MC901234',
    dotNumber: 'DOT6789012',
    phone: '(555) 901-2345',
    status: 'Active',
    rating: 4.1
  },
  {
    name: 'TurboTruck Solutions',
    mcNumber: 'MC012345',
    dotNumber: 'DOT7890123',
    phone: '(555) 012-3456',
    status: 'Pending',
    rating: 3.9
  },
  {
    name: 'RapidRoute Shipping',
    mcNumber: 'MC123456',
    dotNumber: 'DOT8901234',
    phone: '(555) 123-4567',
    status: 'Active',
    rating: 4.4
  },
  {
    name: 'CrossCountry Movers',
    mcNumber: 'MC234567',
    dotNumber: 'DOT9012345',
    phone: '(555) 234-5678',
    status: 'Active',
    rating: 4.2
  },
  {
    name: 'PrecisionHaul Inc.',
    mcNumber: 'MC345678',
    dotNumber: 'DOT0123456',
    phone: '(555) 345-6789',
    status: 'Pending',
    rating: 3.8
  },
  {
    name: 'VelocityFreight Lines',
    mcNumber: 'MC456789',
    dotNumber: 'DOT1234567',
    phone: '(555) 456-7890',
    status: 'Active',
    rating: 4.5
  },
  {
    name: 'SureShip Logistics',
    mcNumber: 'MC567890',
    dotNumber: 'DOT2345678',
    phone: '(555) 567-8901',
    status: 'Active',
    rating: 4.7
  },
  {
    name: 'AlphaRoute Carriers',
    mcNumber: 'MC678901',
    dotNumber: 'DOT3456789',
    phone: '(555) 678-9012',
    status: 'Pending',
    rating: 3.6
  },
  {
    name: 'OmegaHaul Express',
    mcNumber: 'MC789012',
    dotNumber: 'DOT4567890',
    phone: '(555) 789-0123',
    status: 'Active',
    rating: 4.9
  },
  {
    name: 'DeltaFreight Systems',
    mcNumber: 'MC890123',
    dotNumber: 'DOT5678901',
    phone: '(555) 890-1234',
    status: 'Active',
    rating: 4.3
  },
  {
    name: 'BetaLine Transport',
    mcNumber: 'MC901234',
    dotNumber: 'DOT6789012',
    phone: '(555) 901-2345',
    status: 'Pending',
    rating: 3.7
  },
  {
    name: 'GammaShip Co.',
    mcNumber: 'MC012345',
    dotNumber: 'DOT7890123',
    phone: '(555) 012-3456',
    status: 'Active',
    rating: 4.1
  },
  {
    name: 'EpsilonMove Logistics',
    mcNumber: 'MC123456',
    dotNumber: 'DOT8901234',
    phone: '(555) 123-4567',
    status: 'Active',
    rating: 4.6
  },
  {
    name: 'ZetaHaul Solutions',
    mcNumber: 'MC234567',
    dotNumber: 'DOT9012345',
    phone: '(555) 234-5678',
    status: 'Pending',
    rating: 3.9
  },
  {
    name: 'EtaFreight Express',
    mcNumber: 'MC345678',
    dotNumber: 'DOT0123456',
    phone: '(555) 345-6789',
    status: 'Active',
    rating: 4.4
  },
  {
    name: 'ThetaShip Inc.',
    mcNumber: 'MC456789',
    dotNumber: 'DOT1234567',
    phone: '(555) 456-7890',
    status: 'Active',
    rating: 4.2
  },
  {
    name: 'IotaRoute Carriers',
    mcNumber: 'MC567890',
    dotNumber: 'DOT2345678',
    phone: '(555) 567-8901',
    status: 'Pending',
    rating: 3.8
  },
  {
    name: 'KappaHaul Co.',
    mcNumber: 'MC678901',
    dotNumber: 'DOT3456789',
    phone: '(555) 678-9012',
    status: 'Active',
    rating: 4.5
  },
  {
    name: 'LambdaFreight Lines',
    mcNumber: 'MC789012',
    dotNumber: 'DOT4567890',
    phone: '(555) 789-0123',
    status: 'Active',
    rating: 4.7
  },
  {
    name: 'MuShip Logistics',
    mcNumber: 'MC890123',
    dotNumber: 'DOT5678901',
    phone: '(555) 890-1234',
    status: 'Pending',
    rating: 3.6
  },
  {
    name: 'NuHaul Express',
    mcNumber: 'MC901234',
    dotNumber: 'DOT6789012',
    phone: '(555) 901-2345',
    status: 'Active',
    rating: 4.9
  },
  {
    name: 'XiRoute Systems',
    mcNumber: 'MC012345',
    dotNumber: 'DOT7890123',
    phone: '(555) 012-3456',
    status: 'Active',
    rating: 4.3
  },
  {
    name: 'OmicronMove Inc.',
    mcNumber: 'MC123456',
    dotNumber: 'DOT8901234',
    phone: '(555) 123-4567',
    status: 'Pending',
    rating: 3.7
  },
  {
    name: 'PiFreight Solutions',
    mcNumber: 'MC234567',
    dotNumber: 'DOT9012345',
    phone: '(555) 234-5678',
    status: 'Active',
    rating: 4.1
  },
  {
    name: 'RhoShip Transport',
    mcNumber: 'MC345678',
    dotNumber: 'DOT0123456',
    phone: '(555) 345-6789',
    status: 'Active',
    rating: 4.6
  },
  {
    name: 'SigmaHaul Co.',
    mcNumber: 'MC456789',
    dotNumber: 'DOT1234567',
    phone: '(555) 456-7890',
    status: 'Pending',
    rating: 3.9
  },
  {
    name: 'TauRoute Express',
    mcNumber: 'MC567890',
    dotNumber: 'DOT2345678',
    phone: '(555) 567-8901',
    status: 'Active',
    rating: 4.4
  },
  {
    name: 'UpsilonFreight Lines',
    mcNumber: 'MC678901',
    dotNumber: 'DOT3456789',
    phone: '(555) 678-9012',
    status: 'Active',
    rating: 4.2
  },
  {
    name: 'PhiShip Logistics',
    mcNumber: 'MC789012',
    dotNumber: 'DOT4567890',
    phone: '(555) 789-0123',
    status: 'Pending',
    rating: 3.8
  },
  {
    name: 'ChiHaul Solutions',
    mcNumber: 'MC890123',
    dotNumber: 'DOT5678901',
    phone: '(555) 890-1234',
    status: 'Active',
    rating: 4.5
  },
  {
    name: 'PsiMove Express',
    mcNumber: 'MC901234',
    dotNumber: 'DOT6789012',
    phone: '(555) 901-2345',
    status: 'Active',
    rating: 4.7
  },
  {
    name: 'OmegaRoute Systems',
    mcNumber: 'MC012345',
    dotNumber: 'DOT7890123',
    phone: '(555) 012-3456',
    status: 'Pending',
    rating: 3.6
  },
  {
    name: 'AlphaShip Co.',
    mcNumber: 'MC123456',
    dotNumber: 'DOT8901234',
    phone: '(555) 123-4567',
    status: 'Active',
    rating: 4.9
  },
  {
    name: 'BetaFreight Inc.',
    mcNumber: 'MC234567',
    dotNumber: 'DOT9012345',
    phone: '(555) 234-5678',
    status: 'Active',
    rating: 4.3
  },
  {
    name: 'GammaHaul Express',
    mcNumber: 'MC345678',
    dotNumber: 'DOT0123456',
    phone: '(555) 345-6789',
    status: 'Pending',
    rating: 3.7
  },
  {
    name: 'DeltaRoute Logistics',
    mcNumber: 'MC456789',
    dotNumber: 'DOT1234567',
    phone: '(555) 456-7890',
    status: 'Active',
    rating: 4.1
  },
  {
    name: 'EpsilonShip Transport',
    mcNumber: 'MC567890',
    dotNumber: 'DOT2345678',
    phone: '(555) 567-8901',
    status: 'Active',
    rating: 4.6
  },
  {
    name: 'ZetaFreight Lines',
    mcNumber: 'MC678901',
    dotNumber: 'DOT3456789',
    phone: '(555) 678-9012',
    status: 'Pending',
    rating: 3.9
  },
  {
    name: 'EtaHaul Solutions',
    mcNumber: 'MC789012',
    dotNumber: 'DOT4567890',
    phone: '(555) 789-0123',
    status: 'Active',
    rating: 4.4
  },
  {
    name: 'ThetaRoute Express',
    mcNumber: 'MC890123',
    dotNumber: 'DOT5678901',
    phone: '(555) 890-1234',
    status: 'Active',
    rating: 4.2
  },
  {
    name: 'IotaShip Co.',
    mcNumber: 'MC901234',
    dotNumber: 'DOT6789012',
    phone: '(555) 901-2345',
    status: 'Pending',
    rating: 3.8
  },
  {
    name: 'KappaFreight Systems',
    mcNumber: 'MC012345',
    dotNumber: 'DOT7890123',
    phone: '(555) 012-3456',
    status: 'Active',
    rating: 4.5
  }
]

export const getCarriers = (count: number): CarrierSeed[] => {
  return carriers.slice(0, count)
}

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
