import {
  useAuthenticatedDelete,
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type PurchaseList = {
  foodProductId: number;
  shopId: number;
  fesDateId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string | null;
};

export type UpdatePurchaseListsRequest = {
  purchaseLists: (PurchaseList & { id?: number })[];
};

export type PurchaseListResponse = PurchaseList & {
  id: number;
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
  PURCHASE_LIST_GROUP: '/purchase_lists/group',
  PURCHASE_LIST_UPSERT: '/purchase_lists/upsert',
  PURCHASE_LIST_FOOD_PRODUCT: '/purchase_lists/food_product',
};

// グループIDで取得
export const useGetPurchaseLists = (groupId: number | null) => {
  const endpoint =
    groupId !== null
      ? `${API_ENDPOINTS.PURCHASE_LIST_GROUP}/${groupId}`
      : API_ENDPOINTS.PURCHASE_LIST;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<PurchaseListResponse[]>>(endpoint);

  return {
    purchaseLists: data?.data ?? [],
    isLoading,
    hasError: !!error,
    mutatePurchaseLists: mutate,
  };
};

// 食品商品IDで取得
export const useGetPurchaseListsByFoodProduct = (
  foodProductId: number | null
) => {
  const endpoint =
    foodProductId !== null
      ? `${API_ENDPOINTS.PURCHASE_LIST_FOOD_PRODUCT}/${foodProductId}`
      : API_ENDPOINTS.PURCHASE_LIST;

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
export const useUpdatePurchaseList = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.PURCHASE_LIST}/${id}` : null;
  return useAuthenticatedPatch(endpoint);
};

//複数申請
export const useUpsertPurchaseLists = () => {
  return useAuthenticatedPost(API_ENDPOINTS.PURCHASE_LIST_UPSERT);
};

// 削除
export const useDeletePurchaseList = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.PURCHASE_LIST}/${id}` : null;
  return useAuthenticatedDelete(endpoint);
};
