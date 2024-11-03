import { describe, expect, test } from '@jest/globals';

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_API_URL',
  'NODE_ENV'
];

// Expected format for specific environment variables
const ENV_FORMATS = {
  DATABASE_URL: /^postgresql:\/\/.+:.+@.+:\d{4}\/.+$/,
  NEXT_PUBLIC_API_URL: /^https?:\/\/.+/,
  NODE_ENV: /^(development|test|production)$/
};

describe('Environment Configuration', () => {
  test('all required environment variables are present', () => {
    REQUIRED_ENV_VARS.forEach(envVar => {
      expect(process.env[envVar]).toBeDefined();
      expect(process.env[envVar]).not.toBe('');
    });
  });

  test('environment variables match expected formats', () => {
    Object.entries(ENV_FORMATS).forEach(([envVar, format]) => {
      const value = process.env[envVar];
      expect(value).toMatch(format);
    });
  });

  test('database URL contains correct components', () => {
    const dbUrl = process.env.DATABASE_URL;
    expect(dbUrl).toBeDefined();
    
    const url = new URL(dbUrl as string);
    expect(url.protocol).toBe('postgresql:');
    expect(url.username).toBeTruthy();
    expect(url.password).toBeTruthy();
    expect(url.hostname).toBeTruthy();
    expect(url.port).toBeTruthy();
    expect(url.pathname.slice(1)).toBeTruthy(); // Remove leading slash
  });

  test('NODE_ENV is set appropriately', () => {
    const validEnvs = ['development', 'test', 'production'];
    expect(validEnvs).toContain(process.env.NODE_ENV);
  });

  test('API URL is accessible', async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    expect(apiUrl).toBeDefined();
    
    try {
      const response = await fetch(`${apiUrl}/api/healthcheck`);
      expect(response.ok).toBe(true);
    } catch (error) {
      throw new Error(`API URL ${apiUrl} is not accessible: ${error}`);
    }
  });
});
