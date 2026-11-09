// src/api/rentItemsApi.ts
import { useTranslation } from 'next-i18next';
import { useApiMutations, useAuthenticatedGet } from '@/hooks/useApi';
import { legacyPatchFetcher, legacyPostFetcher } from './api';

// APIエンドポイント
const API_ENDPOINTS = {
  // 物品関連
  INSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_inside_shop_rentable_items', // 屋内模擬店での貸出物品
  OUTSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_outside_shop_rentable_items', // 屋外模擬店での貸出物品
  ALL_RENTABLE_ITEMS: '/api/v1/get_all_rentable_items', // 全ての貸出物品

  // 物品申請関連
  RENTAL_ORDERS: '/rental_orders',

  // 未登録グループ関連
  UN_REGISTERED_GROUPS: '/un_registered_groups',
  UN_REGISTERED_GROUPS_GROUP: '/un_registered_groups/group',
};

// 物品マスター情報の型
export type RentalItem = {
  id: number;
  name: string;
  nameEn?: string;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  is_stage_rentable: boolean;
  created_at: string;
  updated_at: string;
};

// 物品申請情報の型
export type RentalOrder = {
  id: number;
  group_id: number;
  rentalItemId: number;
  num: number;
  created_at: string;
  updated_at: string;
};

// ORDER_TYPESの定義（物品申請用）
export const ORDER_TYPES = {
  RENT_ITEMS: 0, // 物品申請を表すタイプ
};

// APIレスポンスの型定義
export type UnRegisteredGroupResponse = {
  id: number;
  group_id: number;
  order_type: number;
  created_at: string;
  updated_at: string;
};

// APIレスポンス型
type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

// 団体タイプに応じた物品一覧を取得するフック (API実装不要)
export const useRentableItemsByType = (locationType: string) => {
  const { i18n } = useTranslation('common');
  // 会場タイプに応じてエンドポイントを選択
  const endpoint =
    locationType === '1'
      ? API_ENDPOINTS.INSIDE_SHOP_RENTABLE_ITEMS
      : API_ENDPOINTS.OUTSIDE_SHOP_RENTABLE_ITEMS;

  const {
    data: response,
    error,
    isLoading,
  } = useAuthenticatedGet<ApiResponse<RentalItem[]>>(endpoint);

  return {
    items:
      response?.data.map((item) => ({
        ...item,
        name:
          i18n.language.startsWith('en') && item.nameEn
            ? item.nameEn
            : item.name,
      })) || [],
    itemsError: error,
    itemsLoading: isLoading,
  };
};

// 全ての貸出物品を取得するフック (実行委員会用を含む)
export const useAllRentableItems = () => {
  const { i18n } = useTranslation('common');
  const {
    data: response,
    error,
    isLoading,
  } = useAuthenticatedGet<ApiResponse<RentalItem[]>>(
    API_ENDPOINTS.ALL_RENTABLE_ITEMS
  );

  return {
    items:
      response?.data.map((item) => ({
        ...item,
        name:
          i18n.language.startsWith('en') && item.nameEn
            ? item.nameEn
            : item.name,
      })) || [],
    itemsError: error,
    itemsLoading: isLoading,
  };
};

// グループIDに紐づく物品申請を取得するフック
export const useRentalOrdersByGroupId = (groupId: number) => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useAuthenticatedGet<ApiResponse<RentalOrder[]>>(
    `${API_ENDPOINTS.RENTAL_ORDERS}/group/${groupId}`
  );

  return {
    rentalOrders: response?.data || [],
    rentalOrdersError: error,
    rentalOrdersLoading: isLoading,
    mutateRentalOrders: mutate,
  };
};

// 物品申請の操作用フック
export const useMutateRentalOrders = () => {
  const { remove } = useApiMutations();
  // 物品申請データを送信
  const submitRentalOrders = async (
    items: Array<{ group_id: number; rental_item_id: number; num: number }>,
    existingItems: RentalOrder[] = []
  ) => {
    try {
      const promises = [];

      // 既存データと新データの長さを比較
      const minLength = Math.min(items.length, existingItems.length);

      // 更新：既存データの数だけ更新を実行
      for (let i = 0; i < minLength; i++) {
        promises.push(
          legacyPatchFetcher(
            `${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`,
            {
              arg: { body: items[i] },
            }
          )
        );
      }

      // 追加：新データが多い場合、残りを新規作成
      if (items.length > existingItems.length) {
        for (let i = existingItems.length; i < items.length; i++) {
          promises.push(
            legacyPostFetcher(API_ENDPOINTS.RENTAL_ORDERS, {
              arg: { body: items[i] },
            })
          );
        }
      }

      // 削除：既存データが多い場合、余分なものを削除
      if (existingItems.length > items.length) {
        for (let i = items.length; i < existingItems.length; i++) {
          promises.push(
            remove(`${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`)
          );
        }
      }

      // 💡 Promise.all から Promise.allSettled に変更（全員の結果を安全に待つ）
      const results = await Promise.allSettled(promises);

      // いずれかのリクエストでエラー（rejected）が発生しているか確認
      const rejectedResult = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined;

      if (rejectedResult) {
        // 失敗したエラーを throw して、安全に下の catch ブロックへ流す
        throw rejectedResult.reason;
      }

      return { success: true };
    } catch (error) {
      console.error('物品申請エラー:', error);
      return { success: false, error };
    }
  };

  // 物品申請を削除
  const deleteRentalOrders = async (itemIds: number[]) => {
    try {
      const promises = itemIds.map((id) =>
        remove(`${API_ENDPOINTS.RENTAL_ORDERS}/${id}`)
      );

      // 💡 削除側も同様に、複数同時エラーでクラッシュしないよう allSettled に変更
      const results = await Promise.allSettled(promises);
      const rejectedResult = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined;

      if (rejectedResult) {
        throw rejectedResult.reason;
      }

      return { success: true };
    } catch (error) {
      console.error('物品申請削除エラー:', error);
      return { success: false, error };
    }
  };

  return {
    submitRentalOrders,
    deleteRentalOrders,
  };
};

export const useRegisterUnRegisteredGroup = () => {
  // 未登録グループを登録
  const registerUnRegisteredGroup = async (data: {
    group_id: number;
    order_type: number;
  }) => {
    try {
      // 修正: 単純なオブジェクトとして送信
      const requestData = {
        un_registered_group: {
          group_id: data.group_id,
          order_type: data.order_type,
        },
      };

      // fetchを使用して送信
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        // エラーレスポンスの詳細を取得
        let errorDetail: string;
        try {
          const errorJson = await response.json();
          errorDetail = JSON.stringify(errorJson);
        } catch {
          errorDetail = await response.text();
        }

        console.error('APIエラーレスポンス:', errorDetail);
        return {
          success: false,
          error: `APIエラー: ${response.status}`,
          details: errorDetail,
        };
      }

      const result = await response.json();

      return { success: true, data: result };
    } catch (error) {
      console.error('UnRegisteredGroup登録エラー:', error);
      return {
        success: false,
        error,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  // 未登録グループを取得
  const getUnRegisteredGroup = async (groupId: number, orderType: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS_GROUP}?group_id=${groupId}&order_type=${orderType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 404の場合は特別に処理（データが見つからない場合は正常）
      if (response.status === 404) {
        return { success: true, exists: false, data: [] };
      }

      if (!response.ok) {
        return {
          success: false,
          error: `APIエラー: ${response.status}`,
        };
      }

      const result = await response.json();

      return {
        success: true,
        exists: result.data && result.data.length > 0,
        data: result.data || [],
      };
    } catch (error) {
      console.error('UnRegisteredGroup取得エラー:', error);
      return {
        success: false,
        exists: false,
        error,
        data: [],
      };
    }
  };

  // 未登録グループを削除
  const deleteUnRegisteredGroup = async (
    groupId: number,
    orderType: number
  ) => {
    try {
      // まず対象データを取得
      const getResult = await getUnRegisteredGroup(groupId, orderType);

      if (!getResult.success) {
        return getResult; // エラーをそのまま返す
      }

      if (!getResult.exists || getResult.data.length === 0) {
        return { success: true, noData: true }; // データがなければ削除不要
      }

      // 削除処理
      const deletePromises = getResult.data.map(
        (item: UnRegisteredGroupResponse) => {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS}/${item.id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      );

      const deleteResponses = await Promise.all(deletePromises);

      // 全ての削除リクエストが成功したか確認
      const allSuccess = deleteResponses.every((response) => response.ok);

      if (allSuccess) {
        return { success: true };
      } else {
        const failedStatuses = deleteResponses
          .filter((response) => !response.ok)
          .map((response) => response.status);

        return {
          success: false,
          error: `削除に失敗: ${failedStatuses.join(', ')}`,
        };
      }
    } catch (error) {
      console.error('UnRegisteredGroup削除エラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return {
    registerUnRegisteredGroup,
    getUnRegisteredGroup,
    deleteUnRegisteredGroup,
  };
};

// 未登録グループの存在確認用フック
export const useCheckUnRegisteredGroup = () => {
  // 未登録グループの存在をチェックする関数
  const checkUnRegisteredGroup = async (groupId: number, orderType: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS_GROUP}?group_id=${groupId}&order_type=${orderType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 404は存在しないという意味なので、エラーではなく「存在しない」という結果を返す
      if (response.status === 404) {
        return { success: true, exists: false };
      }

      if (!response.ok) {
        return {
          success: false,
          exists: false,
          error: `APIエラー: ${response.status}`,
        };
      }

      const result = await response.json();

      return {
        success: true,
        exists: result.data && result.data.length > 0,
      };
    } catch (error) {
      console.error('UnRegisteredGroup確認エラー:', error);
      return {
        success: false,
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return { checkUnRegisteredGroup };
};
