'use client';

import { useState, useEffect } from 'react';

interface HealthCheckResponse {
  status: string;
  database: 'Connected' | 'Not Connected';
}

export default function HealthCheck() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  useEffect(() => {
    fetch('/api/healthcheck')
      .then(response => response.json())
      .then(data => setHealth(data))
      .catch(error => {
        console.error('Error fetching health check:', error);
        setHealth({ status: 'Error', database: 'Not Connected' });
      });
  }, []);

  const isConnected = health?.database === 'Connected';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Health Check</h1>
      <p className="text-lg mb-4">
        API Status: {health ? health.status : 'Checking...'}
      </p>
      <p className="text-lg mb-8">
        Database Status: {health ? health.database : 'Checking...'}
      </p>
      <div className={`w-16 h-16 rounded-full ${health === null ? 'bg-gray-500' : (isConnected ? 'bg-green-500' : 'bg-red-500')}`}></div>
    </div>
  );
}