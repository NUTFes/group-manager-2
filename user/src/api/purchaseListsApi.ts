import {
  useAuthenticatedDeleteWithId,
  useAuthenticatedGet,
  useAuthenticatedPatchWithId,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type PurchaseList = {
  id: number;
  foodProductId: number;
  shopId: number;
  fesDateId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string | null;
  remark?: string | null;
};

export type PurchaseListResponse = PurchaseList & {
  createdAt: string;
  updatedAt: string;
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
  PURCHASE_LIST: '/purchase_lists',
  PURCHASE_LIST_UPSERT: '/purchase_lists/upsert',
  PURCHASE_LIST_FOOD_PRODUCT: '/purchase_lists/food_product',
};

// 食品商品IDで取得
export const useGetPurchaseListsByFoodProduct = (
  foodProductIds: number[] | null
) => {
  const endpoint =
    foodProductIds && foodProductIds.length > 0
      ? `${API_ENDPOINTS.PURCHASE_LIST_FOOD_PRODUCT}?${new URLSearchParams(
          foodProductIds.map((id) => ['food_product_ids[]', String(id)])
        ).toString()}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<PurchaseListResponse[]>>(endpoint);

  return {
    purchaseLists: data?.data ?? [],
    isLoading,
    hasError: !!error,
    mutatePurchaseLists: mutate,
  };
};

// 新規作成（単件）
export const useCreatePurchaseList = () => {
  return useAuthenticatedPost(API_ENDPOINTS.PURCHASE_LIST);
};

// 更新（単件）
export const useUpdatePurchaseList = () => {
  return useAuthenticatedPatchWithId(API_ENDPOINTS.PURCHASE_LIST);
};

//複数申請
export const useUpsertPurchaseLists = () => {
  return useAuthenticatedPost(API_ENDPOINTS.PURCHASE_LIST_UPSERT);
};

// 削除
export const useDeletePurchaseList = () => {
  return useAuthenticatedDeleteWithId(API_ENDPOINTS.PURCHASE_LIST);
};
