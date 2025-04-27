import { useApiGet, useApiMutations } from '@/hooks/useApi';

export type UnregisteredGroupData = {
  group_id: number;
  order_type: number;
};

export type UnregisteredGroupResponse = {
  id: number;
  group_id: number;
  order_type: string;
  created_at: string;
  updated_at: string;
};

const API_ENDPOINT = '/un_registered_groups';

/**
 * 未登録テーブルデータを取得するフック
 * orderType: number（ORDER_TYPESの値）で任意の申請種別に対応
 */
export const useGetUnregisteredGroup = (
  groupId: number | null,
  orderType: number
) => {
  const endpoint =
    groupId != null
      ? `${API_ENDPOINT}/group?group_id=${groupId}&order_type=${orderType}`
      : null;

  const { data, error, isLoading, mutate } = useApiGet<{
    data: UnregisteredGroupResponse[];
  }>(endpoint);

  const unregisteredData = data?.data?.[0] ?? null;
  const hasUnregistered = !!unregisteredData;

  return {
    unregisteredData,
    isLoading,
    hasError: !!error,
    hasUnregistered,
    mutate,
  };
};

/**
 * 未登録テーブルデータを操作するフック
 */
export const useMutateUnregisteredGroup = (orderType: number) => {
  const { post } = useApiMutations();

  /**
   * 未登録テーブルを登録する
   */
  const registerUnregisteredGroup = async (groupId: number) => {
    try {
      const requestData: UnregisteredGroupData = {
        group_id: groupId,
        order_type: orderType,
      };
      await post(API_ENDPOINT, requestData);
      return { success: true };
    } catch (error) {
      console.error('未登録テーブル登録エラー:', error);
      return { success: false, error };
    }
  };

  /**
   * 未登録テーブルデータを削除する
   */
  const deleteUnregisteredGroup = async (
    unregisteredData: UnregisteredGroupResponse | null
  ) => {
    if (!unregisteredData) {
      return { success: true, noData: true };
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINT}/${unregisteredData.id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      }

      let errorDetail = `削除に失敗しました。ステータス: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorText = await response.text();
          if (errorText) {
            const errorJson = JSON.parse(errorText);
            errorDetail = `削除に失敗しました: ${errorJson.message || JSON.stringify(errorJson)}`;
          }
        }
      } catch (parseError) {
        console.error('エラーレスポンスの解析に失敗:', parseError);
      }
      return { success: false, error: errorDetail };
    } catch (fetchError) {
      console.error('未登録テーブル削除通信エラー:', fetchError);
      return {
        success: false,
        error: `通信エラー: ${fetchError instanceof Error ? fetchError.message : '不明なエラー'}`,
      };
    }
  };

  return {
    registerUnregisteredGroup,
    deleteUnregisteredGroup,
  };
};
