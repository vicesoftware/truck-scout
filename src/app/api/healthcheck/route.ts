import { NextResponse } from 'next/server';
import { Pool } from 'pg';

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return false;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  } finally {
    await pool.end();
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