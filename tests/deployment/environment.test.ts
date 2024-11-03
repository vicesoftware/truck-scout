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
      
      const data = await response.json();
      
      // Verify the response structure and types
      expect(data).toMatchObject({
        status: expect.stringMatching(/^(OK|Error)$/),
        environment: expect.stringMatching(/^(development|test|production|unknown)$/),
        database: expect.stringMatching(/^(Connected|Not Connected)$/),
        environmentVariables: {
          valid: expect.any(Boolean),
          missing: expect.any(Array)
        }
      });

      // If status is OK, verify everything is working
      if (data.status === 'OK') {
        expect(data.database).toBe('Connected');
        expect(data.environmentVariables.valid).toBe(true);
        expect(data.environmentVariables.missing).toHaveLength(0);
        expect(data.error).toBeUndefined();
      }

      // If there's an error, verify error details
      if (data.status === 'Error') {
        expect(data).toHaveProperty('error');
        expect(data.error).toBeTruthy();
        
        // Check if it's a database error or environment variables error
        if (data.database === 'Not Connected') {
          expect(data.error).toContain('database');
        }
        if (!data.environmentVariables.valid) {
          expect(data.error).toContain('Missing environment variables');
        }
      }

    } catch (error) {
      throw new Error(`API URL ${apiUrl} is not accessible: ${error}`);
    }
  });
});
import { describe, test, expect } from '@jest/globals';

describe('Environment Configuration', () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_API_URL',
    'NODE_ENV'
  ];

  test.each(requiredEnvVars)('should have %s defined', (envVar) => {
    expect(process.env[envVar]).toBeDefined();
    expect(process.env[envVar]).not.toBe('');
  });

  test('DATABASE_URL should have correct format', () => {
    const dbUrl = process.env.DATABASE_URL;
    expect(dbUrl).toMatch(/^postgresql:\/\/.+:.+@.+:\d+\/.+$/);
  });

  test('NODE_ENV should be valid', () => {
    const validEnvs = ['development', 'test', 'production'];
    expect(validEnvs).toContain(process.env.NODE_ENV);
  });

  test('NEXT_PUBLIC_API_URL should be valid URL', () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    expect(() => new URL(apiUrl!)).not.toThrow();
  });
});
