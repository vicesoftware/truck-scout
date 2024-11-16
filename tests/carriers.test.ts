import axios from 'axios';
import { expect, describe, test, afterAll } from '@jest/globals';
import { Pool } from 'pg';

const isLocalDev = process.env.TEST_ENV === 'local';
const API_URL = isLocalDev 
  ? 'http://localhost:3000'
  : (process.env.API_URL || 'http://nextjs:3000');
const DATABASE_URL = isLocalDev
  ? 'postgresql://tms_test_user:test_password@localhost:5433/tms_test_db'
  : (process.env.DATABASE_URL || 'postgresql://tms_test_user:test_password@postgres:5432/tms_test_db');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const pool = new Pool({
  connectionString: DATABASE_URL,
});

describe('Database and Carriers API', () => {
  let createdCarrierId: number;

  test('Database should be accessible and have a carriers table', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM carriers');
      expect(result.rows[0].count).toBeDefined();
    } finally {
      client.release();
    } 
  });

  test('GET /api/carriers should return an array of carriers', async () => {
    const response = await axiosInstance.get('/api/carriers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('POST /api/carriers should create a new carrier', async () => {
    const newCarrier = {
      name: 'Test Carrier',
      mc_number: 'MC123456',
      dot_number: 'DOT789012',
      phone: '1234567890',
      status: 'Active',
      rating: 4.0
    };

    const response = await axiosInstance.post('/api/carriers', newCarrier);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
    ...newCarrier,
    rating: "4.0"
    });
    createdCarrierId = response.data.id;
  });

  test('PUT /api/carriers/<id> should update an existing carrier', async () => {
    const updatedCarrier = {
      name: 'Updated Test Carrier',
      mc_number: 'MC654321',
      dot_number: 'DOT987654',
      phone: '9876543210',
      status: 'Inactive',
      rating: 3
    };

    const response = await axiosInstance.put(`/api/carriers/${createdCarrierId}`, updatedCarrier);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
    ...updatedCarrier,
    id: createdCarrierId,
    rating: "3.0"
    });
  });

  test('DELETE /api/carriers/<id> should delete an existing carrier and verify via GET', async () => {
    // Create a new carrier specifically for this test
    const newCarrier = {
      name: 'Carrier to Delete',
      mc_number: 'MC999999',
      dot_number: 'DOT888888',
      phone: '5555555555',
      status: 'Active',
      rating: 3.5
    };

    const createResponse = await axiosInstance.post('/api/carriers', newCarrier);
    const carrierToDeleteId = createResponse.data.id;
    
    // Verify the carrier exists before deletion
    const getBeforeDeleteResponse = await axiosInstance.get(`/api/carriers/${carrierToDeleteId}`);
    expect(getBeforeDeleteResponse.status).toBe(200);

    // Delete the carrier
    const deleteResponse = await axiosInstance.delete(`/api/carriers/${carrierToDeleteId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data.message).toBe('Carrier deleted successfully');

    // Verify deletion by attempting to GET the carrier (should result in 404)
    try {
      await axiosInstance.get(`/api/carriers/${carrierToDeleteId}`);
      throw new Error('Carrier still exists after deletion');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        expect(error.response.status).toBe(404);
      } else {
        throw error;
      }
    }
  });
});

afterAll(async () => {
  await pool.end();
});
