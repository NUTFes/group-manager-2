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

// Rails enum status の文字列→数値マッピング
// type STATUS_MAP = {
//   unapproved: 0;
//   waiting_resubmission: 1;
//   approved: 2;
//   unsubmitted: 3;
// };

// type APPLICATION_TYPE = {
//   FOOD_PRODUCT: 0;
//   PURCHASE_LIST: 1;
//   COOKING_PROCESS_ORDER: 2;
//   EMPLOYEE: 3;
//   VENUE_MAP: 4;
//   EQUIPMENT: 5;
// };

// type SubmissionItem = {
//   id: number;
//   applicationType: string; // camelcaseKeys により application_type → applicationType に変換される
//   status: string; // Rails enum は文字列で返るが、値は変換されない
// };

export type HealthCenterSubmissionStatus =
  | 'unapproved'
  | 'waiting_resubmission'
  | 'approved'
  | 'unsubmitted';

export type HealthCenterSubmissionStatusResponse = {
  id: number;
  group_id: number;
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
