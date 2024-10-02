import { NextResponse } from 'next/server';
import { Pool } from 'pg';

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return false;
  }

  // Modify the connection string to disable SSL verification
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString.includes('sslmode=')) {
    connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=no-verify';
  } else {
    connectionString = connectionString.replace(/sslmode=\w+/, 'sslmode=no-verify');
  }

  const pool = new Pool({ connectionString });

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