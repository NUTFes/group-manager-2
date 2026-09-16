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
    projectName: string | null;
    // 確定した会場名。割り当てが無い場合は空配列
    places: string[];
  };
  // (物品, 貸出場所) ごとにまとめ済み。並び順もAPI側で固定されている
  rentalItems: {
    rentalItemName: string;
    rentalPlaceName: string;
    stocks: {
      stockPlaceName: string;
      num: number;
      // 物品割り当ての備考。未入力の場合はnull
      remark: string | null;
    }[];
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
