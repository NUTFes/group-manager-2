import { useAuthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  HELTH_CENTER_SUBMISSION_STASTUS:
    '/api/v1/get_health_center_submission_status_show_for_admin_view',
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
  applicationType: string; // camelcaseKeys により application_type → applicationType に変換される
  status: string; // Rails enum は文字列で返るが、値は変換されない
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
      ? data.data.submissions.find((s) => s.applicationType === 'employee')
      : undefined;

  const healthCenterSubmissionStatus:
    | HelthCenterSubmissionStatusResponse
    | undefined = employeeSubmission
    ? {
        id: employeeSubmission.id,
        group_id: groupId!,
        application_type: employeeSubmission.applicationType,
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
