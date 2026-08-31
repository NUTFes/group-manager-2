import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

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
};

export type Group = {
  id: number;
  name: string;
  groupCategoryId: number;
  userId: number;
  fesYearId: number;
  publicRelation?: PublicRelationResponse;
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
  // 特定のgroup_idに関連する公開関係情報を取得するエンドポイント
  const endpoint = groupId
    ? `${API_ENDPOINTS.PUBLIC_RELATIONS}/group/${groupId}`
    : null;

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useAuthenticatedGet<ApiResponse<PublicRelationResponse>>(endpoint);

  // APIからのレスポンスを直接取得
  const publicRelation = response?.status.code === 200 ? response.data : null;

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
  return useAuthenticatedPost(API_ENDPOINTS.PUBLIC_RELATIONS);
};

// SWR Mutationを使った更新用フック
export const useUpdatePublicRelation = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.PUBLIC_RELATIONS}/${id}`);
};
