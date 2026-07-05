import {
  useAuthenticatedGet,
  useAuthenticatedPatchWithId,
  useAuthenticatedPost,
} from '@/hooks/useApi';

const API_ENDPOINTS = {
  HEALTH_CENTER_SUBMISSION_STATUS: '/health_center_submission_statuses/user',
  UPDATE_HEALTH_CENTER_SUBMISSION_STATUS:
    '/health_center_submission_statuses/user',
  CREATE_HEALTH_CENTER_SUBMISSION_STATUS:
    '/health_center_submission_statuses/user',
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

export const useCreateHealthCenterSubmissionStatus = () => {
  return useAuthenticatedPost(
    API_ENDPOINTS.CREATE_HEALTH_CENTER_SUBMISSION_STATUS
  );
};

export const useUpdateSubmissionStatusFor = (
  groupId: number | undefined,
  applicationType: string
) => {
  const { healthCenterSubmissionStatus, mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);
  const { trigger: updateTrigger } = useUpdateHealthCenterSubmissionStatus()();
  const { trigger: createTrigger } = useCreateHealthCenterSubmissionStatus();

  return async (status: HealthCenterSubmissionStatus) => {
    const submission = healthCenterSubmissionStatus.find(
      (s) => s.applicationType === applicationType
    );

    if (submission?.id) {
      await updateTrigger({ id: submission.id, body: { status } });
    } else {
      if (!groupId) {
        throw new Error(
          `${applicationType} submission status groupId not found`
        );
      }

      await createTrigger({
        body: {
          group_id: groupId,
          application_type: applicationType,
          status,
        },
      });
    }

    await mutateHealthCenterSubmissionStatus();
  };
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
