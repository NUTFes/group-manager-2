import { useApiGet } from '@/hooks/useApi';

export type CookingProcessOrder = {
  group_id: number;
  created_at: string;
  updated_at: string;
  pre_open_kitchen: boolean;
  during_open_kitchen: boolean;
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
  CHECK_ALL_REGISTERED: '/cooking_process_orders',
};

export const useGetCheckAllRegisteredGroups = (groupId: number | undefined) => {
  const endpoint = `${API_ENDPOINTS.CHECK_ALL_REGISTERED}/${groupId}`;

  const { data, error, isLoading, mutate } =
    useApiGet<ApiResponse<CookingProcessOrder>>(endpoint);

  const cookingProcessOrders = data?.data ?? undefined;

  return {
    cookingProcessOrders,
    isLoading,
    error,
    mutateCookingProcessOrders: mutate,
  };
};
