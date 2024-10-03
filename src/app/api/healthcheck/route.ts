import { NextResponse } from 'next/server';
import { Pool } from 'pg';

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return false;
  }

  let pool = null;

  try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          ca: process.env.CA_CERT,
          rejectUnauthorized: true,
        },
      });
    
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? 
        error.message : 'An unknown error occurred';

    if (error instanceof Error) {
        const response = { 
            error: errorMessage,
            variables: {
                DATABASE_URL: process.env.DATABASE_URL,
                CA_CERT: process.env.CA_CERT
            }
        };
        console.error('Database connection error:', response);
        return response;
    }
    return { error: 'An unknown error occurred' };
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbConnected = await checkDatabaseConnection();
  return NextResponse.json({
    status: 'OK',
    database: dbConnected ? 'Connected' : 'Not Connected'
  }, { status: dbConnected ? 200 : 503 });
}