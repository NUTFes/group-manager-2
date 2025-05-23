import { useSession } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';
import { useAuthenticatedGet } from '@/hooks/useApi';
import { authenticatedPatchFetcher, authenticatedPostFetcher } from './api';

export type CookingProcessOrder = {
  id: number;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  preOpenKitchen: boolean;
  duringOpenKitchen: boolean;
  tent?: string | null;
};

export type ApiStatus = {
  code: number;
  message: string;
};

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

const API_ENDPOINTS = {
  COOKING_PROCESS_ORDER: '/cooking_process_orders',
};

export const useGetCookingProcessOrder = (groupId: number | undefined) => {
  const endpoint = `${API_ENDPOINTS.COOKING_PROCESS_ORDER}/${groupId}`;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<CookingProcessOrder>>(endpoint);

  const cookingProcessOrders = data?.data ?? undefined;

  return {
    cookingProcessOrders,
    isLoading,
    error,
    mutateCookingProcessOrders: mutate,
  };
};

export const usePostCookingProcessOrder = () => {
  const { data: session } = useSession();
  return useSWRMutation(
    session ? [API_ENDPOINTS.COOKING_PROCESS_ORDER, session] : null,
    authenticatedPostFetcher
  );
};

export const useUpdateCookingProcessOrder = (id: number) => {
  const { data: session } = useSession();
  return useSWRMutation(
    session ? [`${API_ENDPOINTS.COOKING_PROCESS_ORDER}/${id}`, session] : null,
    authenticatedPatchFetcher
  );
};
