import { PrismaClient } from '@prisma/client'
import { carriers } from './seed-utils.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding development database...')
  
  // Use individual create to handle potential unique constraints
  for (const carrier of carriers) {
    try {
      console.log('Attempting to create carrier:', JSON.stringify(carrier, null, 2))
      
      const createdCarrier = await prisma.carrier.create({
        data: carrier
      })
      
      console.log('Created carrier successfully:', JSON.stringify(createdCarrier, null, 2))
    } catch (error) {
      console.error('Error creating carrier:', error)
      
      // Log additional details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        
        // If it's a Prisma error, log additional context
        if ('code' in error) {
          console.error('Prisma error code:', (error as any).code)
        }
      }
      
      // Rethrow to stop the seeding process
      throw error
    }
  }
  
  console.log('Development seed completed')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
