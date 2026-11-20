import { useAuthenticatedGet } from '@/hooks/useApi';
import { ApiResponse } from './api';

const API_ENDPOINTS = {
  SHOPS: '/shops',
};

export type Shop = {
  id: number;
  name: string;
  tel: string;
  openingHours: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetShops = () => {
  const endpoint = API_ENDPOINTS.SHOPS;
  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<Shop[]>>(endpoint);

  return {
    shops: data?.data ?? [],
    isLoading,
    hasError: !!error,
    mutateShops: mutate,
  };
};
