import { addMinutes } from '@/components/Applications/Stage/hooks/useStageForm';
import {
  useAuthenticatedGet,
  useAuthenticatedPost,
  useAuthenticatedPutWithId,
} from '@/hooks/useApi';

export type FesDate = {
  id: number;
  daysNum: number;
  date: string;
  day: string;
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

export type BaseStageOrder = {
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
export type StageOrderData = BaseStageOrder;

export type StageOrderResponse = {
  id: number;
  groupId: number;
  fesDateId: number;
  isSunny: boolean;
  stageFirst: number;
  stageSecond: number;
  useTimeInterval: string;
  prepareTimeInterval: string;
  cleanupTimeInterval: string;
  prepareStartTime: string | null;
  performanceStartTime: string | null;
  performanceEndTime: string | null;
  cleanupEndTime: string | null;
  createdAt: string;
  updatedAt: string;
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
  } = useAuthenticatedGet<ApiResponse<FesDate>>(API_ENDPOINTS.FES_DATES);

  const {
    data: sunnyStagesResponse,
    error: sunnyStagesError,
    isLoading: sunnyStagesLoading,
  } = useAuthenticatedGet<ApiResponse<Stage>>(API_ENDPOINTS.SUNNY_STAGES);

  const {
    data: rainyStagesResponse,
    error: rainyStagesError,
    isLoading: rainyStagesLoading,
  } = useAuthenticatedGet<ApiResponse<Stage>>(API_ENDPOINTS.RAINY_STAGES);

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
export const useGetStageOrders = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.STAGE_ORDERS}?group_id=${groupId}`
    : null;

  const { data, error, isLoading } = useAuthenticatedGet<{
    data: StageOrderResponse[];
  }>(endpoint);

  const filteredOrders =
    data?.data?.filter((order) => order.groupId === groupId) || [];

  const sunnyOrder = filteredOrders.find((order) => order.isSunny);
  const rainyOrder = filteredOrders.find((order) => !order.isSunny);

  return {
    sunnyOrder,
    rainyOrder,
    isLoading,
    hasError: !!error,
    hasExisting: filteredOrders.length > 0,
  };
};

// ステージ申請送信用フック
export const useMutateStageOrders = () => {
  const { trigger: createStageOrder } = useAuthenticatedPost(
    API_ENDPOINTS.STAGE_ORDERS
  );
  const { trigger: updateStageOrder } = useAuthenticatedPutWithId(
    API_ENDPOINTS.STAGE_ORDERS
  )();

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
          updateStageOrder({
            id: existingSunnyOrder.id,
            body: formattedSunnyData,
          })
        );
      } else {
        promises.push(createStageOrder({ body: formattedSunnyData }));
      }

      if (existingRainyOrder) {
        promises.push(
          updateStageOrder({
            id: existingRainyOrder.id,
            body: formattedRainyData,
          })
        );
      } else {
        promises.push(createStageOrder({ body: formattedRainyData }));
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
