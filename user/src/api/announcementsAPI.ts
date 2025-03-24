import { useApiGet } from '@/hooks/useApi';

// openapiの型定義に変えたい
export type Announcement = {
  id: number;
  group_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const API_ENDPOINTS = {
  ANNOUNCEMENTS: '/announcements',
};

export const useGetAnnouncements = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.ANNOUNCEMENTS}?group_id=${groupId}`
    : null;

  const { data, error, isLoading } = useApiGet<{ data: Announcement[] }>(
    endpoint
  );

  const filteredOrders =
    data?.data?.filter((order) => order.group_id === groupId) || [];
  const announcements = data?.data;

  return {
    announcements,
    isLoading,
    error: !!error,
    hasExisting: filteredOrders.length > 0,
  };
};
