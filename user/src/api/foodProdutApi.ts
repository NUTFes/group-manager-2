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

/**
 * 単一作成用hook
 */
export const useCreateFoodProduct = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { trigger, isMutating, error } = useAuthenticatedPost(endpoint);

  const createFoodProduct = async (foodProduct: FoodProduct) => {
    return trigger({ body: foodProduct });
  };

  return {
    createFoodProduct,
    isMutating,
    error,
  };
};

/**
 * 複数作成用hook
 */
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

/**
 * 単一更新用hook
 */
export const useUpdateFoodProduct = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { trigger, isMutating, error } = useAuthenticatedPatch(endpoint);

  const updateFoodProduct = async (
    foodProduct: FoodProduct & { id: number }
  ) => {
    return trigger({ body: foodProduct });
  };

  return {
    updateFoodProduct,
    isMutating,
    error,
  };
};

/**
 * 複数更新用hook
 */
export const useUpdateFoodProducts = () => {
  const endpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}`;
  const { trigger, isMutating, error } = useAuthenticatedPatch(endpoint);

  const updateFoodProducts = async (
    foodProducts: (FoodProduct & { id: number })[]
  ) => {
    const request: UpdateFoodProductsRequest = {
      food_products: foodProducts,
    };
    return trigger({ body: request });
  };

  return {
    updateFoodProducts,
    isMutating,
    error,
  };
};
