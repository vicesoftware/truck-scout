import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Carrier, CarrierFormData } from '@/types/carrier';

const CARRIERS_QUERY_KEY = ['carriers'];

export function useCarriers() {
  return useQuery({
    queryKey: CARRIERS_QUERY_KEY,
    queryFn: async (): Promise<Carrier[]> => {
      console.log('Starting carrier fetch');
      const response = await fetch('/api/carriers');
      console.log('Got response:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch carriers');
      }
      const data = await response.json();
      console.log('Parsed data:', data);
      return data;
    }
  });
}

export function useCarrierMutations() {
  const queryClient = useQueryClient();

  const createCarrier = useMutation({
    mutationFn: async (carrierData: CarrierFormData) => {
      const response = await fetch('/api/carriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrierData),
      });
      if (!response.ok) throw new Error('Failed to create carrier');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARRIERS_QUERY_KEY });
    },
  });

  const updateCarrier = useMutation({
    mutationFn: async (carrier: Carrier) => {
      const response = await fetch(`/api/carriers/${carrier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrier),
      });
      if (!response.ok) throw new Error('Failed to update carrier');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARRIERS_QUERY_KEY });
    },
  });

  const deleteCarrier = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/carriers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete carrier');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARRIERS_QUERY_KEY });
    },
  });

  return {
    createCarrier,
    updateCarrier,
    deleteCarrier,
  };
}
