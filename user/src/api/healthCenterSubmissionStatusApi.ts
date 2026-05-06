import useSWR from 'swr';

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

// type ApiResponseData = {
//   group: unknown;
//   submissions: SubmissionItem[];
// };

export type HealthCenterSubmissionStatusResponse = {
  id: number;
  group_id: number;
  application_type: string;
  status: string;
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
  } = useSWR(endpoint);

  const healthCenterSubmissionStatus: HealthCenterSubmissionStatusResponse =
    data;

  return {
    healthCenterSubmissionStatus,
    error,
    isLoading,
    mutateHelthCenterSubmissionStatus,
  };
};
