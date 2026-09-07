import { useUnauthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  CONFIRMED_INFO: '/api/v1/get_confirmed_info_for_user_view',
};

// APIレスポンス型
type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

export type ConfirmedInfo = {
  group: {
    id: number;
    name: string;
  };
  assignRentalItems: {
    rentalItemName: string;
    stockPlaceName: string;
    rentalPlaceName: string;
    num: number;
  }[];
};

// group_id と secret が両方一致したときだけ確定情報を返す（認証不要）
export const useGetConfirmedInfo = (
  groupId: number | null,
  secret: string | null
) => {
  const endpoint =
    groupId !== null && secret !== null
      ? `${API_ENDPOINTS.CONFIRMED_INFO}/${groupId}?secret=${encodeURIComponent(secret)}`
      : null;

  const { data, error, isLoading } = useUnauthenticatedGet<
    ApiResponse<ConfirmedInfo>
  >(endpoint, {
    // secretが違う間、無限にリトライして404を撃ち続けないようにする
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    confirmedInfo: data?.data,
    confirmedInfoError: error,
    confirmedInfoLoading: isLoading,
  };
};
