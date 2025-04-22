import camelcaseKeys from 'camelcase-keys';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { patchFetcher, postFetcher } from './api';

// リクエスト用の型定義
export type PublicRelation = {
  groupId: number;
  blurb: string;
  pictureName: string;
  picturePath: string;
  isAnnouncementRequested: boolean;
};

// レスポンス用の型定義
export type PublicRelationResponse = {
  id: number;
  groupId: number;
  blurb: string;
  pictureName: string;
  picturePath: string;
  isAnnouncementRequested: boolean;
  createdAt: string;
  updatedAt: string;

  // バックエンドから返されるスネークケース形式のフィールド
  group_id?: number;
  picture_name?: string;
  picture_path?: string;
  is_announcement_requested?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Group = {
  id: number;
  name: string;
  group_category_id: number;
  user_id: number;
  fes_year_id: number;
  public_relation?: PublicRelationResponse;
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

const API_ENDPOINTS = {
  PUBLIC_RELATION: '/groups',
  PUBLIC_RELATIONS: '/public_relations',
};

// PR情報を取得するためのカスタムフック
export const usePublicRelationData = (groupId: number) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // カスタムフェッチ関数
  const customFetcher = async (url: string) => {
    try {
      // APIのURLを環境変数から取得
      const fullUrl = `${apiUrl}${url}`;
      console.log('Fetching data from:', fullUrl);

      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const json = await response.json();
      console.log('Raw API response:', json);
      return camelcaseKeys(json, { deep: true });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  };

  // 特定のgroup_idに関連する公開関係情報を取得するエンドポイント
  const endpoint = `${API_ENDPOINTS.PUBLIC_RELATIONS}/group/${groupId}`;
  console.log('Fetching with endpoint:', endpoint);

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponse<PublicRelationResponse>>(endpoint, customFetcher);

  // Debug the API response
  console.log('API Response:', response);

  // APIからのレスポンスを直接取得
  const publicRelation = response?.status.code === 200 ? response.data : null;

  console.log('Filtered publicRelation:', publicRelation);

  return {
    group: null,
    publicRelation,
    error,
    isLoading,
    mutate,
  };
};

// SWR Mutationを使った新規作成用フック
export const useCreatePublicRelation = () => {
  return useSWRMutation(API_ENDPOINTS.PUBLIC_RELATIONS, postFetcher);
};

// SWR Mutationを使った更新用フック
export const useUpdatePublicRelation = (id: number) => {
  return useSWRMutation(
    `${API_ENDPOINTS.PUBLIC_RELATIONS}/${id}`,
    patchFetcher
  );
};
