import { useAuthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  HELTH_CENTER_SUBMISSION_STASTUS:
    'api/v1/get_health_center_submission_status_show_for_admin_view/',
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

// Health Center Submission Statusデータベースから取得したデータの構造
export type HelthCenterSubmissionStatusResponse = {
  id: number;
  group_id: number;
  application_type: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

// 既存の団体申請を取得するフック
export const useGetHealthCenterSubmissionStatus = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.HELTH_CENTER_SUBMISSION_STASTUS}/${groupId}`
    : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateHelthCenterSubmissionStatus,
  } = useAuthenticatedGet<ApiResponse<HelthCenterSubmissionStatusResponse>>(
    endpoint
  );

  return {
    healthCenterSubmissionStatus:
      data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
    mutateHelthCenterSubmissionStatus,
  };
};

export type HealthCenterSubmissionStatusInfo =
  HelthCenterSubmissionStatusResponse;
