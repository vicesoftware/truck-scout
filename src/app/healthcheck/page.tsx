'use client';

import { useState, useEffect } from 'react';
import { Pool } from 'pg';

// Move this function outside of the component and make it non-async
function checkDatabaseConnection(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in the environment variables');
    return Promise.resolve(false);
  } else {
    console.log('DATABASE_URL is defined in the environment variables');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return pool.connect().then((client) => {
    return client.query('SELECT 1').then(() => {
      client.release();
      return true;
    }).catch((error) => {
      console.error('Database connection error:', error);
      return false;
    }).finally(() => {
      return pool.end();
    });
  });
}

export default function HealthCheck() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkDatabaseConnection().then(setIsConnected);
  }, []);

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