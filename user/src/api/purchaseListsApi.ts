import { useSession } from 'next-auth/react';
import { useAuthenticatedGet /*,useApiMutations:*/ } from '@/hooks/useApi';
import { authenticatedPatchFetcher, authenticatedPostFetcher } from './api';

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

export type PurchaseListResponse = {
  id: number;
  groupId: number;
  foodProductId: number;
  shopId: number;
  fesDateId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string | null;
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
};

// グループIDで取得
export const useGetPurchaseListsByGroupId = (groupId: number | undefined) => {
  const endpoint = `${API_ENDPOINTS.PURCHASE_LIST}/group/${groupId}`;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<PurchaseListResponse[]>>(endpoint);

  const purchaseLists = data?.data ?? undefined;

  return {
    purchaseLists,
    isLoading,
    error,
    mutatePurchaseLists: mutate,
  };
};

// 新規作成
export const usePostPurchaseList = () => {
  const { data: session } = useSession();
  if (!session) return null;
  return authenticatedPostFetcher([API_ENDPOINTS.PURCHASE_LIST, session]);
};

// 更新
export const useUpdatePurchaseList = (id: number) => {
  const { data: session } = useSession();
  if (!session) return null;
  return authenticatedPatchFetcher([
    `${API_ENDPOINTS.PURCHASE_LIST}/${id}`,
    session,
  ]);
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