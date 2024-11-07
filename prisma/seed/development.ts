import { PrismaClient } from '@prisma/client'
import { carriers, seedCarriers } from './seed-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding development database...')
  
  // Use full dataset for development
  await seedCarriers(prisma, carriers)
  
  console.log('Development seed completed')
}

main()
  .catch((e) => {
    console.error('Error seeding development database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
