jest.setTimeout(30000); // Keep existing timeout

// Add global fetch polyfill if needed for Node < 18
if (!global.fetch) {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}

// Add environment variable validation
beforeAll(() => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_API_URL',
    'NODE_ENV'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

// Add afterAll cleanup
afterAll(async () => {
  // Add any global cleanup needed
  await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure connections are closed
});
