# API Testing Best Practices

## Running API Tests

To run API tests locally, follow these steps:

1. Start the Test Database:
   ```bash
   npm run test:db:up
   ```
   This command sets up the PostgreSQL test database container.

2. Start the Next.js Development Server in Test Mode:
   ```bash
   npm run dev:test
   ```
   This starts the application in a test environment.

3. Run Specific API Tests:
   ```bash
   npm run test:api:local tests/brokers-api.test.ts
   ```
   Replace `tests/brokers-api.test.ts` with the specific test file you want to run.

4. Clean Up Test Environment (Optional):
   ```bash
   npm run test:db:down
   ```
   This stops and removes the test database container.

## Overview
This document outlines best practices for writing comprehensive and robust API tests, focusing on database-backed API endpoints in a TypeScript/Node.js environment.

## Key Principles
1. **Comprehensive Coverage**
2. **Isolation and Cleanup**
3. **Error Handling**
4. **Environment Flexibility**
5. **Detailed Logging**

## Test Environment Configuration

### Jest Configuration and Module Systems
Jest configuration uses CommonJS format (`.cjs` extension) to avoid conflicts between ES Modules and CommonJS. This is important because:

1. Node.js treats `.js` files differently based on whether `"type": "module"` is set in `package.json`
2. Jest has historically used CommonJS and may have compatibility issues with ES Modules
3. Using `.cjs` extension explicitly tells Node.js to treat the file as CommonJS, regardless of package.json settings

### Jest Configuration
The test environment is configured in `jest.config.cjs`, which handles:

- Test environment setup (Node.js environment)
- TypeScript integration via ts-jest
- Path aliases for clean imports
- Test file patterns and locations
- Performance settings (worker count and memory limits)
- Global test timeouts
- Automatic mock resets between tests

Key Configuration Points:
- Tests run in a Node.js environment
- 30-second timeout for API tests (configurable via environment variable)
- Automatic mock clearing between tests
- TypeScript support via ts-jest
- Path aliases support (@/ maps to src/)
- Worker memory limits to prevent OOM issues

## Test Suite Structure

### 1. Environment Configuration
```typescript
// Dynamic environment selection
const isLocalDev = process.env.TEST_ENV === 'local';
const API_URL = isLocalDev 
  ? 'http://localhost:3000'
  : (process.env.API_URL || 'http://nextjs:3000');
const DATABASE_URL = isLocalDev
  ? 'postgresql://user:password@localhost:port/database'
  : (process.env.DATABASE_URL || 'default_connection_string');
```

### 2. HTTP Client Setup
- Use a configured HTTP client (e.g., axios)
- Set base URL to simplify endpoint calls
```typescript
const axiosInstance = axios.create({
  baseURL: API_URL,
});
```

### 3. Database Connection
- Use connection pool for database interactions
- Connect and disconnect appropriately
```typescript
const pool = new Pool({
  connectionString: DATABASE_URL,
});

afterAll(async () => {
  await pool.end(); // Always close database connection
});
```

## Test Case Patterns

### 1. Database Accessibility Test
```typescript
test('Database should be accessible and have required table', async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM table_name');
    expect(result.rows[0].count).toBeDefined();
  } finally {
    client.release(); // Always release client
  } 
});
```

### 2. GET Endpoint Test
```typescript
test('GET /api/endpoint should return array of items', async () => {
  const response = await axiosInstance.get('/api/endpoint');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
});
```

### 3. POST Endpoint Test
```typescript
test('POST /api/endpoint should create new item', async () => {
  const newItem = { /* item data */ };

  const response = await axiosInstance.post('/api/endpoint', newItem);
  expect(response.status).toBe(201);
  expect(response.data).toMatchObject({
    ...newItem,
    // Additional expected transformations
  });
  
  // Store created ID for further tests
  const createdItemId = response.data.id;
});
```

### 4. PUT Endpoint Test
```typescript
test('PUT /api/endpoint/<id> should update existing item', async () => {
  const updatedItem = { /* updated item data */ };

  const response = await axiosInstance.put(`/api/endpoint/${itemId}`, updatedItem);
  expect(response.status).toBe(200);
  expect(response.data).toMatchObject({
    ...updatedItem,
    id: itemId
  });
});
```

### 5. DELETE Endpoint Test
```typescript
test('DELETE /api/endpoint/<id> should delete existing item', async () => {
  // Create item to delete
  const createResponse = await axiosInstance.post('/api/endpoint', newItem);
  const itemToDeleteId = createResponse.data.id;

  // Delete item
  const deleteResponse = await axiosInstance.delete(`/api/endpoint/${itemToDeleteId}`);
  expect(deleteResponse.status).toBe(200);

  // Verify item no longer exists
  try {
    await axiosInstance.get(`/api/endpoint/${itemToDeleteId}`);
    throw new Error('Item still exists after deletion');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Expected behavior
    } else {
      throw error;
    }
  }
});
```

## Error Handling Strategies

### Comprehensive Error Logging
```typescript
try {
  // Test operation
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
  } else if (error instanceof Error) {
    console.error('Error message:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
  throw error;
}
```

## Best Practices Checklist
- [ ] Test database connection
- [ ] Test GET endpoint (list and single item)
- [ ] Test POST endpoint (creation)
- [ ] Test PUT endpoint (update)
- [ ] Test DELETE endpoint
- [ ] Handle potential error scenarios
- [ ] Clean up created test data
- [ ] Use environment-specific configurations
- [ ] Implement comprehensive error logging

## Performance and Reliability Considerations
- Use connection pools
- Release database clients after use
- Handle potential network or database errors
- Implement proper error logging
- Ensure test isolation

## Common Pitfalls to Avoid
- Not releasing database clients
- Hardcoding test data
- Ignoring error scenarios
- Not cleaning up test data
- Lack of comprehensive error handling

## Recommended Tools
- Jest for testing framework
- Axios for HTTP requests
- pg (node-postgres) for database interactions
- dotenv for environment configuration
