import { useUnauthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  CONFIRMED_QRCODE: '/api/v1/get_confirmed_qrcode_for_user_view',
};

// APIレスポンス型
type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

export type ConfirmedQrcode = {
  // 確定情報ページのURL。group_idとsecretを含む
  confirmedUrl: string;
  // confirmedUrlをPNG形式でエンコードしたQRコード（data:image/png;base64,...）
  qrcodePng: string;
};

// group_id と secret が両方一致したときだけQRコードを返す（認証不要）
export const useGetConfirmedQrcode = (
  groupId: number | null,
  secret: string | null
) => {
  const endpoint =
    groupId !== null && secret !== null
      ? `${API_ENDPOINTS.CONFIRMED_QRCODE}/${groupId}?secret=${encodeURIComponent(secret)}`
      : null;

  const { data, error, isLoading } = useUnauthenticatedGet<
    ApiResponse<ConfirmedQrcode>
  >(endpoint, {
    // secretが違う間、無限にリトライして404を撃ち続けないようにする
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    confirmedQrcode: data?.data,
    confirmedQrcodeError: error,
    confirmedQrcodeLoading: isLoading,
  };
};
