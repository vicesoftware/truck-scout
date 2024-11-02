import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { carriersApi } from './api';

export const CARRIERS_QUERY_KEY = ['carriers'];

export function useCarriers() {
  return useQuery({
    queryKey: CARRIERS_QUERY_KEY,
    queryFn: carriersApi.getAll,
  });
}

export function useCarrierMutations() {
  const queryClient = useQueryClient();

  const createCarrier = useMutation({
    mutationFn: carriersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARRIERS_QUERY_KEY });
    },
  });

  const updateCarrier = useMutation({
    mutationFn: carriersApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARRIERS_QUERY_KEY });
    },
  });

  const deleteCarrier = useMutation({
    mutationFn: carriersApi.delete,
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
