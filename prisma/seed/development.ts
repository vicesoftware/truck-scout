import { PrismaClient } from '@prisma/client'
import { carriers } from './seed-utils.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding development database...')
  
  // Use createMany to handle potential duplicates
  await prisma.carrier.createMany({
    data: carriers,
    skipDuplicates: true
  })
  
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
