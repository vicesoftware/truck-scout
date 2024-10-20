import axios from 'axios';
import { expect, describe, test, afterAll } from '@jest/globals';
import { Pool } from 'pg';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://tms_test_user:test_password@localhost:5432/tms_test_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

describe('Testing Environment', () => {
  test('Database should be accessible and have a carriers table', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM carriers');
      expect(result.rows[0].count).toBeDefined();
    } finally {
      client.release();
    } 
  });

  test('GET /api/healthcheck should return system status', async () => {
    const response = await axios.get(`${API_URL}/api/healthcheck`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status', 'OK');
    expect(response.data).toHaveProperty('database', 'Connected');
  });

  afterAll(async () => {
    await pool.end();
  });
});
