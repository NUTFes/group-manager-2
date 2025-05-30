import {
  useAuthenticatedDelete,
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

export type PurchaseList = {
  groupId: number;
  foodProductId: number;
  shopId: number;
  fesDateId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string | null;
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

// 新規作成
export const useCreatePurchaseList = () => {
  return useAuthenticatedPost(API_ENDPOINTS.PURCHASE_LIST);
};

// 更新
export const useUpdatePurchaseList = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.PURCHASE_LIST}/${id}` : null;
  return useAuthenticatedPatch(endpoint);
};

// 削除（必要に応じて）
export const useDeletePurchaseList = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.PURCHASE_LIST}/${id}` : null;
  return useAuthenticatedDelete(endpoint);
};

/*
export const useMutatePurchaseLists = () => {
  const { post, put, remove } = useApiMutations();

  const submitPurchaseLists = async (
    items: PurchaseList[],
    existingItems: PurchaseListResponse[] = []
  ) => {
    const promises = [];

    // 既存データの数だけ更新
    const minLength = Math.min(items.length, existingItems.length);
    for (let i = 0; i < minLength; i++) {
      promises.push(
        put(`${API_ENDPOINTS.PURCHASE_LIST}/${existingItems[i].id}`, items[i])
      );
    }

    // 新規作成（新しい分）
    for (let i = existingItems.length; i < items.length; i++) {
      promises.push(post(API_ENDPOINTS.PURCHASE_LIST, items[i]));
    }

    // 余分な分を削除
    for (let i = items.length; i < existingItems.length; i++) {
      promises.push(
        remove(`${API_ENDPOINTS.PURCHASE_LIST}/${existingItems[i].id}`)
      );
    }

    await Promise.all(promises);
    return { success: true };
  };

  return { submitPurchaseLists };
};

*/
