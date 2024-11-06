# Architecture

## Project Structure
```bash
src/
├── app/              # Next.js app router pages and API routes
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   └── {feature}/   # Feature-specific components
├── domains/         # Business domain logic
│   └── carriers/    # Example domain
│       ├── api.ts   # API client functions
│       ├── hooks.ts # React hooks for data management
│       └── types.ts # TypeScript types/interfaces
├── hooks/           # Generic React hooks
├── lib/            # Utility functions and shared code
└── types/          # Global TypeScript types
```

## Domain-Driven Architecture

We follow a domain-driven approach where business logic is organized into domain-specific modules. Each domain module contains:

- `api.ts` - API client functions for backend communication
- `hooks.ts` - React Query hooks for state management
- `types.ts` - TypeScript types specific to the domain

Example domain module (`domains/carriers/`):
```typescript
// api.ts
export const carriersApi = {
  getAll: async (): Promise<Carrier[]> => {
    const response = await fetch('/api/carriers');
    if (!response.ok) throw new Error('Failed to fetch carriers');
    return response.json();
  },
  // ... other API methods
};

// hooks.ts
export function useCarriers() {
  return useQuery({
    queryKey: ['carriers'],
    queryFn: carriersApi.getAll,
  });
}

// types.ts
export interface Carrier {
  id: number;
  name: string;
  // ... other properties
}
```

## Key Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **API Layer**: Next.js API Routes
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
  - Database migrations and type-safe queries
  - Automated schema management
  - Seeding functionality
- **CMS**: [Payload CMS](https://payloadcms.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query) (formerly React Query)
- **UI Components**: Custom components built with [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: 
  - [Cypress](https://www.cypress.io/) for E2E and component testing
  - [Vitest](https://vitest.dev/) for unit testing
- **Development Tools**:
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting
  - Docker for development environment

## Data Flow

1. UI Components use domain hooks to access data:
```typescript
function CarriersList() {
  const { data: carriers } = useCarriers();
  return <div>{carriers.map(carrier => <CarrierRow {...carrier} />)}</div>;
}
```

2. Domain hooks manage state with React Query:
```typescript
function useCarriers() {
  return useQuery({
    queryKey: ['carriers'],
    queryFn: carriersApi.getAll,
  });
}
```

3. API functions handle backend communication:
```typescript
const carriersApi = {
  getAll: async () => {
    const response = await fetch('/api/carriers');
    return response.json();
  },
};
```

4. Next.js API routes connect to the database:
```typescript
// app/api/carriers/route.ts
export async function GET() {
  const carriers = await prisma.carrier.findMany();
  return Response.json(carriers);
}
```

This architecture promotes:
- Separation of concerns
- Code reusability
- Type safety
- Testing isolation
- Maintainable codebase

## Database & Migrations

We use Prisma as our ORM and database migration tool. This provides:

1. **Type-safe Database Access**:
```typescript
// Example of type-safe database query
const carriers = await prisma.carrier.findMany({
  where: { status: 'Active' }
});
```

2. **Schema Management**:
```prisma
// prisma/schema.prisma
model Carrier {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  mcNumber  String?  @map("mc_number")
  // ... other fields
}
```

## Implementation Steps

### 1. Local Development Setup
- Install Prisma dependencies
- Initialize Prisma schema based on existing carriers table
- Create initial migration
- Update API routes to use Prisma client
- Update tests to work with Prisma

### 2. Local Testing
- Test Prisma migrations on local PostgreSQL
- Verify seed data functionality
- Run full test suite with Prisma implementation

### 3. Digital Ocean Deployment
- Backup existing production database
- Apply migrations to development environment
- Test deployment process
- Apply migrations to production environment

### Migration Commands

```bash
# Development
npm run prisma:migrate:dev    # Create and apply migrations locally
npm run prisma:generate       # Generate Prisma Client
npm run prisma:seed          # Seed database

# Production
npm run prisma:migrate:deploy # Deploy migrations to production
```

### Environment Configuration
```bash
# Local development
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db"

# Digital Ocean environments
DATABASE_URL="postgresql://doadmin:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/defaultdb?sslmode=require"
```
