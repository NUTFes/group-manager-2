import useSWRMutation from 'swr/mutation';
import { useApiGet } from '@/hooks/useApi';
import { postFetcher } from './api';

export type FesDate = {
  id: number;
  date: string;
};

export type Stage = {
  id: number;
  name: string;
};

const API_ENDPOINTS = {
  PLACES: '/places',
  VENUE_MAPS: '/place_orders',
};

export type Place = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

// APIレスポンス型定義
type ApiResponse<T> = {
  data: T[];
};

// フォームデータの取得用フック
export const usePlacesData = () => {
  const {
    data: fesDateResponse,
    error: fesDateError,
    isLoading: fesDateLoading,
  } = useApiGet<ApiResponse<Place>>(API_ENDPOINTS.PLACES);
  return {
    places: fesDateResponse?.data || [],
    placesError: fesDateError,
    placesLoading: fesDateLoading,
  };
};

// データ送信用フック
export const usePlacesOrderMutations = () => {
  const urlPath = API_ENDPOINTS.VENUE_MAPS;
  return useSWRMutation(urlPath, postFetcher);
};
