# Trucking Brokers
A trucking broker is a company that arranges transportation for shippers and carriers. They can be either a broker-only company or a broker-carrier company.

## Implementation Plan

### Phase 1: Domain Model and API Development
1. Create Domain Types
   - [ ] Define TypeScript interfaces in `src/domains/brokers/types.ts`
     * Broker interface
     * Load interface
     * Carrier interface
     * Shipper interface
     * Factor interface

2. Develop API Routes
   - [ ] Implement `src/app/api/brokers/route.ts`
     * Use PostgreSQL connection pool (pg)
     * Implement GET method to list brokers
     * Add POST method to create new brokers
     * Ensure robust error handling
   - [ ] Implement `src/app/api/brokers/[id]/route.ts`
     * Create GET method to fetch specific broker
     * Add PUT method to update broker details
     * Implement DELETE method to remove brokers
     * Use direct SQL queries instead of ORM

3. Database Schema Considerations
   - [ ] Prepare SQL schema for brokers table
     * Include columns: id, name, contact_email, contact_phone, type
     * Define appropriate data types and constraints
   - [ ] Ensure consistent naming conventions with existing database schema

4. Create API Client Functions
   - [ ] Develop `src/domains/brokers/api.ts`
     * Create methods for fetching brokers
     * Implement load-related API methods
     * Add methods for carrier, shipper, and factor retrieval
     * Ensure error handling for API calls

5. Create React Query Hooks
   - [ ] Develop `src/domains/brokers/hooks.ts`
     * Implement hooks for brokers list and individual broker
     * Create hooks for loads, carriers, shippers, and factors
     * Add mutation hook for creating loads

### Phase 2: Frontend Implementation
6. Broker Dashboard Components
   - [ ] Create base dashboard layout in `src/components/broker-dashboard.tsx`
     * Implement grid-based layout
     * Add sections for Active Loads, Carrier Management, Shipper Relationships, Financial Overview

7. Load Management Components
   - [ ] Develop load-related UI components
     * Create load creation form
     * Implement load status tracking
     * Design carrier assignment interface

8. State Management Integration
   - [ ] Connect dashboard components with React Query hooks
     * Implement data fetching logic
     * Add loading and error states
     * Create interactive UI elements

### Remaining Phases
[... rest of the previous implementation plan remains the same ...]

## Entities and Relationships

[... rest of the original document remains the same ...]
