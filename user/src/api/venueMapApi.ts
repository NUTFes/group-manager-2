import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { deleteFetcher, patchFetcher, postFetcher } from './api';

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

// 特定の会場図を取得するためのカスタムフック
export const useGetVenueMap = (id: number | null) => {
  const endpoint = id ? `${API_ENDPOINTS.VENUE_MAPS}/${id}` : null;

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useApiGet<ApiResponse<VenueMapResponse>>(endpoint);

  const venueMap = response?.status.code === 200 ? response.data : null;

  return {
    venueMap,
    error,
    isLoading,
    mutate,
  };
};

// SWR Mutationを使った新規作成用フック
export const useCreateVenueMap = () => {
  return useSWRMutation(API_ENDPOINTS.VENUE_MAPS, postFetcher);
};

// SWR Mutationを使った更新用フック
export const useUpdateVenueMap = (id: number) => {
  return useSWRMutation(`${API_ENDPOINTS.VENUE_MAPS}/${id}`, patchFetcher);
};

// SWR Mutationを使った削除用フック
export const useDeleteVenueMap = (id: number) => {
  return useSWRMutation(`${API_ENDPOINTS.VENUE_MAPS}/${id}`, deleteFetcher);
};
