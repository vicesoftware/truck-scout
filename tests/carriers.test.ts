import axios, { AxiosError } from 'axios';
import { expect, describe, test, afterEach, beforeEach, afterAll, beforeAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import crypto from 'crypto';

// Enhanced Test Data Factory with more robust uniqueness
const createCarrierData = (override = {}, index = 0) => {
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  
  return {
    name: `Test Carrier ${timestamp}_${randomSuffix}_${index}`,
    mc_number: `MC${timestamp}_${randomSuffix}_${index}`,
    dot_number: `DOT${timestamp}_${randomSuffix}_${index}`,
    phone: `${1000000000 + parseInt(randomSuffix, 16)}`,
    status: 'Active',
    rating: 4.0,
    ...override
  };
};

const isLocalDev = process.env.TEST_ENV === 'local';
const API_PORT = process.env.PORT || 3000;
const API_HOST = process.env.HOST || 'localhost';
const API_URL = isLocalDev 
  ? `http://${API_HOST}:${API_PORT}`
  : (process.env.API_URL || 'http://nextjs:3000');

console.log('Using API URL:', API_URL); // Add logging to verify URL

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const prisma = new PrismaClient();

describe('Carriers API', () => {
  beforeAll(async () => {
    try {
      // Comprehensive database cleanup
      await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
      ]);

      execSync('npx prisma migrate deploy');
      await prisma.$connect();
      await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'carriers'
      `;
      
      try {
        const response = await axiosInstance.get('/api/healthcheck');
        console.log('Healthcheck response:', response.status);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('API Connection Error:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
          });
        }
        throw error;
      }
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
      // Aggressive database cleanup
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
      // Final cleanup after each test
      await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE "carriers" RESTART IDENTITY CASCADE`,
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during cleanup:', error);
      }
    }
  });

  test('Database should be accessible and have a carriers table', async () => {
    const count = await prisma.carrier.count();
    expect(count).toBe(0);
  });

  test('GET /api/carriers should return an array of carriers', async () => {
    const testCarrier = createCarrierData({}, 1);

    const createResponse = await axiosInstance.post('/api/carriers', testCarrier);
    expect(createResponse.status).toBe(201);

    const response = await axiosInstance.get('/api/carriers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(1);
    expect(response.data[0].name).toBe(testCarrier.name);
    
    // Verify rating is returned as a string with one decimal place
    expect(response.data[0].rating).toBe('4.0');
  });

  test('POST /api/carriers should create a new carrier', async () => {
    const newCarrier = createCarrierData({}, 2);

    const response = await axiosInstance.post('/api/carriers', newCarrier);
    expect(response.status).toBe(201);
    
    // Verify the response matches the input, with rating converted to string
    expect(response.data).toMatchObject({
      name: newCarrier.name,
      mc_number: newCarrier.mc_number,
      dot_number: newCarrier.dot_number,
      phone: newCarrier.phone,
      status: newCarrier.status,
      rating: '4.0'
    });

    // Verify the carrier was actually saved in the database
    const dbCarrier = await prisma.carrier.findUnique({
      where: { 
        mcNumber: newCarrier.mc_number 
      }
    });
    expect(dbCarrier).toBeDefined();
    expect(dbCarrier?.name).toBe(newCarrier.name);
    
    // Verify the rating is saved as a number in the database
    expect(dbCarrier?.rating).toBe(4.0);
  });

  test('PUT /api/carriers/<id> should update an existing carrier', async () => {
    const initialCarrier = createCarrierData({}, 3);

    const createResponse = await axiosInstance.post('/api/carriers', initialCarrier);
    const carrierId = createResponse.data.id;

    const updatedCarrier = createCarrierData({
      status: 'Inactive',
      rating: 3.0
    }, 4);

    const updateResponse = await axiosInstance.put(`/api/carriers/${carrierId}`, updatedCarrier);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data).toMatchObject({
      ...updatedCarrier,
      id: carrierId,
      rating: '3.0'
    });

    const dbCarrier = await prisma.carrier.findUnique({
      where: { id: carrierId }
    });
    expect(dbCarrier).toBeDefined();
    expect(dbCarrier?.status).toBe('Inactive');
    expect(dbCarrier?.rating).toBe(3.0);
  });

  test('DELETE /api/carriers/<id> should delete an existing carrier', async () => {
    const newCarrier = createCarrierData({}, 5);

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
  });

  test('POST /api/carriers should prevent duplicate MC number', async () => {
    const timestamp = Date.now();
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const duplicateMcNumber = `MC${timestamp}_${randomSuffix}`;

    const baseCarrier = createCarrierData({ 
      mc_number: duplicateMcNumber 
    }, 6);
    const secondCarrier = createCarrierData({ 
      mc_number: duplicateMcNumber,
      phone: `${1000000000 + parseInt(randomSuffix, 16) + 1}`
    }, 7);

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
      // Final comprehensive cleanup
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
