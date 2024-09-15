import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM carriers');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return NextResponse.json({ error: 'Failed to fetch carriers' }, { status: 500 });
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

export async function PUT(request: Request) {
  try {
    const { id, name, mc_number, dot_number, phone, status, rating } = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE carriers SET name = $1, mc_number = $2, dot_number = $3, phone = $4, status = $5, rating = $6 WHERE id = $7 RETURNING *',
      [name, mc_number, dot_number, phone, status, rating, id]
    );
    client.release();
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating carrier:', error);
    return NextResponse.json({ error: 'Failed to update carrier' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const client = await pool.connect();
    const result = await client.query('DELETE FROM carriers WHERE id = $1 RETURNING *', [id]);
    client.release();
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Carrier deleted successfully' });
  } catch (error) {
    console.error('Error deleting carrier:', error);
    return NextResponse.json({ error: 'Failed to delete carrier' }, { status: 500 });
  }
}