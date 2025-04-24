import { Device, ORDER_TYPES } from '@/components/Applications/Power/types';
import { useApiGet, useApiMutations } from '@/hooks/useApi';

const API_ENDPOINTS = {
  POWER_ORDERS: '/power_orders',
  UN_REGISTERED_GROUPS: '/un_registered_groups',
};

// APIから返ってくるデータの型定義
export type PowerOrderResponse = {
  id: number;
  groupId: number;
  item: string; // productName
  power: number; // maxPower
  manufacturer: string;
  model: string;
  itemUrl: string; // url
  createdAt: string;
  updatedAt: string;
};

// APIへ送信するデータの型定義
export type PowerOrderData = {
  group_id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
};

// 未登録テーブルのリクエストデータの型定義
export type UnregisteredGroupData = {
  group_id: number;
  order_type: number;
};

// 未登録テーブルのレスポンス型定義
export type UnregisteredGroupResponse = {
  id: number;
  group_id: number;
  order_type: string;
  created_at: string;
  updated_at: string;
};

/**
 * API応答からフロントエンドのデバイスモデルに変換する
 */
const mapResponseToDevice = (response: PowerOrderResponse): Device => ({
  id: response.id,
  productName: response.item,
  maxPower: response.power,
  manufacturer: response.manufacturer,
  model: response.model,
  url: response.itemUrl,
});

/**
 * フロントエンドのデバイスモデルからAPIリクエスト形式に変換する
 */
const mapDeviceToRequestData = (
  device: Device,
  groupId: number
): PowerOrderData => ({
  group_id: groupId,
  item: device.productName,
  power: device.maxPower,
  manufacturer: device.manufacturer,
  model: device.model,
  item_url: device.url || '',
});

/**
 * 電力申請データを取得するフック
 */
export const useGetPowerOrders = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.POWER_ORDERS}?group_id=${groupId}`
    : null;

  const { data, error, isLoading, mutate } = useApiGet<{
    data: PowerOrderResponse[];
  }>(endpoint);

  // グループIDに一致するデバイス一覧を取得して変換
  const devices =
    data?.data
      ?.filter((order) => order.groupId === groupId)
      .map(mapResponseToDevice) || [];

  return {
    devices,
    isLoading,
    hasError: !!error,
    hasExisting: devices.length > 0,
    mutate,
  };
};

/**
 * 未登録テーブルデータを取得するフック
 */
export const useGetUnregisteredGroup = (groupId: number | null) => {
  const endpoint = groupId
    ? `${API_ENDPOINTS.UN_REGISTERED_GROUPS}?group_id=${groupId}&order_type=${ORDER_TYPES.POWER_ORDER}`
    : null;

  const { data, error, isLoading, mutate } = useApiGet<{
    data: UnregisteredGroupResponse[];
  }>(endpoint);

  // 指定されたテーブルIDに一致する未登録テーブルデータがあるか
  const hasUnregistered = data?.data && data.data.length > 0;

  return {
    unregisteredData: data?.data || [],
    isLoading,
    hasError: !!error,
    hasUnregistered,
    mutate,
  };
};

/**
 * 電力申請データを操作するフック
 */
export const useMutatePowerOrders = () => {
  const { post, put, delete: deleteMethod } = useApiMutations();

  /**
   * 複数デバイスの登録・更新を行う
   * 新規作成と更新を自動的に判別して処理する
   */
  const submitPowerOrders = async (
    devices: Device[],
    groupId: number,
    existingDevices?: Device[]
  ) => {
    try {
      // 既存デバイスをIDでマップ化
      const existingDeviceMap = new Map(
        (existingDevices || []).map((d) => [d.id, d])
      );

      const promises = devices.map((device) => {
        const requestData = mapDeviceToRequestData(device, groupId);

        if (device.id && existingDeviceMap.has(device.id)) {
          // 既存デバイスの更新
          return put(`${API_ENDPOINTS.POWER_ORDERS}/${device.id}`, requestData);
        } else {
          // 新規デバイスの作成
          return post(API_ENDPOINTS.POWER_ORDERS, requestData);
        }
      });

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('電力申請送信エラー:', error);
      return { success: false, error };
    }
  };

  /**
   * 単一デバイスの削除
   */
  const deletePowerOrder = async (deviceId: number) => {
    try {
      await deleteMethod(`${API_ENDPOINTS.POWER_ORDERS}/${deviceId}`);
      return { success: true };
    } catch (error) {
      console.error('電力申請削除エラー:', error);
      return { success: false, error };
    }
  };

  /**
   * 未登録テーブルを登録する
   */
  const registerUnregisteredGroup = async (groupId: number) => {
    try {
      const requestData: UnregisteredGroupData = {
        group_id: groupId,
        order_type: ORDER_TYPES.POWER_ORDER,
      };
      await post(API_ENDPOINTS.UN_REGISTERED_GROUPS, requestData);
      return { success: true };
    } catch (error) {
      console.error('未登録テーブル登録エラー:', error);
      return { success: false, error };
    }
  };

  /**
   * 未登録テーブルデータを取得する
   * イベントハンドラや他の関数内での呼び出し用。
   */
  const getUnregisteredGroup = async (groupId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS}?group_id=${groupId}&order_type=${ORDER_TYPES.POWER_ORDER}`
      );

      if (!response.ok) {
        throw new Error('Failed to get unregistered group');
      }

      // レスポンスが空でないことを確認してからJSONをパース
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          const result = JSON.parse(text);
          return {
            success: true,
            data: result.data || [],
          };
        }
      }

      // 空レスポンスまたはJSONでない場合
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error('未登録テーブル取得エラー:', error);
      return { success: false, error, data: [] };
    }
  };

  /**
   * 未登録テーブルデータを削除する
   */
  const deleteUnregisteredGroup = async (groupId: number) => {
    try {
      // まず未登録テーブルを取得
      const result = await getUnregisteredGroup(groupId);
      if (!result.success || result.data.length === 0) {
        return { success: true, noData: true }; // データがなければ削除不要
      }

      // 見つかった場合はIDを使って削除
      const unregisteredGroup = result.data[0];

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.UN_REGISTERED_GROUPS}/${unregisteredGroup.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          return { success: true };
        } else {
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

          return {
            success: false,
            error: errorDetail,
          };
        }
      } catch (fetchError) {
        console.error('未登録テーブル削除通信エラー:', fetchError);
        return {
          success: false,
          error: `通信エラー: ${fetchError instanceof Error ? fetchError.message : '不明なエラー'}`,
        };
      }
    } catch (error) {
      console.error('未登録テーブル削除エラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  };

  return {
    submitPowerOrders,
    deletePowerOrder,
    registerUnregisteredGroup,
    deleteUnregisteredGroup,
    getUnregisteredGroup,
  };
};
