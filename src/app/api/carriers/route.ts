import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.CA_CERT ? Buffer.from(process.env.CA_CERT, 'base64').toString('ascii') : undefined,
  },
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM carriers');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, mc_number, dot_number, phone, status, rating } = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO carriers (name, mc_number, dot_number, phone, status, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, mc_number, dot_number, phone, status, rating]
    );
    client.release();
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating carrier:', error);
    return NextResponse.json({ error: 'Failed to create carrier' }, { status: 500 });
  }
}