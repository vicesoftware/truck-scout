import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

let certPath: string | null = null;

function writeCACertToFile() {
    const caCertBase64 = process.env.CA_CERT;
    if (caCertBase64) {
        const caCert = Buffer.from(caCertBase64, 'base64').toString('utf8');
        certPath = path.join(__dirname, 'ca-certificate.crt');
        
        fs.writeFileSync(certPath, caCert, 'utf8');
        console.log('CA certificate written to file' + certPath);
    } else {
        throw new Error('CA_CERT environment variable is not set');
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
            rejectUnauthorized: true,
            ca: certPath ? fs.readFileSync(certPath).toString() : undefined
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