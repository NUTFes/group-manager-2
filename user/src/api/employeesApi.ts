import {
  useAuthenticatedDeleteWithId,
  useAuthenticatedGet,
  useAuthenticatedPatchWithId,
  useAuthenticatedPost,
} from '@/hooks/useApi';
import { ApiResponse } from './api';

export const API_ENDPOINTS = {
  EMPLOYEES: '/employees',
  EMPLOYEES_GROUP: '/employees/group',
  EMPLOYEES_UPSERT: '/employees/upsert',
};

export type Employee = {
  id: number;
  groupId: number;
  name: string;
  studentId: string;
  stoolTestId?: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetEmployees = (groupId: number | null) => {
  // 団体が決まるまでは取得しない（全件取得の一覧APIは管理画面向け）
  const endpoint =
    groupId !== null ? `${API_ENDPOINTS.EMPLOYEES_GROUP}/${groupId}` : null;
  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<Employee[]>>(endpoint);

  return {
    employees: data?.data ?? [],
    isLoading,
    hasError: !!error,
    mutateEmployees: mutate,
  };
};

export const useCreateEmployee = () => {
  return useAuthenticatedPost(API_ENDPOINTS.EMPLOYEES);
};

export const useUpsertEmployees = () => {
  return useAuthenticatedPost(API_ENDPOINTS.EMPLOYEES_UPSERT);
};

export const useUpdateEmployee = () => {
  return useAuthenticatedPatchWithId(API_ENDPOINTS.EMPLOYEES);
};

export const useDeleteEmployee = () => {
  return useAuthenticatedDeleteWithId(API_ENDPOINTS.EMPLOYEES);
};
