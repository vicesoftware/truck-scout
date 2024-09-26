import axios from 'axios';
import { expect, describe, test } from '@jest/globals';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

describe('Carriers API', () => {
  let createdCarrierId: number;

  test('GET /api/carriers should return an array of carriers', async () => {
    try {
      const response = await axiosInstance.get('/api/carriers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      console.error('Error in GET test:', error);
      throw error;
    }
  });

  test('POST /api/carriers should create a new carrier', async () => {
    const newCarrier = {
      name: 'Test Carrier',
      mc_number: 'MC123456',
      dot_number: 'DOT789012',
      phone: '1234567890',
      status: 'Active',
      rating: 4
    };

    try {
      const response = await axiosInstance.post('/api/carriers', newCarrier);
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject(newCarrier);
      createdCarrierId = response.data.id;
    } catch (error) {
      console.error('Error in POST test:', error);
      throw error;
    }
  });

  test('PUT /api/carriers should update an existing carrier', async () => {
    const updatedCarrier = {
      id: createdCarrierId,
      name: 'Updated Test Carrier',
      mc_number: 'MC654321',
      dot_number: 'DOT987654',
      phone: '9876543210',
      status: 'Inactive',
      rating: 3
    };

    try {
      const response = await axiosInstance.put('/api/carriers', updatedCarrier);
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updatedCarrier);
    } catch (error) {
      console.error('Error in PUT test:', error);
      throw error;
    }
  });

  test('DELETE /api/carriers should delete an existing carrier', async () => {
    try {
      const response = await axiosInstance.delete('/api/carriers', {
        data: { id: createdCarrierId }
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Carrier deleted successfully');
    } catch (error) {
      console.error('Error in DELETE test:', error);
      throw error;
    }
  });
});