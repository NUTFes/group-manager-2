import { useAuthenticatedGet, useAuthenticatedPut } from '@/hooks/useApi';

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
  groupId: number;
  createdAt?: string;
  updatedAt?: string;
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

const mapApiResponse = (
  api: FireEquipmentApiResponse
): FireEquipmentResponse => ({
  id: api.id,
  name: api.name,
  quantity: api.quantity,
  fuel: fuelStringToEnum[api.fuel] ?? FireEquipmentFuel.GAS_BOTTLE,
  usage: api.usage,
  is_takeaway: api.isTakeaway,
  remark: api.remark,
  group_id: api.groupId,
  created_at: api.createdAt,
  updated_at: api.updatedAt,
});

type ApiStatusResponse<T> = {
  status: { code: number; message: string };
  data: T;
};

const API_ENDPOINTS = {
  FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders',
  SUBMIT_FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders/submit',
};

export const useGetFireEquipmentOrdersByGroupId = (
  groupId: number | undefined
) => {
  const endpoint =
    groupId !== undefined && groupId !== 0
      ? `${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/group/${groupId}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiStatusResponse<FireEquipmentApiResponse[]>>(
      endpoint
    );

  const fireEquipmentOrders: FireEquipmentResponse[] =
    data?.data?.map(mapApiResponse) ?? [];

  return {
    fireEquipmentOrders,
    isLoading,
    error,
    mutateFireEquipmentOrders: mutate,
  };
};

export const useFireEquipmentMutations = () => {
  const { trigger: submit } = useAuthenticatedPut(
    API_ENDPOINTS.SUBMIT_FIRE_EQUIPMENT_ORDERS
  );

  const submitFireEquipmentOrders = async (
    items: Partial<FireEquipmentResponse>[],
    groupId: number
  ) => {
    try {
      await submit({
        body: {
          group_id: groupId,
          fire_equipment_orders: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            fuel: item.fuel,
            usage: item.usage,
            is_takeaway: item.is_takeaway,
            remark: item.remark,
          })),
        },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    submitFireEquipmentOrders,
  };
};
