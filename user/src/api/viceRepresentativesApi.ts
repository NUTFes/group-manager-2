import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { patchFetcher, postFetcher } from './api';

const API_ENDPOINT = '/vice_representatives';

export type FormData = {
  groupId: number;
  isGroup: number;
  name: string;
  number: string;
  grade: number;
  field: number;
  address: string;
};

export type ViceRepresentative = {
  id: number;
  groupId: number;
  isGroup: number;
  name: string;
  number: string;
  grade: number;
  field: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type ViceRepresentativeResponse = {
  id: number;
  groupId: number;
  isGroup: number;
  name: string;
  number: string;
  grade: number;
  field: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetViceRepresentatives = (groupId: number | null) => {
  const endpoint = groupId ? `${API_ENDPOINT}/group/${groupId}` : null;

  const { data, error, isLoading } =
    useApiGet<ApiResponse<ViceRepresentative>>(endpoint);

  return {
    viceRepresentative: data?.status.code === 200 ? data.data : undefined,
    isLoading,
    // hasError: !!error, //groupId関連の実装時に切り替える
    hasError: false,
  };
};

export const useCreateViceRepresentative = () => {
  return useSWRMutation(API_ENDPOINT, postFetcher);
};

export const useUpdateViceRepresentative = (id: number) => {
  return useSWRMutation(`${API_ENDPOINT}/${id}`, patchFetcher);
};
