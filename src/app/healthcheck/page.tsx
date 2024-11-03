'use client';

import { useState, useEffect } from 'react';

interface HealthCheckResponse {
  status: string;
  environment: string;
  database: 'Connected' | 'Not Connected';
  error?: string;
}

export default function HealthCheck() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/healthcheck')
      .then(response => response.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching health check:', error);
        setHealth({
          status: 'Error',
          environment: 'Unknown',
          database: 'Not Connected',
          error: error.message
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Loading Health Status...</h1>
      </div>
    );
  }

  const isHealthy = health?.status === 'OK' && health?.database === 'Connected';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">System Health Status</h1>
      
      <div className="space-y-4 text-center mb-8">
        <p className="text-lg">
          Environment: <span className="font-semibold">{health?.environment}</span>
        </p>
        <p className="text-lg">
          Status: <span className="font-semibold">{health?.status}</span>
        </p>
        <p className="text-lg">
          Database: <span className="font-semibold">{health?.database}</span>
        </p>
        {health?.error && (
          <p className="text-lg text-red-500">
            Error: <span className="font-semibold">{health.error}</span>
          </p>
        )}
      </div>

      <div className={`w-16 h-16 rounded-full ${
        loading ? 'bg-gray-500' : 
        (isHealthy ? 'bg-green-500' : 'bg-red-500')
      }`}></div>
    </div>
  );
}
