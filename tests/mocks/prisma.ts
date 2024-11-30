import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

// Create a mock instance of PrismaClient
export const createMockPrismaClient = () => mockDeep<PrismaClient>();

// Example mock data for carriers
export const mockCarriers = [
  {
    id: 1,
    name: 'Mock Carrier 1',
    mcNumber: 'MC111111',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Mock Carrier 2',
    mcNumber: 'MC222222',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Example usage:
/*
import { createMockPrismaClient, mockCarriers } from '../mocks/prisma';

describe('Carrier Service', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.carrier.findMany.mockResolvedValue(mockCarriers);
  });

  test('should fetch carriers', async () => {
    const carriers = await mockPrisma.carrier.findMany();
    expect(carriers).toEqual(mockCarriers);
  });
});
*/
