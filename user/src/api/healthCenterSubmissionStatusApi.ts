import {
  useAuthenticatedGet,
  useAuthenticatedPatchWithId,
} from '@/hooks/useApi';

const API_ENDPOINTS = {
  HEALTH_CENTER_SUBMISSION_STATUS:
    '/api/v1/get_health_center_submission_status_show_for_admin_view',
  UPDATE_HEALTH_CENTER_SUBMISSION_STATUS:
    '/api/v1/update_health_center_submission_status',
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

export type HealthCenterSubmissionStatus =
  | 'unapproved'
  | 'waiting_resubmission'
  | 'approved'
  | 'unsubmitted';

export type HealthCenterSubmissionStatusResponse = {
  id: number;
  groupId: number;
  applicationType: string;
  status: HealthCenterSubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type HealthCenterSubmissionStatusApiResponse = ApiResponse<{
  submissions: HealthCenterSubmissionStatusResponse[];
}>;

export const useUpdateHealthCenterSubmissionStatus = () => {
  return useAuthenticatedPatchWithId(
    API_ENDPOINTS.UPDATE_HEALTH_CENTER_SUBMISSION_STATUS
  );
};

// 既存の団体申請を取得するフック
export const useGetHealthCenterSubmissionStatus = (
  groupId: number | undefined
) => {
  const endpoint =
    groupId != null
      ? `${API_ENDPOINTS.HEALTH_CENTER_SUBMISSION_STATUS}/${groupId}`
      : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateHealthCenterSubmissionStatus,
  } = useAuthenticatedGet<HealthCenterSubmissionStatusApiResponse>(endpoint);

  const healthCenterSubmissionStatus: HealthCenterSubmissionStatusResponse[] =
    data?.data.submissions ?? [];

  return {
    healthCenterSubmissionStatus,
    error,
    isLoading,
    mutateHealthCenterSubmissionStatus,
  };
};
