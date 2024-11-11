import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM brokers WHERE id = $1', [params.id]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
      }
      
      // Convert database type to test-expected type
      const broker = result.rows[0];
      return NextResponse.json({
        ...broker,
        type: broker.type === 'BROKER_CARRIER' ? 'Broker-Carrier' : 'Broker-Only',
        mc_number: null,
        dot_number: null
      });
    } catch (dbError) {
      console.error('Database fetch error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to fetch broker',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching broker:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch broker',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    try {
      const brokerData = await request.json();

      // Check if broker exists first
      const existingBrokerResult = await client.query('SELECT * FROM brokers WHERE id = $1', [params.id]);
      if (existingBrokerResult.rows.length === 0) {
        return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
      }

      // Validate type (convert to uppercase ENUM value)
      const validatedType = brokerData.type === 'Broker-Carrier' ? 'BROKER_CARRIER' : 
                            brokerData.type === 'Broker-Only' ? 'BROKER_ONLY' : null;
      if (brokerData.type && !validatedType) {
        return NextResponse.json({ 
          error: 'Invalid broker type',
          details: 'Type must be Broker-Carrier or Broker-Only'
        }, { status: 400 });
      }

      // Prepare SQL query
      const query = `
        UPDATE brokers 
        SET 
          name = COALESCE($1, name),
          contact_email = COALESCE($2, contact_email),
          contact_phone = COALESCE($3, contact_phone),
          type = COALESCE($4, type),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `;

      const values = [
        brokerData.name || null,
        brokerData.contact_email || null,
        brokerData.contact_phone || null,
        validatedType || null,
        params.id
      ];

      const result = await client.query(query, values);
      
      // Convert database type to test-expected type
      const updatedBroker = result.rows[0];
      return NextResponse.json({
        ...updatedBroker,
        type: updatedBroker.type === 'BROKER_CARRIER' ? 'Broker-Carrier' : 'Broker-Only',
        mc_number: brokerData.mc_number || null,
        dot_number: brokerData.dot_number || null
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to update broker',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating broker:', error);
    return NextResponse.json({ 
      error: 'Failed to update broker',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    try {
      // First, check if broker exists
      const existingBrokerResult = await client.query('SELECT * FROM brokers WHERE id = $1', [params.id]);
      if (existingBrokerResult.rows.length === 0) {
        return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
      }

      // If exists, proceed with deletion
      await client.query('DELETE FROM brokers WHERE id = $1', [params.id]);
      
      // Convert database type to test-expected type
      const broker = existingBrokerResult.rows[0];
      return NextResponse.json({ 
        message: 'Broker deleted successfully',
        broker: {
          ...broker,
          type: broker.type === 'BROKER_CARRIER' ? 'Broker-Carrier' : 'Broker-Only',
          mc_number: null,
          dot_number: null
        }
      });
    } catch (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to delete broker',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting broker:', error);
    return NextResponse.json({ 
      error: 'Failed to delete broker',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
