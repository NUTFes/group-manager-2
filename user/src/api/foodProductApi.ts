import { ApiResponse } from '@/api/api';
import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type FoodProductResponse = {
  id: number;
  groupId: number;
  name: string;
  isCooking: boolean;
  firstDayNum: number;
  secondDayNum: number;
  isAlcohol: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_ENDPOINTS = {
  FOOD_PRODUCTS: '/food_products',
  FOOD_PRODUCTS_GROUP: '/food_products/group',
  FOOD_PRODUCTS_UPSERT: '/food_products/upsert',
};

export const useGetFoodProducts = (groupId: number | null) => {
  const endpoint =
    groupId && groupId > 0
      ? `${API_ENDPOINTS.FOOD_PRODUCTS_GROUP}/${groupId}`
      : null;
  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<FoodProductResponse[]>>(endpoint);

  return {
    foodProducts: data?.data ?? [],
    isLoading,
    error,
    mutateFoodProducts: mutate,
  };
};

/**
 * 単一作成用hook
 */
export const useCreateFoodProduct = () => {
  return useAuthenticatedPost(API_ENDPOINTS.FOOD_PRODUCTS);
};

/**
 * 単一更新用hook
 */
export const useUpdateFoodProduct = (id: number | null) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.FOOD_PRODUCTS}/${id}`);
};

/**
 * 複数(upsert_all)用hook
 */
export const useUpsertFoodProducts = () => {
  return useAuthenticatedPost(API_ENDPOINTS.FOOD_PRODUCTS_UPSERT);
};
