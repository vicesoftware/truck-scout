import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM carriers');
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return NextResponse.json({ error: 'Failed to fetch carriers' }, { status: 500 });
  } finally {
    await pool.end();
  }
}