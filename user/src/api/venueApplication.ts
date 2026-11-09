import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';
import { ApiResponse } from './stageOptionApi';

export type FesDate = {
  id: number;
  date: string;
};

export type Stage = {
  id: number;
  name: string;
};

export type Place = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type PlaceOrder = {
  id: number;
  group_id: number;
  first: number;
  second: number;
  third: number;
  remark: string;
  created_at: string;
  updated_at: string;
};

// APIレスポンス型定義
type ApiDataResponse<T> = {
  data: T[];
};

const API_ENDPOINTS = {
  PLACES: '/places',
  VENUE_MAPS: '/place_orders',
};

// フォームデータの取得用フック
export const usePlacesData = (group_id: number) => {
  const {
    data: fesDateResponse,
    error: fesDateError,
    isLoading: fesDateLoading,
  } = useAuthenticatedGet<ApiDataResponse<Place>>(
    `${API_ENDPOINTS.PLACES}?group_id=${group_id}`
  );
  return {
    places: fesDateResponse?.data || [],
    placesError: fesDateError,
    placesLoading: fesDateLoading,
  };
};

// データ送信用フック
export const usePlacesOrderMutations = () => {
  return useAuthenticatedPost(API_ENDPOINTS.VENUE_MAPS);
};

// データ更新用フック
export const useUpdatePlacesOrderMutations = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.VENUE_MAPS}/${id}`);
};

// 会場申請のデータ取得用フック
export const useGetPlaceOrder = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.VENUE_MAPS}/group/${groupId}`
    : null;

  const { data, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<PlaceOrder>>(endpoint);

  return {
    placeOrder: data?.status.code == 200 ? data?.data : undefined,
    isLoading,
    hasError: data?.status.code !== 200,
    mutate,
  };
};
