import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type FoodProduct = {
  groupId: number;
  name: string;
  isCooking: boolean;
  firstDayNum: number;
  secondDayNum: number;
};

export type FoodProductResponse = {
  id: number;
  groupId: number;
  name: string;
  isCooking: boolean;
  firstDayNum: number;
  secondDayNum: number;
  createdAt: string;
  updatedAt: string;
};

// 一括作成用のリクエスト型
export type CreateFoodProductsRequest = {
  food_products: FoodProduct[];
};

// 一括更新用のリクエスト型
export type UpdateFoodProductsRequest = {
  food_products: (FoodProduct & { id: number })[];
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
  FOOD_PRODUCTS: '/food_products',
  FOOD_PRODUCTS_GROUP: '/food_products/group',
  FOOD_PRODUCTS_UPSERT: '/food_products/upsert',
};

export const useGetFoodProducts = (groupId: number | null) => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS_GROUP}/${groupId}`;
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
export const useUpdateFoodProducts = () => {
  return useAuthenticatedPost(API_ENDPOINTS.FOOD_PRODUCTS_UPSERT);
};
