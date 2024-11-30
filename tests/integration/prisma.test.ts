import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Prisma Integration Tests', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.carrier.deleteMany();
  });

  test('should perform database operations within a transaction', async () => {
    const result = await prisma.$transaction(async (tx) => {
      // Create a carrier
      const carrier = await tx.carrier.create({
        data: {
          name: 'Transaction Test Carrier',
          mcNumber: 'MC123456'
        }
      });

      // Update the carrier
      const updated = await tx.carrier.update({
        where: { id: carrier.id },
        data: { name: 'Updated Transaction Carrier' }
      });

      return updated;
    });

    expect(result.name).toBe('Updated Transaction Carrier');

    // Verify the transaction was committed
    const carrier = await prisma.carrier.findUnique({
      where: { id: result.id }
    });
    expect(carrier).toBeDefined();
    expect(carrier?.name).toBe('Updated Transaction Carrier');
  });

  test('should rollback transaction on error', async () => {
    const carrierName = 'Rollback Test Carrier';

    try {
      await prisma.$transaction(async (tx) => {
        // Create a carrier
        await tx.carrier.create({
          data: {
            name: carrierName,
            mcNumber: 'MC999999'
          }
        });

        // Force an error
        throw new Error('Test rollback');
      });
    } catch (error) {
      // Expected error
    }

    // Verify the carrier was not created (transaction rolled back)
    const carrier = await prisma.carrier.findFirst({
      where: { name: carrierName }
    });
    expect(carrier).toBeNull();
  });

  test('should handle concurrent transactions', async () => {
    // Create multiple carriers in parallel transactions
    const carriers = await Promise.all([
      prisma.$transaction(tx => tx.carrier.create({
        data: {
          name: 'Concurrent Carrier 1',
          mcNumber: 'MC111111'
        }
      })),
      prisma.$transaction(tx => tx.carrier.create({
        data: {
          name: 'Concurrent Carrier 2',
          mcNumber: 'MC222222'
        }
      }))
    ]);

    expect(carriers).toHaveLength(2);
    expect(carriers[0].name).toBe('Concurrent Carrier 1');
    expect(carriers[1].name).toBe('Concurrent Carrier 2');
  });

  test('should handle bulk operations in transaction', async () => {
    const carriersToCreate = [
      {
        name: 'Bulk Carrier 1',
        mcNumber: 'MC333333'
      },
      {
        name: 'Bulk Carrier 2',
        mcNumber: 'MC444444'
      }
    ];

    const result = await prisma.$transaction(async (tx) => {
      // Create multiple carriers
      const created = await Promise.all(
        carriersToCreate.map(carrier => 
          tx.carrier.create({ data: carrier })
        )
      );

      // Update all created carriers
      const updated = await tx.carrier.updateMany({
        where: {
          id: {
            in: created.map(c => c.id)
          }
        },
        data: {
          name: 'Updated Bulk Carrier'
        }
      });

      return { created, updated };
    });

    expect(result.created).toHaveLength(2);
    expect(result.updated.count).toBe(2);

    // Verify all carriers were updated
    const carriers = await prisma.carrier.findMany({
      where: {
        id: {
          in: result.created.map(c => c.id)
        }
      }
    });
    expect(carriers).toHaveLength(2);
    carriers.forEach(carrier => {
      expect(carrier.name).toBe('Updated Bulk Carrier');
    });
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.carrier.deleteMany();
    await prisma.$disconnect();
  });
});
