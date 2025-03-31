import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { postFetcher } from './api';

const API_ENDPOINTS = {
  STAGE_OPTIONS: 'stage_common_options',
};

export type StageOption = {
  groupId: number;
  ownEquipment: number;
  bgm: number;
  cameraPermission: number;
  loudSound: number;
};

export type StageOptionResponse = {
  groupId: number;
  ownEquipment: number;
  bgm: number;
  cameraPermission: number;
  loudSound: number;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = {
  data: T[];
};

export const useStageOption = () => {
  const { data, error, isLoading } = useApiGet<
    ApiResponse<StageOptionResponse>
  >(API_ENDPOINTS.STAGE_OPTIONS);

  return {
    stageOptionDate: data?.data || [],
    isLoading,
    error,
  };
};

// 既存のステージ申請を取得するフック
export const useGetStageOptions = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.STAGE_OPTIONS}?group_id=${groupId}`
    : null;

  const { data, error, isLoading } = useApiGet<{ data: StageOption[] }>(
    endpoint
  );

  const filtered =
    data?.data?.filter((order) => order.groupId === groupId) || [];

  return {
    stageOptions: filtered,
    isLoading,
    hasError: !!error,
  };
};

export const useMutateStageOptions = () => {
  return useSWRMutation(API_ENDPOINTS.STAGE_OPTIONS, postFetcher);
};
