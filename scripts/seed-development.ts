import { PrismaClient } from '@prisma/client'
import { carriers, seedCarriers } from '../prisma/seed/seed-utils.js'

async function seedDatabase() {
  const prisma = new PrismaClient()

  try {
    console.log('Seeding development database...')
    
    await seedCarriers(prisma, carriers)
    
    console.log('Development seed completed')
  } catch (error) {
    console.error('Error seeding development database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
