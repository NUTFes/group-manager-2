import { useAuthenticatedGet } from '@/hooks/useApi';

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
  const { data, error, isLoading } = useAuthenticatedGet<News[]>(endpoint);

  const news = data;

  return {
    news,
    isLoading,
    error,
  };
};
