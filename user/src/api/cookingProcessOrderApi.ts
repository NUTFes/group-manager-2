import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type CookingProcessOrder = {
  groupId: number;
  foodProductId: number;
  preOpenKitchen: boolean;
  duringOpenKitchen: boolean;
  tent?: string | null;
  tentJa?: string | null;
};

export type CookingProcessOrderResponse = {
  id: number;
  groupId: number;
  foodProductId: number;
  createdAt: string;
  updatedAt: string;
  preOpenKitchen: boolean;
  duringOpenKitchen: boolean;
  tent?: string | null;
  tentJa?: string | null;
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
  COOKING_PROCESS_ORDERS_UPSERT: '/cooking_process_orders/upsert',
};

export const useGetCookingProcessOrder = (groupId: number | undefined) => {
  const endpoint =
    groupId !== undefined
      ? `${API_ENDPOINTS.COOKING_PROCESS_ORDER}/group/${groupId}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<CookingProcessOrderResponse[]>>(endpoint);

  const cookingProcessOrders = data?.data ?? [];

  return {
    cookingProcessOrders,
    isLoading,
    error,
    mutateCookingProcessOrders: mutate,
  };
};

export const usePostCookingProcessOrder = () => {
  return useAuthenticatedPost(API_ENDPOINTS.COOKING_PROCESS_ORDER);
};

export const useUpdateCookingProcessOrder = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.COOKING_PROCESS_ORDER}/${id}`);
};

export const useUpsertCookingProcessOrders = () => {
  return useAuthenticatedPost(API_ENDPOINTS.COOKING_PROCESS_ORDERS_UPSERT);
};
