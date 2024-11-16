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
