# Trucking Brokers
A trucking broker is a company that arranges transportation for shippers and carriers. They can be either a broker-only company or a broker-carrier company.

## Implementation Plan

### Phase 1: Domain Model and API Development
1. Create Domain Types
   - [x] Define TypeScript interfaces in `src/domains/brokers/types.ts`
     * Broker interface implemented
     * Other interfaces (Load, Carrier, Shipper, Factor) pending
   - [ ] Create comprehensive unit tests for domain types
     * Validate interface structures
     * Test type compatibility
     * Ensure type safety for broker-related interfaces

2. Develop API Routes
   - [x] Implement `src/app/api/brokers/route.ts`
     * Uses PostgreSQL connection pool (pg)
     * Implemented GET method to list brokers
     * Implemented POST method to create new brokers
     * Includes robust error handling
     * Validates broker type and required fields
   - [x] Implement `src/app/api/brokers/[id]/route.ts`
     * Created GET method to fetch specific broker
     * Added PUT method to update broker details
     * Implemented DELETE method to remove brokers
     * Uses direct SQL queries
   - [x] Create comprehensive API route tests in `tests/brokers.test.ts`
     * Tested database connection and brokers table
     * Validated GET /api/brokers endpoint
     * Tested POST /api/brokers for broker creation
     * Implemented PUT /api/brokers/<id> update tests
     * Created DELETE /api/brokers/<id> deletion tests
     * Includes error handling and edge case coverage
     * Added data cleanup mechanism to ensure test isolation

3. Database Schema Considerations
   - [x] Prepare SQL schema for brokers table
     * Included columns: id, name, contact_email, contact_phone, type
     * Defined appropriate data types and constraints in `init.sql`
     * Used PostgreSQL ENUM for broker type
   - [x] Ensured consistent naming conventions with existing database schema
   - [ ] Create database schema validation tests
     * Verify table structure
     * Test column constraints
     * Validate data type mappings

4. Create API Client Functions
   - [ ] Develop `src/domains/brokers/api.ts`
     * Create methods for fetching brokers
     * Implement load-related API methods
     * Add methods for carrier, shipper, and factor retrieval
     * Ensure error handling for API calls
   - [ ] Develop comprehensive tests for API client functions
     * Unit tests for each API method
     * Test error handling scenarios
     * Validate data transformation and retrieval

5. Create React Query Hooks
   - [ ] Develop `src/domains/brokers/hooks.ts`
     * Implement hooks for brokers list and individual broker
     * Create hooks for loads, carriers, shippers, and factors
     * Add mutation hook for creating loads
   - [ ] Create tests for React Query hooks
     * Test hook behavior
     * Validate data fetching and mutation
     * Ensure proper state management

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

### Carriers
- A carrier is a company that owns or leases trucks and employs drivers to transport goods.
- A broker can have multiple carriers

### Factors
- A factor is a company that provides financing for carriers to purchase trucks and equipment.
- A broker can have multiple factors

### Shippers
- A shipper is a company that needs to transport goods.
- A broker can have multiple shippers

### Loads
- A load is a shipment request from a shipper to a broker

## Workflow
1. A broker creates a load
2. A broker searches for carriers that can fulfill the load
   1. A broker can search for carriers by name
   2. A broker negotiates the load details with the selected carrier
   3. A broker confirms the shipment details with the carrier
3. A broker notifies the shipper that the load has been assigned to a carrier
4. The load is now in progress
5. The load is completed
6. The load is invoiced
7. The load is paid

## Current Implementation Notes
- Broker API routes are fully implemented with comprehensive test coverage
- Database schema for brokers is established
- Basic CRUD operations for brokers are functional
- Test suite includes data isolation and cleanup mechanisms
- Next steps focus on expanding API client functions and React Query hooks
