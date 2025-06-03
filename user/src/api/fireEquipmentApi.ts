import {
  useAuthenticatedGet,
  useAuthenticatedPatch,
  useAuthenticatedPost,
} from '@/hooks/useApi';
import { ApiResponse } from './api';

export enum FireEquipmentFuel {
  GAS_BOTTLE = 1,
  LP_GAS = 2,
  CHARCOAL = 3,
}

export type FireEquipmentResponse = {
  id?: number;
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

const API_ENDPOINTS = {
  FIRE_EQUIPMENT_ORDERS: '/fire_equipment_orders',
};

// グループIDで火気使用申請を取得
export const useGetFireEquipmentOrderByGroupId = (
  groupId: number | undefined
) => {
  const endpoint =
    groupId !== undefined
      ? `${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/group/${groupId}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<FireEquipmentResponse[]>>(endpoint);

  const fireEquipmentOrder = data?.data ?? undefined;

  return {
    fireEquipmentOrder,
    isLoading,
    error,
    mutateFireEquipmentOrder: mutate,
  };
};

// 新規申請
export const usePostFireEquipmentOrder = () => {
  return useAuthenticatedPost(API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS);
};

// 更新
export const usePatchFireEquipmentOrder = (id: number) => {
  return useAuthenticatedPatch(`${API_ENDPOINTS.FIRE_EQUIPMENT_ORDERS}/${id}`);
};
