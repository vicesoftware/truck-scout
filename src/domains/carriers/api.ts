import { Carrier, CarrierFormData } from './types';

const BASE_URL = '/api/carriers';

export const carriersApi = {
  getAll: async (): Promise<Carrier[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch carriers');
    return response.json();
  },

  create: async (carrierData: CarrierFormData): Promise<Carrier> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carrierData),
    });
    if (!response.ok) throw new Error('Failed to create carrier');
    return response.json();
  },

  update: async (carrier: Carrier): Promise<Carrier> => {
    const response = await fetch(`${BASE_URL}/${carrier.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carrier),
    });
    if (!response.ok) throw new Error('Failed to update carrier');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete carrier');
  },
};
