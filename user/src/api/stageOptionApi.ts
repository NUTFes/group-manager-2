import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { patchFetcher, postFetcher } from './api';

const API_ENDPOINTS = {
  STAGE_OPTIONS: '/stage_common_options',
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
  ownEquipment: boolean;
  bgm: boolean;
  cameraPermission: boolean;
  loudSound: boolean;
  created_at: string;
  updated_at: string;
};

// 既存のステージ申請を取得するフック
export const useGetStageOptions = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.STAGE_OPTIONS}/group/${groupId}`
    : null;

  const { data, error, isLoading } = useApiGet<{ data: StageOptionResponse }>(
    endpoint
  );

  return {
    stageOptions: data?.data,
    isLoading,
    hasError: !!error,
  };
};

export const useCreateStageOptions = () => {
  return useSWRMutation(API_ENDPOINTS.STAGE_OPTIONS, postFetcher);
};

export const useUpdateStageOptions = () => {
  return useSWRMutation(API_ENDPOINTS.STAGE_OPTIONS, patchFetcher);
};
