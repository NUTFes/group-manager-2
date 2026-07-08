import { useApiMutations, useAuthenticatedGet } from '@/hooks/useApi';

export enum FireEquipmentFuel {
  GAS_BOTTLE = 1,
  LP_GAS = 2,
  CHARCOAL = 3,
}

// fuelの文字列→数値変換マップ
const fuelStringToEnum: Record<string, FireEquipmentFuel> = {
  gas_bottle: FireEquipmentFuel.GAS_BOTTLE,
  lp_gas: FireEquipmentFuel.LP_GAS,
  charcoal: FireEquipmentFuel.CHARCOAL,
};

// APIから実際に返ってくるレスポンスの型
type FireEquipmentApiResponse = {
  id: number;
  name: string;
  quantity: number;
  fuel: string; // APIは "gas_bottle" などの文字列で返す
  usage: string;
  is_takeaway: boolean;
  remark?: string;
  group_id: number;
  created_at?: string;
  updated_at?: string;
};

// フロント内部で使う型（fuelは数値enum）
export type FireEquipmentResponse = {
  id: number;
  name: string;
  quantity: number;
  fuel: FireEquipmentFuel;
  usage: string;
  is_takeaway: boolean;
  remark?: string;
  group_id: number;
  created_at?: string;
  updated_at?: string;
};

// APIレスポンスをフロント型に変換
const mapApiResponse = (
  api: FireEquipmentApiResponse
): FireEquipmentResponse => ({
  ...api,
  fuel: fuelStringToEnum[api.fuel] ?? FireEquipmentFuel.GAS_BOTTLE,
});

type ApiStatusResponse<T> = {
  status: { code: number; message: string };
  data: T;
};

const API_ENDPOINTS = {
  FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders',
  USER_FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders/user',
  RESUBMIT_FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders/resubmit',
};

// グループIDで火気使用申請を取得
export const useGetFireEquipmentOrderByGroupId = (
  groupId: number | undefined
) => {
  const endpoint =
    groupId !== undefined && groupId !== 0
      ? `${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/group/${groupId}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiStatusResponse<FireEquipmentApiResponse>>(endpoint);

  const fireEquipmentOrder = data?.data ? mapApiResponse(data.data) : undefined;

  return {
    fireEquipmentOrder,
    isLoading,
    error,
    mutateFireEquipmentOrder: mutate,
  };
};

// 火気申請の登録・更新・削除
export const useFireEquipmentMutations = () => {
  const { post, patch, remove } = useApiMutations();

  const postFireEquipmentOrder = (
    data: Omit<FireEquipmentResponse, 'id' | 'created_at' | 'updated_at'>
  ) => post(API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS, data);

  const patchFireEquipmentOrder = (
    id: number,
    data: Partial<FireEquipmentResponse>
  ) => patch(`${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/${id}`, data);

  const deleteFireEquipmentOrder = (id: number) =>
    remove(`${API_ENDPOINTS.USER_FIRE_EQUIPMENT_ORDERS}/${id}`);

  const resubmitFireEquipmentOrder = async (
    data: Partial<FireEquipmentResponse>,
    useFireEquipment: boolean
  ) => {
    try {
      const response = await patch(
        API_ENDPOINTS.RESUBMIT_FIRE_EQUIPMENT_ORDERS,
        {
          group_id: data.group_id,
          id: data.id,
          use_fire_equipment: useFireEquipment,
          fire_equipment_order: data,
        }
      );

      if (response && 'success' in response && response.success === false) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    postFireEquipmentOrder,
    patchFireEquipmentOrder,
    deleteFireEquipmentOrder,
    resubmitFireEquipmentOrder,
  };
};
