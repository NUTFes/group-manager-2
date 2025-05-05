import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { deleteFetcher, patchFetcher, postFetcher } from './api';

const API_ENDPOINT = '/sub_reps';

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};
type ApiStatus = { code: number; message: string };

export type ViceRepresentativeResponse = {
  id: number;
  groupId: number;
  name: string;
  departmentId: number;
  gradeId: number;
  tel: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
};

export const useGetViceRepresentatives = (groupId: number | null) => {
  const endpoint = groupId ? `${API_ENDPOINT}/group/${groupId}` : null;

  const { data, error, isLoading } =
    useApiGet<ApiResponse<ViceRepresentativeResponse>>(endpoint);

  return {
    viceRepresentative: data?.status.code === 200 ? data.data : undefined,
    isLoading,
    // hasError: !!error, //groupId関連の実装時に切り替える
    hasError: false,
    error,
  };
};

export const useCreateViceRepresentative = () => {
  return useSWRMutation(API_ENDPOINT, postFetcher);
};

export const useUpdateViceRepresentative = (id: number | undefined) => {
  return useSWRMutation(`${API_ENDPOINT}/${id}`, patchFetcher);
};

export const useDeleteViceRepresentative = (id: number | undefined) => {
  return useSWRMutation(`${API_ENDPOINT}/${id}`, deleteFetcher);
};
