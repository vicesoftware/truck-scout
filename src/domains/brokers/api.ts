import { Broker, Load, Carrier, Shipper, Factor } from './types';

// Base API error for consistent error handling
class BrokerAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'BrokerAPIError';
  }
}

// Generic fetch function with error handling
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new BrokerAPIError(errorBody, response.status);
    }
    return response.json();
  } catch (error) {
    if (error instanceof BrokerAPIError) throw error;
    throw new BrokerAPIError('Network or parsing error');
  }
}

export const BrokerAPI = {
  // Broker-related methods
  async getBrokers(page = 1, limit = 20): Promise<Broker[]> {
    return apiFetch<Broker[]>(`/api/brokers?page=${page}&limit=${limit}`);
  },

  async getBrokerById(id: number): Promise<Broker> {
    return apiFetch<Broker>(`/api/brokers/${id}`);
  },

  async createBroker(broker: Omit<Broker, 'id'>): Promise<Broker> {
    return apiFetch<Broker>('/api/brokers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broker)
    });
  },

  async updateBroker(id: number, broker: Partial<Broker>): Promise<Broker> {
    return apiFetch<Broker>(`/api/brokers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broker)
    });
  },

  async deleteBroker(id: number): Promise<void> {
    return apiFetch<void>(`/api/brokers/${id}`, { method: 'DELETE' });
  },

  // Load-related methods
  async getLoads(brokerId?: number, page = 1, limit = 20): Promise<Load[]> {
    const url = brokerId 
      ? `/api/loads?broker_id=${brokerId}&page=${page}&limit=${limit}`
      : `/api/loads?page=${page}&limit=${limit}`;
    return apiFetch<Load[]>(url);
  },

  async createLoad(load: Omit<Load, 'id'>): Promise<Load> {
    return apiFetch<Load>('/api/loads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(load)
    });
  },

  // Carrier-related methods
  async getCarriers(page = 1, limit = 20): Promise<Carrier[]> {
    return apiFetch<Carrier[]>(`/api/carriers?page=${page}&limit=${limit}`);
  },

  async getCarrierById(id: number): Promise<Carrier> {
    return apiFetch<Carrier>(`/api/carriers/${id}`);
  },

  // Shipper-related methods
  async getShippers(page = 1, limit = 20): Promise<Shipper[]> {
    return apiFetch<Shipper[]>(`/api/shippers?page=${page}&limit=${limit}`);
  },

  async getShipperById(id: number): Promise<Shipper> {
    return apiFetch<Shipper>(`/api/shippers/${id}`);
  },

  // Factor-related methods
  async getFactors(page = 1, limit = 20): Promise<Factor[]> {
    return apiFetch<Factor[]>(`/api/factors?page=${page}&limit=${limit}`);
  },

  async getFactorById(id: number): Promise<Factor> {
    return apiFetch<Factor>(`/api/factors/${id}`);
  }
};

export default BrokerAPI;
