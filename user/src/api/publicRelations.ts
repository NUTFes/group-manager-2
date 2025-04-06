import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { postFetcher } from './api';

export type PublicRelation = {
  id: number;
  group_id: number;
  pr_text: string;
  announcement: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: number;
  name: string;
  group_category_id: number;
  user_id: number;
  fes_year_id: number;
  public_relation?: PublicRelation;
};

// APIレスポンス型定義
type ApiResponse<T> = {
  data: T[];
};

const API_ENDPOINTS = {
  PUBLIC_RELATION: '/groups',
  PUBLIC_RELATIONS: '/public_relations',
};

// PR情報を取得するためのカスタムフック
export const usePublicRelationData = (groupId: number) => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useApiGet<ApiResponse<Group>>(
    groupId ? `${API_ENDPOINTS.PUBLIC_RELATION}/${groupId}` : null
  );

  return {
    group: response?.data?.[0] || null,
    publicRelation: response?.data?.[0]?.public_relation || null,
    error,
    isLoading,
    mutate,
  };
};

// PR情報を送信するためのカスタムフック
export const usePublicRelationMutation = () => {
  // 新規作成用
  const createMutation = useSWRMutation(
    API_ENDPOINTS.PUBLIC_RELATIONS,
    postFetcher
  );

  // 更新用
  const updatePublicRelation = async (
    groupId: number,
    data: Record<string, string>
  ) => {
    const url = `${API_ENDPOINTS.PUBLIC_RELATIONS}/${groupId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update public relation');
    }
    return response.json();
  };

  return {
    createMutation,
    updatePublicRelation,
    isLoading: createMutation.isMutating,
  };
};
