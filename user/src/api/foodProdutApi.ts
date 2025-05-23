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

const API_ENDPOINTS = {
  FOOD_PRODUCTS: '/food_products',
};

export const useGetFoodProducts = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<FoodProductResponse[]>(endpoint);

  return {
    foodProducts: data ?? [],
    isLoading,
    error,
    mutateFoodProducts: mutate,
  };
};

export const useCreateFoodProducts = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { trigger, isMutating, error } = useAuthenticatedPost(endpoint);

  const createFoodProducts = async (foodProducts: FoodProduct[]) => {
    const request: CreateFoodProductsRequest = {
      food_products: foodProducts,
    };
    return trigger({ body: request });
  };

  return {
    createFoodProducts,
    isMutating,
    error,
  };
};

export const useUpdateFoodProducts = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { trigger, isMutating, error } = useAuthenticatedPatch(endpoint);

  return {
    trigger,
    isMutating,
    error,
  };
};
