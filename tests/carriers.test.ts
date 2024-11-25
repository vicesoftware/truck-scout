import axios, { AxiosError } from 'axios';
import { expect, describe, test, afterEach, beforeEach, afterAll, beforeAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const isLocalDev = process.env.TEST_ENV === 'local';
const API_PORT = process.env.PORT || 3000;
const API_HOST = process.env.HOST || 'localhost';
const API_URL = isLocalDev 
  ? `http://${API_HOST}:${API_PORT}`
  : (process.env.API_URL || `http://${API_HOST}:${API_PORT}`);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const prisma = new PrismaClient();

describe('Carriers API', () => {
  beforeAll(async () => {
    try {
      execSync('npx prisma migrate deploy');
      await prisma.$connect();
      await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'carriers'
      `;
      await axiosInstance.get('/api/healthcheck');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(`Cannot connect to API: ${error.message}`);
      } else if (error instanceof Error) {
        throw new Error(`Test initialization error: ${error.message}`);
      } else {
        throw new Error('Unexpected error during test initialization');
      }
    }
  });

  beforeEach(async () => {
    try {
      await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
      ]);
      const count = await prisma.carrier.count();
      expect(count).toBe(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error during database cleanup');
      }
    }
  });

  afterEach(async () => {
    try {
      await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
      ]);
      const count = await prisma.carrier.count();
      expect(count).toBe(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error during database cleanup');
      }
    }
  });

  test('Database should be accessible and have a carriers table', async () => {
    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('GET /api/carriers should return an array of carriers', async () => {
    const testCarrier = {
      name: 'Test Carrier for GET',
      mc_number: 'MC111111',
      dot_number: 'DOT222222',
      phone: '1111111111',
      status: 'Active',
      rating: 4.0
    };

    const createResponse = await axiosInstance.post('/api/carriers', testCarrier);
    expect(createResponse.status).toBe(201);

    const response = await axiosInstance.get('/api/carriers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(1);
    expect(response.data[0].name).toBe(testCarrier.name);

    await prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
    ]);

    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('POST /api/carriers should create a new carrier', async () => {
    const newCarrier = {
      name: 'Unique Test Carrier',
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

    const dbCarrier = await prisma.carrier.findUnique({
      where: { id: response.data.id }
    });
    expect(dbCarrier).toBeDefined();
    expect(dbCarrier?.name).toBe(newCarrier.name);

    await prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
    ]);

    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('PUT /api/carriers/<id> should update an existing carrier', async () => {
    const initialCarrier = {
      name: 'Original Carrier',
      mc_number: 'MC987654',
      dot_number: 'DOT543210',
      phone: '9876543210',
      status: 'Active',
      rating: 4.5
    };

    const createResponse = await axiosInstance.post('/api/carriers', initialCarrier);
    const carrierId = createResponse.data.id;

    const updatedCarrier = {
      name: 'Updated Test Carrier',
      mc_number: 'MC654321',
      dot_number: 'DOT987654',
      phone: '5555555555',
      status: 'Inactive',
      rating: 3
    };

    const updateResponse = await axiosInstance.put(`/api/carriers/${carrierId}`, updatedCarrier);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data).toMatchObject({
      ...updatedCarrier,
      id: carrierId,
      rating: "3.0"
    });

    const dbCarrier = await prisma.carrier.findUnique({
      where: { id: carrierId }
    });
    expect(dbCarrier).toBeDefined();
    expect(dbCarrier?.name).toBe(updatedCarrier.name);

    await prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
    ]);

    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('DELETE /api/carriers/<id> should delete an existing carrier', async () => {
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
    
    const getBeforeDeleteResponse = await axiosInstance.get(`/api/carriers/${carrierToDeleteId}`);
    expect(getBeforeDeleteResponse.status).toBe(200);

    const deleteResponse = await axiosInstance.delete(`/api/carriers/${carrierToDeleteId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data.message).toBe('Carrier deleted successfully');

    try {
      await axiosInstance.get(`/api/carriers/${carrierToDeleteId}`);
      throw new Error('Carrier still exists after deletion');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        expect(error.response.status).toBe(404);
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error during carrier deletion verification');
      }
    }

    await prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
    ]);

    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('POST /api/carriers should prevent duplicate MC number', async () => {
    const duplicateMcNumber = 'MC123456';
    const baseCarrier = {
      name: 'First Test Carrier',
      mc_number: duplicateMcNumber,
      dot_number: 'DOT789012',
      phone: '1234567890',
      status: 'Active',
      rating: 4.0
    };

    const secondCarrier = {
      ...baseCarrier,
      name: 'Second Test Carrier',
      dot_number: 'DOT987654',
      phone: '0987654321'
    };

    // Create first carrier successfully
    const firstResponse = await axiosInstance.post('/api/carriers', baseCarrier);
    expect(firstResponse.status).toBe(201);

    // Attempt to create second carrier with same MC number
    try {
      await axiosInstance.post('/api/carriers', secondCarrier);
      throw new Error('Should have thrown an error for duplicate MC number');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(409);
        expect(error.response?.data.message).toContain('MC number must be unique');
      } else {
        throw error;
      }
    }
  });

  afterAll(async () => {
    try {
      await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
      ]);
      await prisma.$disconnect();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error during final cleanup');
      }
    }
  });
});
