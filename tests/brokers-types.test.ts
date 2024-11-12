import { describe, test, expect } from '@jest/globals';
import { 
  Broker, 
  Load, 
  LoadStatus, 
  Carrier, 
  Shipper, 
  Factor 
} from '../src/domains/brokers/types';

describe('Broker Domain Types', () => {
  describe('Broker Interface', () => {
    const validBroker: Broker = {
      name: 'Test Broker Company',
      type: 'BROKER_CARRIER',
      contact_email: 'contact@testbroker.com',
      contact_phone: '1234567890'
    };

    test('should have required properties', () => {
      expect(validBroker).toHaveProperty('name');
      expect(validBroker).toHaveProperty('type');
    });

    test('should support optional properties', () => {
      // Check that optional properties can be added
      const brokerWithOptionals: Broker = {
        ...validBroker,
        id: 1
      };
      
      expect(brokerWithOptionals).toHaveProperty('id', 1);
      expect(brokerWithOptionals.id).toBeDefined();
    });

    test('should enforce type constraints', () => {
      expect(typeof validBroker.name).toBe('string');
      expect(validBroker.name.length).toBeGreaterThan(0);
    });

    test('should only allow specific broker types', () => {
      const validTypes: Broker['type'][] = ['BROKER_ONLY', 'BROKER_CARRIER'];
      expect(validTypes).toContain(validBroker.type);
    });
  });

  describe('Load Interface', () => {
    const validLoad: Load = {
      broker_id: 1,
      shipper_id: 2,
      status: 'CREATED',
      origin: 'Los Angeles, CA',
      destination: 'New York, NY',
      rate: 1500.00
    };

    test('should have required properties', () => {
      expect(validLoad).toHaveProperty('broker_id');
      expect(validLoad).toHaveProperty('shipper_id');
      expect(validLoad).toHaveProperty('status');
      expect(validLoad).toHaveProperty('origin');
      expect(validLoad).toHaveProperty('destination');
      expect(validLoad).toHaveProperty('rate');
    });

    test('should support optional properties', () => {
      // Check that optional properties can be added
      const loadWithOptionals: Load = {
        ...validLoad,
        id: 1,
        carrier_id: 3,
        weight: 5000,
        dimensions: '10x10x10',
        special_instructions: 'Handle with care'
      };
      
      expect(loadWithOptionals).toHaveProperty('id', 1);
      expect(loadWithOptionals).toHaveProperty('carrier_id', 3);
      expect(loadWithOptionals).toHaveProperty('weight', 5000);
      expect(loadWithOptionals).toHaveProperty('dimensions', '10x10x10');
      expect(loadWithOptionals).toHaveProperty('special_instructions', 'Handle with care');
    });

    test('should enforce load status constraints', () => {
      const validStatuses: LoadStatus[] = [
        'CREATED', 'SEARCHING', 'NEGOTIATING', 'ASSIGNED', 
        'IN_PROGRESS', 'COMPLETED', 'INVOICED', 'PAID', 'CANCELLED'
      ];
      expect(validStatuses).toContain(validLoad.status);
    });
  });

  describe('Carrier Interface', () => {
    const validCarrier: Carrier = {
      name: 'Test Carrier Company',
      contact_email: 'contact@testcarrier.com',
      contact_phone: '9876543210'
    };

    test('should have required properties', () => {
      expect(validCarrier).toHaveProperty('name');
    });

    test('should support optional properties', () => {
      // Check that optional properties can be added
      const carrierWithOptionals: Carrier = {
        ...validCarrier,
        id: 1,
        dot_number: 'DOT123456',
        mc_number: 'MC789012',
        total_trucks: 10,
        active_loads: 5,
        performance_rating: 4.5
      };
      
      expect(carrierWithOptionals).toHaveProperty('id', 1);
      expect(carrierWithOptionals).toHaveProperty('dot_number', 'DOT123456');
      expect(carrierWithOptionals).toHaveProperty('mc_number', 'MC789012');
      expect(carrierWithOptionals).toHaveProperty('total_trucks', 10);
      expect(carrierWithOptionals).toHaveProperty('active_loads', 5);
      expect(carrierWithOptionals).toHaveProperty('performance_rating', 4.5);
    });
  });

  describe('Shipper Interface', () => {
    const validShipper: Shipper = {
      name: 'Test Shipper Company',
      contact_email: 'contact@testshipper.com',
      contact_phone: '5555555555'
    };

    test('should have required properties', () => {
      expect(validShipper).toHaveProperty('name');
    });

    test('should support optional properties', () => {
      // Check that optional properties can be added
      const shipperWithOptionals: Shipper = {
        ...validShipper,
        id: 1,
        address: '123 Shipping St',
        industry_type: 'Electronics',
        frequent_shipper: true
      };
      
      expect(shipperWithOptionals).toHaveProperty('id', 1);
      expect(shipperWithOptionals).toHaveProperty('address', '123 Shipping St');
      expect(shipperWithOptionals).toHaveProperty('industry_type', 'Electronics');
      expect(shipperWithOptionals).toHaveProperty('frequent_shipper', true);
    });
  });

  describe('Factor Interface', () => {
    const validFactor: Factor = {
      name: 'Test Factor Company',
      contact_email: 'contact@testfactor.com',
      contact_phone: '4444444444'
    };

    test('should have required properties', () => {
      expect(validFactor).toHaveProperty('name');
    });

    test('should support optional properties', () => {
      // Check that optional properties can be added
      const factorWithOptionals: Factor = {
        ...validFactor,
        id: 1,
        financing_specialty: 'Trucking',
        max_financing_amount: 500000,
        interest_rate: 5.5
      };
      
      expect(factorWithOptionals).toHaveProperty('id', 1);
      expect(factorWithOptionals).toHaveProperty('financing_specialty', 'Trucking');
      expect(factorWithOptionals).toHaveProperty('max_financing_amount', 500000);
      expect(factorWithOptionals).toHaveProperty('interest_rate', 5.5);
    });
  });
});
