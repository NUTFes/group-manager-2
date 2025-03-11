import { useApiGet, useApiMutations } from '@/hooks/useApi';

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

export type StageOrderData = {
  group_id: number;
  fes_date_id: number;
  is_sunny: boolean;
  stage_first?: number;
  stage_second?: number;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
  remarks: string;
};

// APIレスポンス型定義
type ApiResponse<T> = {
  data: T[];
  // 必要に応じて他のフィールドを追加
};

// フォームデータの取得用フック
export const useStageFormData = () => {
  const { data: fesDateResponse, error: fesDateError, isLoading: fesDateLoading } = 
    useApiGet<ApiResponse<FesDate>>(API_ENDPOINTS.FES_DATES);
  
  const { data: sunnyStagesResponse, error: sunnyStagesError, isLoading: sunnyStagesLoading } = 
    useApiGet<ApiResponse<Stage>>(API_ENDPOINTS.SUNNY_STAGES);
  
  const { data: rainyStagesResponse, error: rainyStagesError, isLoading: rainyStagesLoading } = 
    useApiGet<ApiResponse<Stage>>(API_ENDPOINTS.RAINY_STAGES);
  
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

// ステージ申請送信用フック
export const useStageOrderSubmission = () => {
  const { post } = useApiMutations();
  const submitStageOrder = async (
    sunnyOrderData: StageOrderData,
    rainyOrderData: StageOrderData
  ) => {
    try {
      await Promise.all([
        post(API_ENDPOINTS.STAGE_ORDERS, sunnyOrderData),
        post(API_ENDPOINTS.STAGE_ORDERS, rainyOrderData)
      ]);
      return { success: true };
    } catch (error) {
      console.error('ステージ申請エラー:', error);
      return { success: false, error };
    }
  };

  return { submitStageOrder };
};
