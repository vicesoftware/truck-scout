import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        contact_email, 
        contact_phone, 
        type 
      FROM brokers
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      name, 
      contact_email, 
      contact_phone, 
      type 
    } = await request.json();

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' }, 
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO brokers 
        (name, contact_email, contact_phone, type) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, contact_email, contact_phone, type`,
      [name, contact_email, contact_phone, type]
    );
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json(
      { error: 'Failed to create broker' }, 
      { status: 500 }
    );
  }
}
