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

describe('Database and Brokers API', () => {
  let createdBrokerId: number;

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

  test('POST /api/brokers should create a new broker', async () => {
    const newBroker = {
      name: 'Test Broker Company',
      contact_email: 'contact@testbroker.com',
      contact_phone: '1234567890',
      type: 'Broker-Carrier',
      mc_number: 'MC987654',
      dot_number: 'DOT345678'
    };

    const response = await axiosInstance.post('/api/brokers', newBroker);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      ...newBroker,
      id: expect.any(Number)
    });
    createdBrokerId = response.data.id;
  });

  test('GET /api/brokers/<id> should fetch a specific broker', async () => {
    const response = await axiosInstance.get(`/api/brokers/${createdBrokerId}`);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: createdBrokerId,
      name: 'Test Broker Company',
      contact_email: 'contact@testbroker.com'
    });
  });

  test('PUT /api/brokers/<id> should update an existing broker', async () => {
    const updatedBroker = {
      name: 'Updated Test Broker Company',
      contact_email: 'updated@testbroker.com',
      contact_phone: '9876543210',
      type: 'Broker-Only',
      mc_number: 'MC123456',
      dot_number: 'DOT678901'
    };

    const response = await axiosInstance.put(`/api/brokers/${createdBrokerId}`, updatedBroker);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      ...updatedBroker,
      id: createdBrokerId
    });
  });

  test('DELETE /api/brokers/<id> should delete an existing broker', async () => {
    // Create a new broker specifically for this test
    const newBroker = {
      name: 'Broker to Delete',
      contact_email: 'delete@testbroker.com',
      contact_phone: '5555555555',
      type: 'Broker-Carrier',
      mc_number: 'MC999999',
      dot_number: 'DOT888888'
    };

    let brokerToDeleteId: string | undefined;

    try {
      // Create the broker
      const createResponse = await axiosInstance.post('/api/brokers', newBroker);
      expect(createResponse.status).toBe(201);
      brokerToDeleteId = createResponse.data.id;
      console.log(`Created broker with ID: ${brokerToDeleteId}`);

      // Verify the broker exists
      const getResponse = await axiosInstance.get(`/api/brokers/${brokerToDeleteId}`);
      expect(getResponse.status).toBe(200);
      console.log('Broker exists before deletion');

      // Now attempt to delete the broker
      const deleteResponse = await axiosInstance.delete(`/api/brokers/${brokerToDeleteId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.data.message).toBe('Broker deleted successfully');

      console.log('Broker deleted successfully');

      // Verify the broker no longer exists
      try {
        await axiosInstance.get(`/api/brokers/${brokerToDeleteId}`);
        throw new Error('Broker still exists after deletion');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log('Broker successfully deleted and not found');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in DELETE test:');
      
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Error message:', error.message);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error:', error);
      }

      // If the error is in the delete operation, try to get the broker to see if it still exists
      if (brokerToDeleteId) {
        try {
          const checkResponse = await axiosInstance.get(`/api/brokers/${brokerToDeleteId}`);
          console.error('Broker still exists after failed deletion:', {
            id: checkResponse.data.id,
            name: checkResponse.data.name,
            mc_number: checkResponse.data.mc_number
          });
        } catch (checkError) {
          if (axios.isAxiosError(checkError)) {
            console.error('Error checking broker existence after failed deletion:', {
              status: checkError.response?.status,
              message: checkError.message
            });
          } else {
            console.error('Unknown error checking broker existence after failed deletion');
          }
        }
      }

      throw error;
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
    const nonExistentBrokerId = 999999; // Assuming this ID does not exist
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

afterAll(async () => {
  await pool.end();
});
