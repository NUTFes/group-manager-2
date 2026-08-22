import {
  useAuthenticatedDeleteWithId,
  useAuthenticatedGet,
  useAuthenticatedPost,
} from '@/hooks/useApi';

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

export const ORDER_TYPES = {
  RENTAL_ITEM_ORDER: 0,
  POWER_ORDER: 1,
  SUB_REP: 2,
  EMPLOYEE: 3,
  FIRE_EQUIPMENT_ORDER: 4,
} as const;

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

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

  const { data, error, isLoading, mutate } = useAuthenticatedGet<{
    data: UnregisteredGroupResponse[];
  }>(endpoint);

  const unregisteredData = data?.data?.[0] ?? null;
  const hasUnregistered = !!unregisteredData;

  return {
    unregisteredData,
    isLoading,
    hasError: !!error,
    hasUnregistered,
    mutateUnregisteredGroup: mutate,
  };
};

/**
 * 未登録テーブルデータを操作するフック
 */
export const useMutateUnregisteredGroup = (orderType: number) => {
  const { trigger: postUnregisteredGroup } = useAuthenticatedPost(API_ENDPOINT);
  const { trigger: deleteUnregisteredGroupById } =
    useAuthenticatedDeleteWithId(API_ENDPOINT)();

  /**
   * 未登録テーブルを登録する
   */
  const registerUnregisteredGroup = async (groupId: number) => {
    try {
      const requestData: UnregisteredGroupData = {
        group_id: groupId,
        order_type: orderType,
      };
      await postUnregisteredGroup({ body: requestData });
      return { success: true };
    } catch (error) {
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

    try {
      await deleteUnregisteredGroupById(unregisteredData.id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `通信エラー: ${error instanceof Error ? error.message : '不明なエラー'}`,
      };
    }
  };

  return {
    registerUnregisteredGroup,
    deleteUnregisteredGroup,
  };
};
