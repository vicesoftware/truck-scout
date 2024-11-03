import { describe, expect, test, beforeAll } from '@jest/globals';

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_API_URL',
  'NODE_ENV',
  'ENVIRONMENT',
  'BRANCH_NAME'
];

// Expected format for specific environment variables
const ENV_FORMATS = {
  DATABASE_URL: /^postgresql:\/\/.+:.+@.+:\d{4}\/.+$/,
  NEXT_PUBLIC_API_URL: /^https?:\/\/.+/,
  NODE_ENV: /^(development|test|production)$/,
  ENVIRONMENT: /^(local|development|staging|production)$/,
  BRANCH_NAME: /^[a-zA-Z0-9\-_\/]+$/
};

describe('Environment Configuration', () => {
  beforeAll(() => {
    // Ensure we're in test environment
    if (!process.env.ENVIRONMENT) {
      process.env.ENVIRONMENT = 'local';
    }
  });

  test('all required environment variables are present', () => {
    REQUIRED_ENV_VARS.forEach(envVar => {
      const value = process.env[envVar];
      expect(value).toBeDefined();
      expect(value).not.toBe('');
      console.log(`${envVar}: ${value}`); // Add debugging output
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
      const data = await response.json();
      
      console.log('API Response:', {
        url: `${apiUrl}/api/healthcheck`,
        status: response.status,
        data: JSON.stringify(data, null, 2)
      });
      
      try {
        expect(data).toMatchObject({
          status: expect.stringMatching(/^(OK|Error)$/),
          environment: expect.stringMatching(/^(local|development|staging|production|unknown)$/),
          database: expect.stringMatching(/^(Connected|Not Connected)$/),
          environmentVariables: {
            valid: expect.any(Boolean),
            missing: expect.arrayContaining([])
          }
        });
      } catch (matchError) {
        console.error('Expected format:', {
          status: 'OK or Error',
          environment: 'local|development|staging|production|unknown',
          database: 'Connected|Not Connected',
          environmentVariables: {
            valid: 'boolean',
            missing: 'array'
          }
        });
        console.error('Received:', data);
        throw matchError;
      }

      if (data.status === 'OK') {
        expect(data.database).toBe('Connected');
        expect(data.environmentVariables.valid).toBe(true);
        expect(data.environmentVariables.missing).toHaveLength(0);
        expect(data.error).toBeUndefined();
      }

      if (data.status === 'Error') {
        expect(data).toHaveProperty('error');
        expect(data.error).toBeTruthy();
        
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

  test('environment-specific configurations are correct', () => {
    const env = process.env.NODE_ENV;
    const environment = process.env.ENVIRONMENT;
    
    if (env === 'production') {
      // Production should have stricter requirements
      expect(process.env.NEXT_PUBLIC_API_URL).toMatch(/^https:\/\//); // Ensure HTTPS
      expect(environment).toBe('production');
    }
    
    if (env === 'development') {
      // Development can be more lenient
      expect(['development', 'staging'])
        .toContain(environment);
    }
  });

  test('sensitive credentials are properly secured', () => {
    const dbUrl = new URL(process.env.DATABASE_URL as string);
    
    // Password complexity - only enforce in non-local environments
    if (process.env.ENVIRONMENT !== 'local') {
      expect(dbUrl.password).toMatch(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      );
    } else {
      // For local environment, just ensure password exists
      expect(dbUrl.password).toBeTruthy();
    }
    
    try {
      // Password complexity check with detailed error message
      if (process.env.ENVIRONMENT !== 'local') {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(dbUrl.password)) {
          throw new Error(
            'Database password does not meet security requirements.\n' +
            'Password must:\n' +
            '- Be at least 8 characters long\n' +
            '- Contain at least one letter\n' +
            '- Contain at least one number\n' +
            '- Contain at least one special character (@$!%*#?&)\n' +
            `Received: "${dbUrl.password}"`
          );
        }
      }
    } catch (error) {
      throw error;
    }
    
    // Ensure no sensitive info in non-secure variables
    const publicVars = Object.entries(process.env)
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'));
    
    publicVars.forEach(([, value]) => {
      expect(value).not.toMatch(/postgresql:\/\//);
      expect(value).not.toMatch(/password/i);
      expect(value).not.toMatch(/secret/i);
    });
  });
});
