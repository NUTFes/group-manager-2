import { KeyedMutator } from 'swr';
import {
  useAuthenticatedDelete,
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';

// リクエスト用の型定義
export type VenueMapRequest = {
  groupId: number;
  pictureName: string;
  picturePath: string;
};

// レスポンス用の型定義
export type VenueMapResponse = {
  id: number;
  groupId: number;
  pictureName: string;
  picturePath: string;
  createdAt: string;
  updatedAt: string;
};

type ApiStatus = { code: number; message: string };

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

const API_ENDPOINTS = {
  VENUE_MAPS: '/venue_maps',
};

// データ取得用フック
// groupId に null を渡した場合、API リクエストは実行されません。
export const useGetVenueMap = (groupId: number | null) => {
  const endpoint =
    groupId !== null ? `${API_ENDPOINTS.VENUE_MAPS}/group/${groupId}` : null;
  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<VenueMapResponse>>(endpoint);

  // groupId が null の場合
  if (groupId === null) {
    return {
      venueMap: null,
      error: null,
      isLoading: false, // groupId が null の場合はローディングしない
      // groupId が null のためAPI呼び出しは行われない。
      // mutateVenueMap はインターフェースの一貫性のためにダミー関数を返す。
      mutateVenueMap: (() => Promise.resolve(undefined)) as KeyedMutator<
        ApiResponse<VenueMapResponse>
      >,
    };
  }

  // groupId が存在する場合の通常の処理
  const venueMap = data?.status.code === 200 ? data.data : null;

  return {
    venueMap,
    error: error,
    isLoading: isLoading,
    mutateVenueMap: mutate,
  };
};

// 会場図作成用フック (POST)
export const useCreateVenueMap = () => {
  return useAuthenticatedPost(API_ENDPOINTS.VENUE_MAPS);
};

// 会場図更新用フック (PATCH)
export const usePatchVenueMap = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.VENUE_MAPS}/${id}`);
};

// 会場図削除用フック (DELETE)
export const useDeleteVenueMap = (id: number) => {
  return useAuthenticatedDelete(`${API_ENDPOINTS.VENUE_MAPS}/${id}`);
};
