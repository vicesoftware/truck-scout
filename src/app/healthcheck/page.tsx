import { Pool } from 'pg';

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return false;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

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

export default async function HealthCheck() {
  const isConnected = await checkDatabaseConnection();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Health Check</h1>
      <p className="text-lg mb-8">
        Database Status: {isConnected ? 'Connected' : 'Not Connected'}
      </p>
      <div className={`w-16 h-16 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
    </div>
  );
}