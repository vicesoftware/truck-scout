import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_API_URL',
  'NODE_ENV'
];

async function checkEnvironmentVariables() {
  const missing = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
  const environment = process.env.NODE_ENV || 'unknown';
  
  return {
    valid: missing.length === 0,
    environment,
    missing
  };
}

async function checkDatabaseConnection() {
    if (!process.env.DATABASE_URL) {
        return { connected: false, error: 'DATABASE_URL is not defined' };
    }

    let pool = null;

    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
        
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        return { connected: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? 
            error.message : 'An unknown error occurred';
        return { connected: false, error: errorMessage };
    } finally {
        if (pool) {
            await pool.end();
        }
    }
}

export const dynamic = 'force-dynamic';

export async function GET() {
    const envCheck = await checkEnvironmentVariables();
    const dbCheck = await checkDatabaseConnection();

    const status = envCheck.valid && dbCheck.connected ? 'OK' : 'Error';
    
    const response = {
        status,
        environment: envCheck.environment,
        database: dbCheck.connected ? 'Connected' : 'Not Connected',
        environmentVariables: {
            valid: envCheck.valid,
            missing: envCheck.missing || []
        },
        error: dbCheck.error || (envCheck.valid ? undefined : `Missing environment variables: ${envCheck.missing?.join(', ')}`)
    };

    return NextResponse.json(
        response,
        { status: status === 'OK' ? 200 : 503 }
    );
}
