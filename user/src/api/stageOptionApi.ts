import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

const API_ENDPOINTS = {
  STAGE_OPTIONS: '/stage_common_options',
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

export type StageOption = {
  groupId: number;
  ownEquipment: number;
  bgm: number;
  cameraPermission: number;
  loudSound: number;
};

export type StageOptionResponse = {
  id: number;
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

  const { data, error, isLoading } =
    useAuthenticatedGet<ApiResponse<StageOptionResponse>>(endpoint);

  return {
    stageOptions: data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
  };
};

export const useCreateStageOptions = () => {
  return useAuthenticatedPost(API_ENDPOINTS.STAGE_OPTIONS);
};

export const useUpdateStageOptions = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.STAGE_OPTIONS}/${id}`);
};
