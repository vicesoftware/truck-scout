# Local Database Testing Guide

## Workflow Scenarios

### Scenario 1: Apply Migrations
```bash
# When you want to apply new schema changes
npm run prisma:migrate:deploy
```

### Scenario 2: Complete Database Reset
```bash
# When you want a completely clean database
npm run prisma:db:reset
```

### Scenario 3: Seed Database
```bash
# Add development or test data
npm run prisma:seed:dev
```

### Scenario 4: Full Rebuild and Seed
```bash
# Stop and remove Docker container
docker compose -f docker-compose.test.local.yml down -v

# Restart, reset, and seed database
docker compose -f docker-compose.test.local.yml up -d
npm run prisma:db:reset
npm run prisma:seed:dev
```

## Seeding Strategies

### Seed Utilities
The project uses a flexible seeding approach with utility functions in `prisma/seed/seed-utils.ts`:

```typescript
// Seed Utility Functions
export interface CarrierSeed {
  name: string
  mcNumber: string | null
  dotNumber: string | null
  phone: string | null
  status: 'Active' | 'Pending'
  rating: number
}

export const carriers: CarrierSeed[]  // Full carrier dataset
export const getCarriers(count: number): CarrierSeed[]  // Slice carriers
export const seedCarriers(prisma, carriers): Promise<void>  // Individual carrier creation
```

### Seeding Approaches

#### 1. Full Database Seeding
```bash
# Seed entire development database
npm run prisma:seed:dev
```

#### 2. Partial Seeding
```typescript
// Example: Seed only first 10 carriers
const partialCarriers = getCarriers(10)
await seedCarriers(prisma, partialCarriers)
```

## Best Practices
- Use `prisma:migrate:deploy` for incremental changes
- Use `prisma:db:reset` when you need a complete fresh start
- Always seed after reset to ensure data availability
- Customize seed data for different environments
- Be cautious with reset as it destroys all data

## Seed Data Management
- Seed scripts use `seed-utils.ts` for shared data
- Allows easy modification of seed data
- Supports different environments (dev, test, etc.)
- Provides flexibility in data generation

## Troubleshooting
- Verify `.env` contains correct `DATABASE_URL`
- Ensure Docker database is running
- Check network connectivity
- Validate seed data in `seed-utils.ts`

## Performance Notes
- Individual carrier creation allows more control
- Slightly slower than bulk insert
- Provides better error tracking
- Enables more complex seeding logic
