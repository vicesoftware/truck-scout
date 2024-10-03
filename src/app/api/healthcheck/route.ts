import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const CA_CERT_PATH = path.join(process.cwd(), 'ca-certificate.crt');

function writeCACertToFile() {
  if (process.env.CA_CERT) {
    fs.writeFileSync(CA_CERT_PATH, process.env.CA_CERT, 'utf8');
    console.log('CA certificate written to file', process.env.CA_CERT);
  } else {
    console.error('CA_CERT environment variable is not set');
  }
}

// Write the CA certificate to a file when the module is first imported
writeCACertToFile();

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return {connected: false, error: 'DATABASE_URL is not defined in the environment variables'};
  }

  let pool = null;

  try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          ca: fs.readFileSync(CA_CERT_PATH).toString(),
          rejectUnauthorized: true,
        },
      });
    
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return {connected: true};
  } catch (error) {
    const errorMessage = error instanceof Error ? 
        error.message : 'An unknown error occurred';

    if (error instanceof Error) {
        const errorResponse = { 
            connected: false,
            error: errorMessage,
            variables: {
                DATABASE_URL: process.env.DATABASE_URL,
                CA_CERT: process.env.CA_CERT
            }
        };
        console.error('Database connection error:', errorResponse);
        return errorResponse;
    }
    return { connected: false, error: 'An unknown error occurred' };
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await checkDatabaseConnection();
  return NextResponse.json({
    status: 'OK',
    database: response.connected ? 'Connected' : 'Not Connected'
  }, { status: response.connected ? 200 : 503 });
}