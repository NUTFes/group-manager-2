import { useApiMutations, useAuthenticatedGet } from '@/hooks/useApi';

export enum FireEquipmentFuel {
  GAS_BOTTLE = 1,
  LP_GAS = 2,
  CHARCOAL = 3,
}

const fuelStringToEnum: Record<string, FireEquipmentFuel> = {
  gas_bottle: FireEquipmentFuel.GAS_BOTTLE,
  lp_gas: FireEquipmentFuel.LP_GAS,
  charcoal: FireEquipmentFuel.CHARCOAL,
};

type FireEquipmentApiResponse = {
  id: number;
  name: string;
  quantity: number;
  fuel: string;
  usage: string;
  isTakeaway: boolean;
  remark?: string;
  group_id: number;
  created_at?: string;
  updated_at?: string;
};

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

const mapApiResponse = (api: FireEquipmentApiResponse): FireEquipmentResponse => ({
  ...api,
  fuel: fuelStringToEnum[api.fuel] ?? FireEquipmentFuel.GAS_BOTTLE,
  is_takeaway: api.isTakeaway,
});

type ApiStatusResponse<T> = {
  status: { code: number; message: string };
  data: T;
};

const API_ENDPOINTS = {
  FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders',
};

// グループIDで火気使用申請一覧を取得（配列返却）
export const useGetFireEquipmentOrdersByGroupId = (groupId: number | undefined) => {
  const endpoint =
      groupId !== undefined && groupId !== 0
          ? `${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/group/${groupId}`
          : null;

  const { data, error, isLoading, mutate } =
      useAuthenticatedGet<ApiStatusResponse<FireEquipmentApiResponse[]>>(endpoint);

  const fireEquipmentOrders: FireEquipmentResponse[] =
      data?.data?.map(mapApiResponse) ?? [];

  return {
    fireEquipmentOrders,
    isLoading,
    error,
    mutateFireEquipmentOrders: mutate,
  };
};

// 火気申請の登録・更新・削除
export const useFireEquipmentMutations = () => {
  const { post, patch, remove } = useApiMutations();

  const postFireEquipmentOrder = (
      data: Omit<FireEquipmentResponse, 'id' | 'created_at' | 'updated_at'>
  ) => post(API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS, data);

  const patchFireEquipmentOrder = (id: number, data: Partial<FireEquipmentResponse>) =>
      patch(`${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/${id}`, data);

  const deleteFireEquipmentOrder = (id: number) =>
      remove(`${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/${id}`);

  return { postFireEquipmentOrder, patchFireEquipmentOrder, deleteFireEquipmentOrder };
};