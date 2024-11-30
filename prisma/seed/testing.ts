import { PrismaClient } from '@prisma/client'
import { getCarriers, seedCarriers } from './seed-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding test database...')
  
  // Use subset of 10 carriers for testing
  const testCarriers = getCarriers(10)
  await seedCarriers(prisma, testCarriers)
  
  console.log('Test seed completed')
}

main()
  .catch((e) => {
    console.error('Error seeding test database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
