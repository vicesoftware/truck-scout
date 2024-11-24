# Database & Migrations <!-- omit in toc -->
This document outlines our database migration strategy and implementation details using Prisma ORM.

- [Overview](#overview)
- [Schema Management](#schema-management)
- [Migration Best Practices](#migration-best-practices)
- [Migration Commands](#migration-commands)
- [CI/CD Workflow](#cicd-workflow)
- [Local Development and Testing](#local-development-and-testing)
  - [Quick Start](#quick-start)
    - [Key Local Testing Commands](#key-local-testing-commands)
  - [Testing Workflow](#testing-workflow)
  - [Troubleshooting Prisma Connection Issues](#troubleshooting-prisma-connection-issues)
  - [Environment Configuration Verification](#environment-configuration-verification)
- [Target System Architecture](#target-system-architecture)
- [Implementation Status](#implementation-status)
  - [✅ Completed](#-completed)
  - [🚧 In Progress](#-in-progress)
- [Todo and Future Improvements](#todo-and-future-improvements)
  - [📝 Long-Term Improvements (Pre-Production)](#-long-term-improvements-pre-production)
    - [Production Migration Deployment](#production-migration-deployment)
    - [Seed Data Management](#seed-data-management)
    - [Performance and Monitoring](#performance-and-monitoring)
  - [🚀 Enterprise and Scaling Considerations (Post-Product-Market-Fit)](#-enterprise-and-scaling-considerations-post-product-market-fit)
    - [Advanced Database Management](#advanced-database-management)
    - [Security and Compliance](#security-and-compliance)
    - [Scalability Preparation](#scalability-preparation)
  - [📝 Additional Recommendations](#-additional-recommendations)
- [Environment Configuration](#environment-configuration)

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
├── testing.ts       # Subset of carriers for tests
├── production.ts    # Core production carriers
└── seed-utils.ts    # Shared seeding utilities
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

Our CI/CD pipeline is designed to ensure consistent, reliable deployments and testing across all environments.

### Final Desired State

We aim to achieve the following in our CI/CD workflow:

1. **Automated Integration Tests Using Docker Compose**
   - **Consistent Testing Environment**: Utilize Docker Compose in the CI pipeline to spin up services required for integration tests, ensuring consistency with local development environments.
   - **Database Service Health Checks**: Implement health checks to ensure all services, especially the database, are ready before tests run.
   - **Isolation of Test Environment**: Use dedicated test databases that are reset between runs to avoid state leakage between tests.
   - **Efficient Resource Usage**: Optimize the CI pipeline to parallelize tests where possible, reducing overall build times.

2. **Automated Migrations Against Development Database**
   - **Continuous Deployment to Dev Environment**: On changes to the Prisma schema or pushes to the `develop` branch, automatically run migrations against the development database hosted on Digital Ocean.
   - **Secure Credential Management**: Use GitHub Secrets to securely store and access database credentials during the CI/CD process.
   - **Deployment Workflow**: Have a dedicated deployment workflow (`deploy-dev.yml`) that handles migrations and deployment steps for the development environment.

3. **Comprehensive Documentation and Collaboration**
   - **Clear Documentation**: Maintain up-to-date documentation outlining the CI/CD processes, testing strategies, and migration procedures.
   - **Team Collaboration**: Ensure all team members are informed and trained on the new systems and workflows to promote effective collaboration.

4. **Robust Migration and Rollback Procedures**
   - **Automated Testing of Migrations**: Before deployment, migrations are thoroughly tested locally and in a staging environment to catch issues early.
   - **Rollback Capability**: Implement reliable rollback procedures in case migrations cause unexpected issues in the development environment.
   - **Version Control and Tracking**: Keep meticulous records of migration versions and changes to facilitate debugging and historical tracking.
### Updated CI/CD Workflow Steps

1. **Dependency Installation**
   - Install project dependencies using `npm ci`.
   - Cache dependencies to speed up subsequent builds.

2. **Build and Test Setup**
   - Build the application using `npm run build`.
   - Use caching strategies for the build output.

3. **Start Services with Docker Compose**
   - Use Docker Compose to spin up required services, including the application and PostgreSQL database.
   - Ensure services are up and healthy before proceeding.

4. **Run Migrations and Seeding**
   - Automatically run database migrations using `npm run prisma:migrate:deploy`.
   - Seed the database with initial data using `npm run prisma:seed:dev`.

5. **Execute Tests**
   - Run integration tests in two parallel jobs:
     1. **API Integration Tests**:
        - Uses Docker Compose with Dockerfile.test
        - Runs `test:api:ci` command in CI environment
        - Uses dedicated test database with health checks
        - Configured via docker-compose.test.yml
     2. **End-to-End Tests**:
        - Uses Cypress GitHub Action
        - Runs `cypress:run` command
        - Tests against running Next.js application
   - Tests are isolated and use dedicated test databases
   - Environment variables are properly configured for each test type

6. **Tear Down Services**
   - After tests are completed, tear down Docker Compose services to clean up resources.

7. **Automated Deployment to Development Environment**
   - On successful tests and builds, automatically deploy to the development environment.
   - Run migrations against the development database on Digital Ocean.
   - Ensure secure handling of environment variables and secrets.

## Local Development and Testing

### Quick Start

For detailed instructions on local database management, testing, and troubleshooting, refer to our [Local Database Testing Guide](DATABASE_LOCAL_TESTING.md).

#### Key Local Testing Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run Migrations
npm run prisma:migrate:deploy

# Seed Development Database
npm run prisma:seed:dev

# Reset Database
npm run prisma:db:reset
```

### Testing Workflow

1. Ensure local PostgreSQL is running.
2. Configure `.env` with `DATABASE_URL`.
3. Follow steps in Local Database Testing Guide.
4. Verify database state and migrations.

### Troubleshooting Prisma Connection Issues

If you encounter Prisma connection errors, particularly with port configuration, follow these steps:

1. **Check Environment Variable Resolution**
   ```bash
   # Check if DATABASE_URL is set in your shell
   echo $DATABASE_URL
   
   # If it shows an unexpected value or wrong port, unset it
   unset DATABASE_URL
   ```

   ⚠️ **Warning**: If Prisma is not using the configuration from your `.env` files, there might be a DATABASE_URL environment variable set in your shell that's taking precedence. This can cause connection errors, particularly with port numbers.

2. **Force Specific Configuration**
   ```bash
   # Run Prisma commands with explicit DATABASE_URL
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name npx prisma migrate reset --force
   ```

3. **Common Issues**:
   - If Prisma tries to connect to port 5433 when your database is on 5432:
     1. Check for DATABASE_URL in your shell environment
     2. Unset it if present
     3. Ensure your `.env` and `.env.test.local` files specify the correct port
     4. Verify the port matches your docker-compose configuration

### Environment Configuration Verification

Before running any database commands, ensure that your environment configuration is consistent:

1. **Check Port Configuration**
   - Verify that the port specified in your Docker Compose files matches the port in your environment files
   - The default configuration uses:
     ```bash
     # docker-compose.test.local.yml
     ports:
       - "5432:5432"   # Host:Container ports

     # .env and .env.test.local
     DATABASE_URL=postgresql://user:password@localhost:5432/db_name
     ```
   - If you modify the port in Docker Compose, ensure you update all relevant environment files

2. **Verify Environment Files**
   - Check both `.env` and `.env.test.local` for consistent configuration
   - Environment-specific files take precedence over the base `.env` file
   - Common issues include mismatched ports or credentials between files

3. **Test Database Connection**
   - Before running migrations, verify the database is accessible:
     ```bash
     # Start the database container
     docker compose -f docker-compose.test.local.yml up -d

     # Wait for the database to be ready
     sleep 5

     # Run migrations and seeding
     npm run prisma:db:reset
     npm run prisma:migrate:deploy
     npm run prisma:seed:dev
     ```

## Target System Architecture

Our goal is to have a robust, automated, and efficient system for managing database migrations and testing within our CI/CD pipeline and development workflow.

Key components of the target system include:

- **Automated CI Integration Tests Using Docker Compose**
  - Utilize Docker Compose to replicate the development environment in CI.
  - Run integration tests in an environment that closely mirrors production.

- **Continuous Deployment and Migrations**
  - Automatically deploy code changes and database migrations to the development environment.
  - Ensure that the development database stays in sync with the latest schema changes.

- **Improved Testing Workflow**
  - Use isolated test databases to prevent state contamination.
  - Reset databases between test runs for consistency.
  - Parallelize tests where possible to optimize build times.

- **Enhanced Documentation and Collaboration**
  - Maintain clear and comprehensive documentation of all processes.
  - Facilitate team training and knowledge sharing.

By implementing these systems, we aim to streamline our development processes, reduce potential errors, and improve overall efficiency.

## Implementation Status

### ✅ Completed

1. **Initial Setup**
   - Installed Prisma dependencies.
   - Initialized Prisma schema based on existing carriers table.
   - Created initial migration with descriptive name.
   - Set up schema validation with Zod.
   - Configured Prisma client instance.

2. **Seeding Strategy**
   - Configured seeding strategy.
     - Created seed directory structure.
     - Implemented seed-utils with carrier data from `init.sql`.
     - Created development seed file with full dataset.
     - Created testing seed file with subset.

3. **API Integration**
   - Updated API routes to use Prisma client.
     - Implemented CRUD operations in `/api/carriers` route.
     - Added transaction support for multi-step operations.
     - Implemented proper error handling with Prisma errors.
     - Added input validation using existing Zod schemas.

4. **Testing Enhancements**
   - Completed seeding implementation.
     - Created production seed file.
     - Added npm scripts for environment-specific seeding.
     - Added seed versioning for tracking data changes.
   - Updated tests to work with Prisma.
     - Updated `carriers.test.ts` to use Prisma client.
     - Added database cleanup using Prisma.
     - Added integration test suite for Prisma operations.
     - Created mock Prisma client for unit tests.
     - Added database transaction tests.

5. **Database Reset and Seeding Improvements**
   - Added `prisma:db:reset` npm script.
   - Implemented duplicate prevention in seeding.
   - Added unique constraints to prevent data duplication.
   - Created robust database reset mechanism.

6. **Database Migration and Development Workflow**
   - Added migration dry-run in GitHub Actions.
   - Implemented automatic schema validation.
   - Created deployment approval process for schema changes.
   - Updated GitHub workflow to include Prisma migration checks.
   - Created clear migration process for Digital Ocean.
   - Documented step-by-step migration workflow.
   - Implemented basic rollback mechanism script.
   - Created deployment script for Prisma migrations.

### 🚧 In Progress

1. **Environment Configuration and Troubleshooting Improvements** ✅
   - Added comprehensive troubleshooting guide for Prisma connection issues
   - Documented environment variable precedence and resolution
   - Added port configuration verification steps
   - Created clear steps for resolving common connection issues

2. **CI Integration Tests Using Docker Compose** ✅
   - Implemented Docker Compose configuration for API integration tests
     - Configured docker-compose.test.yml with proper service dependencies
     - Added database health checks for test reliability
   - Configured CI workflow to run both types of integration tests:
     - API tests via jest-tests job using Docker Compose
     - E2E tests via cypress-tests job
   - Environment variables properly configured for CI environment
   - Services torn down properly after test completion
   - **Local CI Pipeline Testing Workflow**:
     1. Build test image:
        ```bash
        docker build -f Dockerfile.test -t app-test:latest .
        ```
     2. Run API integration tests locally:
        ```bash
        TEST_MODE=ci docker compose -f docker-compose.test.yml up \
          --abort-on-container-exit \
          --exit-code-from test
        ```
     3. Clean up test environment:
        ```bash
        docker compose -f docker-compose.test.yml down -v
        ```
     4. Run Cypress E2E tests:
        ```bash
        npm ci
        npm start
        npm run cypress:run
        ```
     - Ensures tests pass locally before pushing to GitHub Actions
     - Mirrors CI environment configuration
     - Validates changes before remote testing

3. **Automate Migrations Against Dev Database in Digital Ocean**
   - Create a deployment workflow (`deploy-dev.yml`) for the dev environment.
     - Triggered on pushes to the `develop` branch or changes to the Prisma schema.
     - Runs migrations against the dev database when Prisma schema changes.
   - Secure credential management using GitHub Secrets (`DEV_DATABASE_URL`).
   - Document the deployment workflow and procedures.

4. **Enhance Testing Workflow**
   - Isolate test environment by using dedicated test databases.
     - Configure test-specific environment variables.
     - Reset test databases between test runs using `prisma:db:reset`.
   - Parallelize tests in the CI pipeline where possible.
   - Optimize testing scripts for efficiency.

5. **Improve Migrations and Rollbacks**
   - Test migrations locally before deployment to detect issues early.
   - Implement robust rollback procedures in case of migration failures.
     - Automate rollback testing in the CI pipeline.
     - Document rollback processes and strategies.

6. **Update Documentation and Collaboration**
   - Update `docs/DATABASE.md` to reflect new workflows and procedures.
     - Provide clear instructions on new migration and testing processes.
     - Include details about CI/CD pipeline changes.
   - Conduct knowledge-sharing sessions to familiarize the team with updates.
   - Encourage collaboration and feedback for continuous improvement.

## Todo and Future Improvements

### 📝 Long-Term Improvements (Pre-Production)

#### Production Migration Deployment

- [ ] Enhance migration performance monitoring.
- [ ] Add comprehensive error handling and logging.
- [ ] Complete testing of migration scripts.

#### Seed Data Management

- [ ] Create script to sync seed data between environments.
- [ ] Implement versioning for seed data.
- [ ] Add data integrity checks for seed scripts.

#### Performance and Monitoring

- [ ] Add basic database performance monitoring.
- [ ] Implement connection pooling configuration.
- [ ] Create database health check endpoint.
- [ ] Set up logging for database operations.
- [ ] Configure database connection timeout and retry strategies.

### 🚀 Enterprise and Scaling Considerations (Post-Product-Market-Fit)

#### Advanced Database Management

- [ ] Develop comprehensive performance monitoring system.
- [ ] Implement sophisticated backup and restoration strategies.
- [ ] Create advanced migration and schema evolution tools.

#### Security and Compliance

- [ ] Design enterprise-grade access control mechanisms.
- [ ] Implement advanced data anonymization techniques.
- [ ] Develop comprehensive audit logging.

#### Scalability Preparation

- [ ] Prepare for horizontal scaling.
- [ ] Design read replica configuration strategy.
- [ ] Implement advanced caching mechanisms.

### 📝 Additional Recommendations

1. **Set Up Automated Backup System**
   - Configure scheduled backups using `pg_dump`.
   - Implement backup rotation strategy.
   - Add backup verification process.
   - Create backup restoration documentation.

2. **Expand Deployment Strategies**
   - Create staging environment.
   - Add migration smoke tests.
   - Implement rollback verification.
   - Document deployment checklist.

3. **Enhance Database Management**
   - Add database performance monitoring.
   - Implement query optimization strategies.
   - Create database scaling documentation.
   - Add audit logging for schema changes.
   - Implement connection pooling.
   - Add database health checks.

## Environment Configuration

```bash
# Local development
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db"

# Digital Ocean environments
DATABASE_URL="postgresql://doadmin:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/defaultdb?sslmode=require"


