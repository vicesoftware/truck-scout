# Trucking Brokers
A trucking broker is a company that arranges transportation for shippers and carriers. They can be either a broker-only company or a broker-carrier company.

## AI Agent Prompt
When implementing the brokers domain follow the best practices outlined in 

* [PROMPT_BEST_PRACTICES.md](docs/prompts/PROMPT_BEST_PRACTICES.md) document
* [ARCHITECTURE.md](docs/ARCHITECTURE.md) document
* [TESTING_BEST_PRACTICES.md](docs/TESTING_BEST_PRACTICES.md) document

## Entities and Relationships

### Carriers
 A carrier is a company that owns or leases trucks and employs drivers to transport goods.
- A broker can have multiple carriers

### Factors
- A factor is a company that provides financing for carriers to purchase trucks and equipment.
 A broker can have multiple factors
-
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

## Implementation Plan

### Phase 1: Domain Model and API Development
1. Create Domain Types
   - [x] Define TypeScript interfaces in `src/domains/brokers/types.ts`
     * Broker interface implemented
     * Load interface implemented
     * Carrier interface implemented
     * Shipper interface implemented
     * Factor interface implemented
   - [x] Create comprehensive behavior-focused tests for domain types
     * Validate type compatibility and constraints
     * Ensure types support key business workflows
     * Test type interactions in realistic scenarios
     * Focus on observable behavior, not implementation details

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
   - [x] Create comprehensive API route tests
     * Verify complete API to database round-trip
     * Test full lifecycle of broker-related operations
     * Validate data integrity across API calls
     * Simulate real-world user interaction scenarios
     * Confirm correct error handling and edge cases
     * Ensure tests are independent of internal implementation

3. Database Schema Considerations
   - [x] Prepare SQL schema for brokers table
     * Included columns: id, name, contact_email, contact_phone, type
     * Defined appropriate data types and constraints in `init.sql`
     * Used PostgreSQL ENUM for broker type
   - [x] Create database schema validation tests
     * Verify data persistence and retrieval
     * Test schema constraints and relationships
     * Validate data transformations
     * Ensure tests focus on observable database behavior

4. Create API Client Functions
   - [ ] Develop `src/domains/brokers/api.ts`
     * Create methods for fetching brokers
     * Implement load-related API methods
     * Add methods for carrier, shipper, and factor retrieval
     * Ensure error handling for API calls
   - [ ] Develop feature-centric API client tests
     * Test complete feature workflows
     * Validate API method interactions
     * Verify error scenarios and edge cases
     * Focus on user-facing functionality

5. Create React Query Hooks
   - [ ] Develop `src/domains/brokers/hooks.ts`
     * Implement hooks for brokers list and individual broker
     * Create hooks for loads, carriers, shippers, and factors
     * Add mutation hook for creating loads
   - [ ] Create interaction-focused tests
     * Simulate user interface interactions
     * Test hook behavior in realistic scenarios
     * Validate data fetching and mutation flows
     * Ensure tests are lightweight and maintainable

### Phase 2: Advanced Broker Management
- [ ] Implement advanced filtering and search capabilities
- [ ] Develop comprehensive reporting features
- [ ] Create user role-based access controls
- [ ] Integrate with external transportation management systems

### Phase 3: Performance and Scalability
- [ ] Optimize database queries
- [ ] Implement caching mechanisms
- [ ] Develop load balancing strategies
- [ ] Create monitoring and alerting systems

### Phase 4: Machine Learning Integration
- [ ] Develop predictive load matching algorithms
- [ ] Implement risk assessment models
- [ ] Create intelligent pricing recommendations
- [ ] Build carrier performance analytics

### Phase 5: Mobile and Cross-Platform Support
- [ ] Develop responsive web interface
- [ ] Create mobile application for iOS and Android
- [ ] Implement cross-platform synchronization
- [ ] Develop offline mode capabilities

## Future Considerations
- Blockchain integration for transparent transaction tracking
- AI-powered route optimization
- Real-time tracking and geolocation services
- Advanced analytics and business intelligence dashboards

## Compliance and Security
- GDPR and data protection compliance
- Secure authentication and authorization
- Regular security audits
- Encryption of sensitive data
