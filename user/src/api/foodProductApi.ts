import { ApiResponse } from '@/api/api';
import { useAuthenticatedGet, useAuthenticatedPost } from '@/hooks/useApi';

export type FoodProduct = {
  group_id: number;
  name: string;
  is_cooking: boolean;
  first_day_num: number;
  second_day_num: number;
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

// 一括更新用のリクエスト型（upsert用）
export type UpdateFoodProductsRequest = {
  food_products: (FoodProduct & { id?: number })[];
};

const API_ENDPOINTS = {
  GET_FOOD_PRODUCTS_BY_GROUP_ID: (groupId: number) =>
    `/api/v1/get_food_products_by_group_id/${groupId}`,
  FOOD_PRODUCTS_UPSERT: '/food_products/upsert',
} as const;

export const useGetFoodProducts = (groupId: number | null) => {
  const endpoint = groupId
    ? API_ENDPOINTS.GET_FOOD_PRODUCTS_BY_GROUP_ID(groupId)
    : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<FoodProductResponse[]>>(endpoint);

  // レスポンスからdataを取得
  const foodProducts = data?.data ?? [];

  return {
    foodProducts,
    isLoading,
    error,
    mutateFoodProducts: mutate,
  };
};

/**
 * upsert用hook（現状のuseApi.tsに対応）
 */
export const useUpdateFoodProducts = () => {
  // 現状のuseAuthenticatedPostを使用（missing keyエラーが発生する可能性がある）
  const { trigger, isMutating } = useAuthenticatedPost(
    API_ENDPOINTS.FOOD_PRODUCTS_UPSERT
  );

  const updateFoodProducts = async (data: UpdateFoodProductsRequest) => {
    try {
      // triggerが存在しない場合（セッションロード中など）の対応
      if (!trigger) {
        throw new Error(
          '認証情報を確認中です。しばらく待ってから再度お試しください。'
        );
      }

      const response = await trigger({
        body: data,
      });

      // レスポンスが {data: [...]} 形式の場合
      if (response && typeof response === 'object' && 'data' in response) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      // missing keyエラーの場合は、より分かりやすいメッセージに変換
      if (error instanceof Error && error.message.includes('missing key')) {
        throw new Error(
          '認証情報を確認中です。しばらく待ってから再度お試しください。'
        );
      }
      throw error;
    }
  };

  return {
    trigger: updateFoodProducts,
    isMutating,
  };
};
