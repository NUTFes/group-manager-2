import {
  useAuthenticatedGet,
  useAuthenticatedPost,
  useAuthenticatedDelete,
} from '@/hooks/useApi';

export type FoodProduct = {
  group_id: number;
  name: string;
  is_cooking: boolean;
  first_day_num: number;
  second_day_num: number;
};

export type FoodProductResponse = {
  id: number;
  group_id?: number;
  groupId?: number; // camelCaseとsnake_case両方に対応
  name: string;
  is_cooking?: boolean;
  isCooking?: boolean; // camelCaseとsnake_case両方に対応
  first_day_num?: number;
  firstDayNum?: number; // camelCaseとsnake_case両方に対応
  second_day_num?: number;
  secondDayNum?: number; // camelCaseとsnake_case両方に対応
  created_at?: string;
  createdAt?: string; // camelCaseとsnake_case両方に対応
  updated_at?: string;
  updatedAt?: string; // camelCaseとsnake_case両方に対応
};

// 一括作成用のリクエスト型
export type CreateFoodProductsRequest = {
  food_products: FoodProduct[];
};

// 一括更新用のリクエスト型（upsert用）
export type UpdateFoodProductsRequest = {
  food_products: (FoodProduct & { id?: number })[];
};

// APIレスポンスの型定義を追加
export type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

const API_ENDPOINTS = {
  FOOD_PRODUCTS: '/food_products',
  FOOD_PRODUCTS_UPSERT: '/food_products/upsert',
};

export const useGetFoodProducts = (groupId: number | null) => {
  // routes.rbで確認した正しいエンドポイント
  let endpoint: string | null = null;

  if (groupId) {
    // 正しいパス: パスパラメータを使用（クエリパラメータではない）
    endpoint = `/api/v1/get_food_products_by_group_id/${groupId}`;
    console.log('✅ Using correct endpoint from routes.rb:', endpoint);
  }

  const { data, error, isLoading, mutate } =
      useAuthenticatedGet<ApiResponse<FoodProductResponse[]>>(endpoint);

  // エラーハンドリング
  if (error) {
    console.error('❌ GET Food Products error:', error);
  }

  console.log('📡 === API RAW RESPONSE DEBUG ===');
  console.log('📦 Full API response:', data);
  console.log('📦 Response type:', typeof data);
  if (data) {
    console.log('📦 Response keys:', Object.keys(data));
    console.log('📦 data.data:', data.data);
    console.log('📦 data.data type:', typeof data.data);
    if (data.data && Array.isArray(data.data)) {
      console.log('📦 data.data.length:', data.data.length);
      if (data.data.length > 0) {
        console.log('📦 First item:', data.data[0]);
        console.log('📦 First item keys:', Object.keys(data.data[0]));
      }
    }
  }

  // レスポンスからdataを取得
  const foodProducts = data?.data ?? [];

  // 成功時のログ
  if (foodProducts && foodProducts.length > 0) {
    console.log('✅ GET Food Products success:', foodProducts);
  } else if (data) {
    console.log('✅ GET Food Products success (empty array):', foodProducts);
  }

  return {
    foodProducts,
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
  const endpoint = id ? `${API_ENDPOINTS.FOOD_PRODUCTS}/${id}` : null;
  return useAuthenticatedPost(endpoint);
};

/**
 * 単一削除用hook
 */
export const useDeleteFoodProduct = (id: number | null) => {
  const endpoint = id ? `${API_ENDPOINTS.FOOD_PRODUCTS}/${id}` : null;
  return useAuthenticatedDelete(endpoint);
};

/**
 * upsert用hook（レスポンス形式を考慮）
 */
export const useUpdateFoodProducts = () => {
  const { trigger, isMutating } = useAuthenticatedPost(API_ENDPOINTS.FOOD_PRODUCTS_UPSERT);

  const updateFoodProducts = async (data: UpdateFoodProductsRequest) => {
    try {
      console.log('📤 Sending upsert to:', API_ENDPOINTS.FOOD_PRODUCTS_UPSERT);
      console.log('📋 Payload:', data);

      const response = await trigger({
        body: data
      });

      // レスポンスが {status: {...}, data: [...]} 形式の場合
      if (response && typeof response === 'object' && 'data' in response) {
        console.log('✅ Upsert success:', response.data);
        return response.data;
      } else {
        console.log('✅ Upsert success:', response);
        return response;
      }
    } catch (error) {
      console.error('❌ Upsert error:', error);
      throw error;
    }
  };

  return {
    trigger: updateFoodProducts,
    isMutating,
  };
};