import { useTranslation } from 'next-i18next';
import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

const API_ENDPOINTS = {
  GROUPS: '/groups',
  GROUP_CATEGORIES: '/group_categories',
  GROUP_USERID: '/groups/user',
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
  nameEn?: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupUserIdAndGroupCategoryIdResponse = {
  id: number;
  userId: number;
  groupCategoryId: number;
};

// 既存の団体申請を取得するフック
export const useGetGroups = (groupId: number | null) => {
  const endpoint = groupId ? `${API_ENDPOINTS.GROUPS}/${groupId}` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateGroups,
  } = useAuthenticatedGet<ApiResponse<GroupResponse>>(endpoint);

  return {
    groups: data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
    mutateGroups,
  };
};

// 既存の参加形式を取得するフック
export const useGetGroupCategories = () => {
  const { i18n } = useTranslation('common');
  const endpoint = `${API_ENDPOINTS.GROUP_CATEGORIES}`;

  const { data, error, isLoading } =
    useAuthenticatedGet<ApiResponse<GroupCategoryResponse[]>>(endpoint);

  return {
    groupCategories:
      data?.status.code === 200
        ? data.data.map((category) => ({
            ...category,
            name:
              i18n.language.startsWith('en') && category.nameEn
                ? category.nameEn
                : category.name,
          }))
        : undefined,
    isLoading,
    hasError: !!error,
  };
};

// 既存の参加形式を取得するフック
export const useGetGroupByUserId = (userId: number | undefined) => {
  const endpoint = userId ? `${API_ENDPOINTS.GROUP_USERID}/${userId}` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateGroupByUserId,
  } = useAuthenticatedGet<ApiResponse<GroupUserIdAndGroupCategoryIdResponse>>(
    endpoint
  );

  return {
    groupUserIdAndGroupCategoryId:
      data?.status.code === 200 ? data?.data : undefined,
    isLoading,
    hasError: !!error,
    mutateGroupByUserId,
  };
};

// 新しい団体申請を作成
export const useCreateGroups = () => {
  return useAuthenticatedPost(API_ENDPOINTS.GROUPS);
};

// 既存の団体申請を更新
export const useUpdateGroups = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.GROUPS}/${id}`);
};

export type GroupInfo = GroupResponse;
