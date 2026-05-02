import { useAuthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  HELTH_CENTER_SUBMISSION_STASTUS:
    'api/v1/get_health_center_submission_status_show_for_admin_view',
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

// Rails enum status の文字列→数値マッピング
const STATUS_MAP: Record<string, number> = {
  unapproved: 0,
  waiting_resubmission: 1,
  approved: 2,
  unsubmitted: 3,
};

type SubmissionItem = {
  id: number;
  application_type: string;
  status: string; // Rails enum は文字列で返る
};

type ApiResponseData = {
  group: unknown;
  submissions: SubmissionItem[];
};

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
  } = useAuthenticatedGet<ApiResponse<ApiResponseData>>(endpoint);

  const employeeSubmission =
    data?.status.code === 200
      ? data.data.submissions.find((s) => s.application_type === 'employee')
      : undefined;

  const healthCenterSubmissionStatus:
    | HelthCenterSubmissionStatusResponse
    | undefined = employeeSubmission
    ? {
        id: employeeSubmission.id,
        group_id: groupId!,
        application_type: employeeSubmission.application_type,
        status: STATUS_MAP[employeeSubmission.status] ?? -1,
        createdAt: '',
        updatedAt: '',
      }
    : undefined;

  return {
    healthCenterSubmissionStatus,
    isLoading,
    hasError: !!error,
    mutateHelthCenterSubmissionStatus,
  };
};

export type HealthCenterSubmissionStatusInfo =
  HelthCenterSubmissionStatusResponse;
