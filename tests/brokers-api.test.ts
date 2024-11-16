import axios from 'axios';
import { expect, describe, test, afterAll, beforeAll, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import http from 'http';
import https from 'https';

const isLocalDev = process.env.TEST_ENV === 'local';
const API_URL = isLocalDev 
  ? 'http://localhost:3000'
  : (process.env.API_URL || 'http://nextjs:3000');
const DATABASE_URL = isLocalDev
  ? 'postgresql://tms_test_user:test_password@localhost:5433/tms_test_db'
  : (process.env.DATABASE_URL || 'postgresql://tms_test_user:test_password@postgres:5432/tms_test_db');

const axiosInstance = axios.create({
  baseURL: API_URL,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false })
});

const pool = new Pool({
  connectionString: DATABASE_URL,
});

describe('Database and Brokers API', () => {
  const createdBrokerIds: number[] = [];
  let initialBrokerCount: number;
  let finalBrokerCount: number;

  // Helper function to clean up created brokers
  async function cleanupCreatedBrokers() {
    for (const brokerId of createdBrokerIds) {
      try {
        await axiosInstance.delete(`/api/brokers/${brokerId}`);
      } catch (error) {
        console.warn(`Failed to delete broker ${brokerId} during cleanup:`, error);
      }
    }
    createdBrokerIds.length = 0; // Clear the array
  }

  // Capture initial broker count to restore after tests
  beforeAll(async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM brokers');
      initialBrokerCount = parseInt(result.rows[0].count, 10);
    } finally {
      client.release();
    }
  });

  afterEach(async () => {
    await cleanupCreatedBrokers();
  });

  afterAll(async () => {
    await cleanupCreatedBrokers();

    // Verify final broker count matches initial count
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM brokers');
      finalBrokerCount = parseInt(result.rows[0].count, 10);
      
      // Ensure no additional brokers were left behind
      expect(finalBrokerCount).toBe(initialBrokerCount);
    } finally {
      client.release();
      await pool.end();
    }
  });

  test('Database should be accessible and have a brokers table', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM brokers');
      expect(result.rows[0].count).toBeDefined();
    } finally {
      client.release();
    } 
  });

  test('GET /api/brokers should return an array of brokers', async () => {
    const response = await axiosInstance.get('/api/brokers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('POST /api/brokers should create a new broker and verify via GET', async () => {
    const newBroker = {
      name: 'Test Broker Company',
      contact_email: 'contact@testbroker.com',
      contact_phone: '1234567890',
      type: 'Broker-Carrier'
    };

    const postResponse = await axiosInstance.post('/api/brokers', newBroker);
    expect(postResponse.status).toBe(201);
    expect(postResponse.data).toMatchObject({
      name: newBroker.name,
      contact_email: newBroker.contact_email,
      contact_phone: newBroker.contact_phone,
      type: newBroker.type,
      id: expect.any(Number)
    });
    const createdBrokerId = postResponse.data.id;
    createdBrokerIds.push(createdBrokerId);

    // Verify POST by doing a GET and checking data
    const getResponse = await axiosInstance.get(`/api/brokers/${createdBrokerId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toMatchObject({
      id: createdBrokerId,
      name: newBroker.name,
      contact_email: newBroker.contact_email,
      contact_phone: newBroker.contact_phone,
      type: newBroker.type
    });
  });

  test('PUT /api/brokers/<id> should update an existing broker and verify via GET', async () => {
    // First, create a broker to update
    const newBroker = {
      name: 'Broker to Update',
      contact_email: 'update@testbroker.com',
      contact_phone: '5555555555',
      type: 'Broker-Carrier'
    };

    const createResponse = await axiosInstance.post('/api/brokers', newBroker);
    const createdBrokerId = createResponse.data.id;
    createdBrokerIds.push(createdBrokerId);

    const updatedBroker = {
      name: 'Updated Test Broker Company',
      contact_email: 'updated@testbroker.com',
      contact_phone: '9876543210',
      type: 'Broker-Only'
    };

    const putResponse = await axiosInstance.put(`/api/brokers/${createdBrokerId}`, updatedBroker);
    expect(putResponse.status).toBe(200);
    expect(putResponse.data).toMatchObject({
      name: updatedBroker.name,
      contact_email: updatedBroker.contact_email,
      contact_phone: updatedBroker.contact_phone,
      type: updatedBroker.type,
      id: createdBrokerId
    });

    // Verify PUT by doing a GET and checking updated data
    const getResponse = await axiosInstance.get(`/api/brokers/${createdBrokerId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toMatchObject({
      id: createdBrokerId,
      name: updatedBroker.name,
      contact_email: updatedBroker.contact_email,
      contact_phone: updatedBroker.contact_phone,
      type: updatedBroker.type
    });
  });

  test('DELETE /api/brokers/<id> should delete an existing broker and verify via GET', async () => {
    // Create a new broker specifically for this test
    const newBroker = {
      name: 'Broker to Delete',
      contact_email: 'delete@testbroker.com',
      contact_phone: '5555555555',
      type: 'Broker-Carrier'
    };

    const createResponse = await axiosInstance.post('/api/brokers', newBroker);
    const brokerToDeleteId = createResponse.data.id;
    
    // Verify the broker exists before deletion
    const getBeforeDeleteResponse = await axiosInstance.get(`/api/brokers/${brokerToDeleteId}`);
    expect(getBeforeDeleteResponse.status).toBe(200);

    // Delete the broker
    const deleteResponse = await axiosInstance.delete(`/api/brokers/${brokerToDeleteId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data.message).toBe('Broker deleted successfully');

    // Verify deletion by attempting to GET the broker (should result in 404)
    try {
      await axiosInstance.get(`/api/brokers/${brokerToDeleteId}`);
      throw new Error('Broker still exists after deletion');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // This is the expected behavior
        expect(error.response.status).toBe(404);
      } else {
        throw error;
      }
    }
  });

  test('POST /api/brokers should handle validation errors', async () => {
    const invalidBroker = {
      name: '', // Empty name should trigger validation error
      contact_email: 'invalid-email', // Invalid email format
      contact_phone: 'not-a-phone-number'
    };

    try {
      await axiosInstance.post('/api/brokers', invalidBroker);
      throw new Error('Expected validation error was not thrown');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data).toHaveProperty('errors');
      } else {
        throw error;
      }
    }
  });

  test('PUT /api/brokers should handle non-existent broker', async () => {
    const nonExistentBrokerId = 999999;
    const updateData = {
      name: 'Non-Existent Broker Update'
    };

    try {
      await axiosInstance.put(`/api/brokers/${nonExistentBrokerId}`, updateData);
      throw new Error('Expected not found error was not thrown');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(404);
      } else {
        throw error;
      }
    }
  });
});
