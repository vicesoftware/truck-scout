# Database & Migrations

This document outlines our database migration strategy and implementation details using Prisma ORM.

## Overview

We use Prisma as our ORM and database migration tool, providing:
- Type-safe database queries
- Automated schema management
- Migration version control
- Comprehensive seeding functionality
- Rollback capabilities
- Testing framework

## Schema Management

```prisma
// prisma/schema.prisma
model Carrier {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  mcNumber  String?  @map("mc_number")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("carriers")
}
```

## Migration Best Practices

1. **Version Control**:
```bash
# Use descriptive names for migrations
npm run prisma:migrate:dev --name add_carrier_status_enum
```

2. **Rollback Strategy**:
```bash
# Add to package.json scripts
{
  "scripts": {
    "prisma:migrate:reset": "prisma migrate reset",
    "prisma:db:rollback": "prisma migrate reset --skip-seed",
    "prisma:migrate:status": "prisma migrate status"
  }
}
```

3. **Enhanced Data Seeding**:
```
prisma/seed/
├── development.ts   # Full dataset from init.sql
├── testing.ts      # Subset of carriers for tests
├── production.ts   # Core production carriers
└── seed-utils.ts   # Shared seeding utilities
```

4. **Schema Validation**:
```typescript
// src/lib/db/validateSchema.ts
import { z } from 'zod'

export const CarrierSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  mcNumber: z.string().optional()
})
```

5. **CI/CD Integration**:
```yaml
# .github/workflows/dev-ci-cd.yml
jobs:
  install-and-build:
    steps:
      - name: Deploy Database Migrations
        run: npm run prisma:migrate:deploy
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Seed Development Database
        run: npm run prisma:seed:dev
```

6. **Migration Testing**:
```typescript
// tests/migrations/migration.test.ts
describe('Migrations', () => {
  it('should successfully apply all migrations', async () => {
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations`
    expect(migrations).toBeDefined()
  })
})
```

## Migration Commands

```bash
# Development Migrations
npm run prisma:migrate:deploy     # Deploy database migrations
npm run prisma:migrate:rollback   # Rollback the most recent migration
npm run prisma:seed:dev           # Seed development database
npm run prisma:db:reset           # Completely reset database

# Detailed Script Descriptions
prisma:migrate:deploy
  - Executes migration deployment script
  - Uses 'scripts/deploy-migrations.sh'
  - Applies schema changes in production environment

prisma:migrate:rollback
  - Reverts the most recent database migration
  - Uses 'scripts/migration-rollback.sh'
  - Allows undoing the last schema change

prisma:seed:dev
  - Seeds development database with initial data
  - Uses seed script at 'prisma/seed/development.ts'
  - Populates database with development dataset

prisma:db:reset
  - Completely resets the database
  - Drops and recreates database
  - Applies all migrations
  - Runs seed scripts
  - WARNING: Use only in development
```

## CI/CD Workflow

Our current CI/CD workflow integrates database management directly into the main pipeline:

1. **Dependency Installation**
   - Install project dependencies
   - Prepare environment for database operations

2. **Database Preparation**
   - Run database migrations using `prisma:migrate:deploy`
   - Generate Prisma client to ensure type safety
   - Seed development database with initial data

3. **Build and Test**
   - Perform type checking
   - Run linting
   - Build application
   - Execute test suites (Jest and Cypress)

This approach ensures:
- Consistent database state across environments
- Type-safe database interactions
- Automated schema updates
- Predictable seeding process

## Implementation Status

### ✅ Completed
1. Install Prisma dependencies
2. Initialize Prisma schema based on existing carriers table
3. Create initial migration with descriptive name
4. Set up schema validation with Zod
5. Configure Prisma client instance
6. Configure seeding strategy
   - Create seed directory structure
   - Implement seed-utils with carrier data from init.sql
   - Create development seed file with full dataset
   - Create testing seed file with subset

### ✅ Completed
1. Update API routes to use Prisma client
   - Implement CRUD operations in /api/carriers route
   - Add transaction support for multi-step operations
   - Implement proper error handling with Prisma errors
   - Add input validation using existing Zod schemas
2. Complete seeding implementation
   - Create production seed file
   - Add npm scripts for environment-specific seeding
   - Add seed versioning for tracking data changes
3. Update tests to work with Prisma
   - Update carriers.test.ts to use Prisma client
   - Add database cleanup using Prisma
   - Add integration test suite for Prisma operations
   - Create mock Prisma client for unit tests
   - Add database transaction tests

### ✅ Completed
1. Database Reset and Seeding Improvements
   - Added `prisma:db:reset` npm script
   - Implemented duplicate prevention in seeding
   - Added unique constraints to prevent data duplication
   - Created robust database reset mechanism

## Todo and Future Improvements

### 📝 Prioritized Improvements

#### 1. CI/CD Migration Pipeline Strategy 🚧
- [x] Add migration dry-run in GitHub Actions
- [x] Implement automatic schema validation
- [x] Create deployment approval process for schema changes
- [x] Update GitHub workflow to include Prisma migration checks

#### 2. Production Migration Deployment 🚧
- [x] Create clear migration process for Digital Ocean
- [x] Document step-by-step migration workflow
- [x] Implement basic rollback mechanism script
- [x] Create deployment script for Prisma migrations
- [ ] Complete testing of migration scripts

#### 3. Seed Data Management
- [x] Implement duplicate prevention in seeding
- [ ] Implement versioning for seed data
- [ ] Add data integrity checks for seed scripts

### 📝 Additional Recommendations
1. Set up automated backup system
   - Configure scheduled backups using pg_dump
   - Implement backup rotation strategy
   - Add backup verification process
   - Create backup restoration documentation

## Environment Configuration
```bash
# Local development
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db"

# Digital Ocean environments
DATABASE_URL="postgresql://doadmin:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/defaultdb?sslmode=require"
```