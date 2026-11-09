import { unauthenticatedGetFetcher } from '@/api/api';
import useSWR from 'swr';

// openapiの型定義に変えたい
export type News = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const API_ENDPOINTS = {
  ANNOUNCEMENTS: '/news',
};

export const useGetNews = () => {
  const endpoint = `${API_ENDPOINTS.ANNOUNCEMENTS}`;

  // TODO: あとでsessionがいらないAPIのuseApiGetを作る
  const { data, error, isLoading } = useSWR<News[]>(
    endpoint,
    unauthenticatedGetFetcher
  );

  const news = data;

  return {
    news,
    isLoading,
    error,
  };
};
