import {
  useAuthenticatedDelete,
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';
import { ApiResponse } from './api';

const API_ENDPOINTS = {
  EMPLOYEES: '/employees',
  EMPLOYEES_BULK_CREATE: '/employees/bulk_create',
  EMPLOYEES_BULK_UPDATE: '/employees/bulk_update',
  EMPLOYEES_GROUP: '/employees/group',
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

export const useCreateEmployeesBulk = () => {
  return useAuthenticatedPost(API_ENDPOINTS.EMPLOYEES_BULK_CREATE);
};

export const useUpdateEmployee = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.EMPLOYEES}/${id}` : null;
  return useAuthenticatedPatch(endpoint);
};

export const useUpdateEmployeesBulk = () => {
  return useAuthenticatedPatch(API_ENDPOINTS.EMPLOYEES_BULK_UPDATE);
};

export const useDeleteEmployee = (id: number | null) => {
  const endpoint = id !== null ? `${API_ENDPOINTS.EMPLOYEES}/${id}` : null;
  return useAuthenticatedDelete(endpoint);
};
