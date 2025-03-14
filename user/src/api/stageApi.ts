import { useApiGet, useApiMutations } from '@/hooks/useApi';
import { addMinutes } from '@/hooks/useStageForm';

export type FesDate = {
  id: number;
  date: string;
};

export type Stage = {
  id: number;
  name: string;
};

const API_ENDPOINTS = {
  FES_DATES: '/api/v1/get_current_fes_dates',
  SUNNY_STAGES: '/sunny/stages',
  RAINY_STAGES: '/rainy/stages',
  STAGE_ORDERS: '/stage_orders',
};

export type StageOrderBase = {
  group_id: number;
  fes_date_id: number;
  is_sunny: boolean;
  stage_first: number;
  stage_second: number;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
};

// 送信用データ型
export type StageOrderData = StageOrderBase;

export type StageOrderResponse = StageOrderBase & {
  id: number;
  prepare_start_time: string | null;
  performance_start_time: string | null;
  performance_end_time: string | null;
  cleanup_end_time: string | null;
  created_at: string;
  updated_at: string;
};

// APIレスポンス型定義
type ApiResponse<T> = {
  data: T[];
  // 必要に応じて他のフィールドを追加
};

// フォームデータの取得用フック
export const useStageFormData = () => {
  const {
    data: fesDateResponse,
    error: fesDateError,
    isLoading: fesDateLoading,
  } = useApiGet<ApiResponse<FesDate>>(API_ENDPOINTS.FES_DATES);

  const {
    data: sunnyStagesResponse,
    error: sunnyStagesError,
    isLoading: sunnyStagesLoading,
  } = useApiGet<ApiResponse<Stage>>(API_ENDPOINTS.SUNNY_STAGES);

  const {
    data: rainyStagesResponse,
    error: rainyStagesError,
    isLoading: rainyStagesLoading,
  } = useApiGet<ApiResponse<Stage>>(API_ENDPOINTS.RAINY_STAGES);

  const isLoading = fesDateLoading || sunnyStagesLoading || rainyStagesLoading;
  const hasError = !!(fesDateError || sunnyStagesError || rainyStagesError);

  return {
    fesDateData: fesDateResponse?.data || [],
    sunnyStagesData: sunnyStagesResponse?.data || [],
    rainyStagesData: rainyStagesResponse?.data || [],
    isLoading,
    hasError,
  };
};

// 既存のステージ申請を取得するフック
export const useExistingStageOrders = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.STAGE_ORDERS}?group_id=${groupId}`
    : null;

  const { data, error, isLoading } = useApiGet<{ data: StageOrderResponse[] }>(
    endpoint
  );

  const filteredOrders =
    data?.data?.filter((order) => order.group_id === groupId) || [];

  const sunnyOrder = filteredOrders.find((order) => order.is_sunny);
  const rainyOrder = filteredOrders.find((order) => !order.is_sunny);

  return {
    sunnyOrder,
    rainyOrder,
    isLoading,
    hasError: !!error,
    hasExistingOrders: filteredOrders.length > 0,
  };
};

// ステージ申請送信用フック
export const useStageOrderSubmission = () => {
  const { post, put } = useApiMutations();

  const submitStageOrder = async (
    sunnyOrderData: StageOrderData,
    rainyOrderData: StageOrderData,
    existingSunnyOrder?: StageOrderResponse,
    existingRainyOrder?: StageOrderResponse
  ) => {
    try {
      const promises = [];

      const formatOrderData = (data: StageOrderData): StageOrderData => ({
        ...data,
        use_time_interval: addMinutes(data.use_time_interval),
        prepare_time_interval: addMinutes(data.prepare_time_interval),
        cleanup_time_interval: addMinutes(data.cleanup_time_interval),
      });

      const formattedSunnyData = formatOrderData(sunnyOrderData);
      const formattedRainyData = formatOrderData(rainyOrderData);

      if (existingSunnyOrder) {
        promises.push(
          put(
            `${API_ENDPOINTS.STAGE_ORDERS}/${existingSunnyOrder.id}`,
            formattedSunnyData
          )
        );
      } else {
        promises.push(post(API_ENDPOINTS.STAGE_ORDERS, formattedSunnyData));
      }

      if (existingRainyOrder) {
        promises.push(
          put(
            `${API_ENDPOINTS.STAGE_ORDERS}/${existingRainyOrder.id}`,
            formattedRainyData
          )
        );
      } else {
        promises.push(post(API_ENDPOINTS.STAGE_ORDERS, formattedRainyData));
      }

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('ステージ申請エラー:', error);
      return { success: false, error };
    }
  };

  return { submitStageOrder };
};
