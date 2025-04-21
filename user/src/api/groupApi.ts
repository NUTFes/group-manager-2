import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { patchFetcher, postFetcher } from './api';

const API_ENDPOINTS = {
  GROUPS: '/groups',
  GROUP_CATEGORIES: '/group_categories',
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

// Groupsデータベースから取得したデータの構造
export type GroupResponse = {
  id: number;
  name: string;
  projectName: string;
  activity: string;
  userId: number;
  groupCategoryId: number;
  fesYearId: number;
  isInternational: boolean;
  committee: boolean;
  isExternal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GroupCategoryResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 既存の団体申請を取得するフック
export const useGetGroups = (groupId: number | null) => {
  const endpoint = groupId ? `${API_ENDPOINTS.GROUPS}/${groupId}` : null;

  const { data, error, isLoading } =
    useApiGet<ApiResponse<GroupResponse>>(endpoint);

  return {
    groups: data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
  };
};

// 既存の参加形式を取得するフック
export const useGetGroupCategories = () => {
  const endpoint = `${API_ENDPOINTS.GROUP_CATEGORIES}`;

  const { data, error, isLoading } =
    useApiGet<ApiResponse<GroupCategoryResponse[]>>(endpoint);

  return {
    groupCategories: data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
  };
};

// 新しい団体申請を作成
export const useCreateGroups = () => {
  return useSWRMutation(API_ENDPOINTS.GROUPS, postFetcher);
};

// 既存の団体申請を更新
export const useUpdateGroups = (id: number) => {
  return useSWRMutation(`${API_ENDPOINTS.GROUPS}/${id}`, patchFetcher);
};
