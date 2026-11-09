import useSWRMutation from 'swr/mutation';
import { useAuthenticatedGet } from '@/hooks/useApi';
import {
  legacyDeleteFetcher,
  legacyPatchFetcher,
  legacyPostFetcher,
} from './api';

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

  const {
    data,
    error,
    isLoading,
    mutate: mutateViceRepresentative,
  } = useAuthenticatedGet<ApiResponse<ViceRepresentativeResponse>>(endpoint);

  return {
    viceRepresentative: data?.status.code === 200 ? data.data : undefined,
    isLoading,
    hasError: !!error,
    mutateViceRepresentative,
  };
};

export const useCreateViceRepresentative = () => {
  return useSWRMutation(API_ENDPOINT, legacyPostFetcher);
};

export const useUpdateViceRepresentative = (id: number | undefined) => {
  return useSWRMutation(`${API_ENDPOINT}/${id}`, legacyPatchFetcher);
};

export const useDeleteViceRepresentative = (id: number | undefined) => {
  return useSWRMutation(`${API_ENDPOINT}/${id}`, legacyDeleteFetcher);
};
