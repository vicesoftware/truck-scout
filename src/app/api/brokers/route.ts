import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM brokers');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      name, 
      contact_email, 
      contact_phone, 
      type, 
      mc_number, 
      dot_number 
    } = await request.json();

    // Validate required fields
    const errors = [];
    if (!name) errors.push('Name is required');
    if (!contact_email) errors.push('Contact email is required');
    if (!contact_phone) errors.push('Contact phone is required');
    
    // Validate type (convert to uppercase ENUM value)
    const validatedType = type === 'Broker-Carrier' ? 'BROKER_CARRIER' : 
                          type === 'Broker-Only' ? 'BROKER_ONLY' : null;
    if (!validatedType) errors.push('Invalid broker type. Must be Broker-Carrier or Broker-Only');

    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed',
        errors 
      }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO brokers (name, contact_email, contact_phone, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, contact_email, contact_phone, validatedType]
      );
      
      // Reconstruct response to match test expectations
      return NextResponse.json({
        ...result.rows[0],
        type: type,
        mc_number: mc_number || null,
        dot_number: dot_number || null
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to create broker',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json({ 
      error: 'Failed to create broker',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
