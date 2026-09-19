import { Device } from '@/components/Applications/Power/types';
import { useApiMutations, useAuthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  POWER_ORDERS: '/power_orders',
  SUBMIT_POWER_ORDERS: '/power_orders/submit',
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
  id?: number;
  group_id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
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
  id: device.id,
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
    ? `${API_ENDPOINTS.POWER_ORDERS}/group/${groupId}`
    : null;

  const { data, error, isLoading, mutate } = useAuthenticatedGet<{
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
 * 電力申請データを操作するフック
 */
export const useMutatePowerOrders = () => {
  const { put } = useApiMutations();

  /**
   * 複数デバイスの登録・更新・削除と申請ステータス更新を行う
   */
  const submitPowerOrders = async (
    devices: Device[],
    groupId: number,
    usePower: boolean
  ) => {
    try {
      const response = await put(API_ENDPOINTS.SUBMIT_POWER_ORDERS, {
        group_id: groupId,
        use_power: usePower,
        power_orders: devices.map((device) =>
          mapDeviceToRequestData(device, groupId)
        ),
      });

      if (response && 'success' in response && response.success === false) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    submitPowerOrders,
  };
};
