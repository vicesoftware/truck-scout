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

### 📝 Todo (Prioritized and Expanded)
1. Set up automated backup system
   - Configure scheduled backups using pg_dump
   - Implement backup rotation strategy
   - Add backup verification process
   - Create backup restoration documentation

2. Configure CI/CD pipeline for migrations
   - Add migration dry-run in CI
   - Implement automatic schema validation
   - Add migration status checks
   - Create deployment approval process

3. Test deployment process
   - Create staging environment
   - Add migration smoke tests
   - Implement rollback verification
   - Document deployment checklist

4. Apply migrations to production environment
   - Create production deployment strategy
   - Document rollback procedures
   - Add monitoring for migration performance
   - Implement alerting for migration failures

5. Additional Recommendations
   - Add database performance monitoring
   - Implement query optimization strategies
   - Create database scaling documentation
   - Add audit logging for schema changes
   - Implement connection pooling
   - Add database health checks

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
# .github/workflows/database.yml
name: Database Migrations
on:
  push:
    branches: [main]
    paths:
      - 'prisma/**'
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run migrations
        run: |
          npm run prisma:migrate:deploy
          npm run prisma:generate
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
# Development
npm run prisma:migrate:dev    # Create and apply migrations locally
npm run prisma:generate       # Generate Prisma Client
npm run prisma:seed          # Seed database
npm run prisma:migrate:reset # Reset database to clean state
npm run prisma:db:rollback   # Rollback without running seeds
npm run prisma:migrate:status # Check migration status

# Production
npm run prisma:migrate:deploy # Deploy migrations to production
npm run db:backup           # Create database backup
```

## Environment Configuration
```bash
# Local development
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db"

# Digital Ocean environments
DATABASE_URL="postgresql://doadmin:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/defaultdb?sslmode=require"
