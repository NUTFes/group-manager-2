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
  const endpoint =
    groupId !== null
      ? `${API_ENDPOINTS.EMPLOYEES_GROUP}/${groupId}`
      : API_ENDPOINTS.EMPLOYEES;
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
